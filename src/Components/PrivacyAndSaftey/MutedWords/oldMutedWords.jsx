// WARNING ! ! ! This code is terrible

import StandardInput from "../../StandardInput/StandardInput";
import { useForm } from "react-hook-form";
import Button from "../../Button/Button";
import { useEffect, useState } from "react";
import commonWords from "./commonWords";
import StandardRadioOptions from "../../StandardRadioOptions/StandardRadioOptions";
import stringDifferenceInDatesToDispayableFormat from "./stringDifferenceInDatesToDisplayableFormat";

// Pass the set selected option as a prompt to allow users to return to the base account options page

const MutedWords = ({ setSelectedOption }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm();

  // Options are 'muted-word-display' and 'add-muted-words' as of 1/18/25

  const [screenDisplayed, setScreenDisplayed] = useState("muted-word-display");

  // Check if the word a user is entering is a common word, then alerting them if this is the case

  const [commonWordError, setCommonWordError] = useState(false);

  // This state is a placeholder

  const [mutedWords, setMutedWords] = useState([]);

  const [selectedMuteFromValue, setSelectedMuteFromValue] =
    useState("fromAnyone");
  const [selectedDurationValue, setSelectedDurationValue] = useState(
    "untilYouUnmuteTheWord"
  );

  const checkboxOptions = {
    muteFrom: [
      { label: "From anyone", value: "fromAnyone" },
      {
        label: "From people you don't follow",
        value: "fromPeopleYouDontFollow",
      },
    ],
    duration: [
      { label: "Until you unmute the word", value: "untilYouUnmuteTheWord" },
      { label: "24 Hours", value: "twentyFourHours" },
      { label: "7 Days", value: "sevenDays" },
      { label: "30 Days", value: "thirtyDays" },
    ],
  };

  // The following state is called backend error, but it refers to any error found on the backend, such as sever issues as well as errors due to a lack of authenticaiton

  const [backendError, setBackendError] = useState(null);
  const [success, setSuccess] = useState(false);

  const token = JSON.parse(localStorage.getItem("jsonwebtoken"));

  // Fetch users existing muted words. This should occur when the page loads, and when a word is deleted

  const fetchMutedWords = () => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/settings/getAllMutedWords`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setMutedWords(data))
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    fetchMutedWords();
  }, []);

  // Add muted words

  const onSubmit = (data) => {
    const muteDurationStringToSecondConversionTable = {
      untilYouUnmuteTheWord: null,
      twentyFourHours: 86400,
      sevenDays: 604800,
      thirtyDays: 2592000,
    };

    const addMutedWordRequestBody = {
      mutedWord: data.wordToMute,
      mutedFrom: selectedMuteFromValue,
      muteDuration:
        muteDurationStringToSecondConversionTable[selectedDurationValue],
    };

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/settings/addMutedWord`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(addMutedWordRequestBody),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            setSuccess(false);
            setBackendError(
              errorData.message || "An unexpected error occurred"
            );
            throw new Error(
              errorData.message || "An unexpected error occurred"
            );
          });
        }
        setSuccess(true);
        setBackendError(null);
        setScreenDisplayed('muted-word-display')
        fetchMutedWords()
        return response.json();
      })
      .then((data) => console.log(data))
      .catch((err) => {
        console.error("Error adding muted word", err);
      });
      reset()
  };

  // Delete muted words

  const handleDeleteMutedWord = (muted_word) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/settings/deleteMutedWord/${muted_word}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to delete muted word: ${response.status} ${response.statusText}`
          );
        }
        response.json();
      })
      .then((data) => {
        console.log("Muted word deleted successfully:", data);
        fetchMutedWords();
      })
      .catch((err) => {
        console.error("Error deleting muted word: ", err);
      });
  };

  const mutedWordInputRequirements = {
    required: "This field is required",
    maxLength: {
      value: 250,
      message: "Word must be no longer then 250 characters",
    },
  };

  const watchedMutedWordInput = watch("wordToMute");

  useEffect(() => {
    if (commonWords.includes(watchedMutedWordInput)) {
      setCommonWordError(true);
    } else {
      setCommonWordError(false);
    }
  }, []);

  return (
    <>
      {screenDisplayed === "muted-word-display" && (
        <>
          <div className="settings-subsection-header">
            <button
              className="text-only-button settings-arrow-btn"
              onClick={() => setSelectedOption("base-page")}
            >
              🡰
            </button>
            <h4>Mute words</h4>
            <button
              className="text-only-button add-muted-word-button"
              onClick={() => setScreenDisplayed("add-muted-words")}
            >
              +
            </button>
          </div>
          {mutedWords.length > 0 ? (
            <>
              <p className="greyed-text settings-sub-page-sub-text">
                When you mute words, you won't get any new notifications for posts that include them or see posts with those words in your Home timeline
              </p>
              <hr className="default-grey-line no-margin" />
              <div className="muted-word-list-container">
                {mutedWords.map((word, index) => (
                  <div key={index} className="muted-word-list-row">
                    <div className="muted-word-and-duration">
                      <p className="muted-word-text">{word.muted_word}</p>
                      <p className="muted-word-duration">
                        {stringDifferenceInDatesToDispayableFormat(
                          word.muted_at,
                          word.muted_until
                        )}
                      </p>
                    </div>
                    <button
                      className="text-only-button remove-muted-word-button"
                      onClick={() => handleDeleteMutedWord(word.muted_word)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="lack-of-muted-words-text-container">
              <h2>Add muted words</h2>
              <p className="greyed-text">
              When you mute words, you won’t get any new notifications for posts that include them or see posts with those words in your Home timeline. 
              </p>
            </div>
          )}
        </>
      )}
      {screenDisplayed === "add-muted-words" && (
        <>
          <div className="settings-subsection-header add-muted-word-header">
            <button
              className="text-only-button settings-arrow-btn"
              onClick={() => setScreenDisplayed("muted-word-display")}
            >
              🡰
            </button>
            <h4>Add muted word</h4>
            <button
              className="text-only-button add-muted-word-button"
              onClick={() => setScreenDisplayed("add-muted-words")}
            >
              +
            </button>
          </div>
          <form
            className="add-muted-word-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="muted-word-input-and-warnings-container">
              <StandardInput
                className={`muted-word-standard-input ${
                  commonWordError && "yellow-border-and-label-children"
                }`}
                label="Enter word or phrase"
                name="wordToMute"
                type="text"
                register={register}
                requirements={mutedWordInputRequirements}
                displayMaxLength={true}
                error={errors.wordToMute} // Check if this auth error stuff needs to be here. Also check the auth error lsightly below
              />
              <p className="mute-information-text">
                You can mute one word or phrase at a time
              </p>
              <p className="common-word-alert">
                {commonWordError &&
                  "This is a pretty common word, and shows up in lots of posts, but you can mute it if you want."}
              </p>
            </div>
            <hr className="default-grey-line " />
            <h3 className="twenty-px-horizontal-margin">Mute from</h3>
            <StandardRadioOptions
              options={checkboxOptions.muteFrom}
              selectedValue={selectedMuteFromValue}
              setSelectedValue={setSelectedMuteFromValue}
            />
            <hr className="default-grey-line " />
            <h3 className="twenty-px-horizontal-margin">Duration</h3>
            <StandardRadioOptions
              options={checkboxOptions.duration}
              selectedValue={selectedDurationValue}
              setSelectedValue={setSelectedDurationValue}
            />
            <Button variant="default-colorful" size="small" type="submit">
              Save
            </Button>
            {backendError && (
              <p className="backend-error-text">{backendError}</p>
            )}
            {success && (
              <p className="success-text center-text">Muted word added!</p>
            )}
          </form>
        </>
      )}
    </>
  );
};

export default MutedWords;
