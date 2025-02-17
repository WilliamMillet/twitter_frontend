import "./SignupPage.css";
import { useForm } from "react-hook-form";
import StandardInput from "../../Components/StandardInput/StandardInput";
import validationRules from "./validationRules.js";
import { useEffect, useState } from "react";
import { useDaysInMonth } from "../../hooks/useDaysInMonth";
import Button from "../../Components/Button/Button";
import flattenOneLayer from "../../utils/flattenOneLayer.js";
import { useNavigate } from 'react-router-dom'
import useFetchData from "../../hooks/useFetchData";


const SignupPage = () => {
const {
  register,
  handleSubmit,
  watch,
  formState: { errors, isValid },
} = useForm();

const currentYear = new Date().getFullYear();
const years = Array.from(new Array(120), (val, index) => currentYear - index);

const [currentStep, setCurrentStep] = useState(1);
const [usingPhone, setUsingPhone] = useState(true);
const [tempData, setTempData] = useState({
  step1: {},
  step2: {},
});
const [wrongFileType, setWrongFileType] = useState(false);

const navigate = useNavigate()

const onSubmit = (data) => {
  // Save the first two steps of the form. No need to save the third as that will be considered in data
  if (currentStep < 3) {
    setTempData((prevTempData) => ({
      ...prevTempData,
      [`step${currentStep}`]: data,
    }));
      goToNextStep();
  } else if (currentStep === 3) {

    const flattenedData = flattenOneLayer(tempData)

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(flattenedData)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(error => {
            throw new Error(error.error || 'Something went wrong')
        })
      }
      return response.json()
    })
    .then(signupData => {
      console.log('User created successfully:', signupData);
      localStorage.setItem('jsonwebtoken', JSON.stringify(signupData.token))
      localStorage.setItem('user_display_name', JSON.stringify(data.name))
      localStorage.setItem('user_identifying_name', JSON.stringify(data.name))
    })
    .catch(error => {
      console.error('Error:', error.message);
    })

    const contentType = data['profile-picture'][0]?.type

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/generatePreSignedUrl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileType: contentType })
    })
    .then(response => response.json())
    .then(preSignedUrlData => {
      fetch(preSignedUrlData.url, {
        method: 'PUT',
        body: data['profile-picture'][0],
        headers: {
          'Content-Type': contentType
        }
      })
      .then(uploadResponse  => {
        console.log("Profile picture uploaded successfully");

        fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/updateProfileLink`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: data.name,
            uniqueId: preSignedUrlData.uniqueId,
          })            
        })
        .then(response => response.json())
        .then(updateProfileLinkData => {
          console.log(updateProfileLinkData)
          localStorage.setItem('profile_link_suffix', JSON.stringify(preSignedUrlData.uniqueId))
          navigate('/'); 
        })
        .catch(error => {
          console.error("Error uploading profile picture: ", error)
        })


      })
      .catch(error => {
        console.error("Error uploading profile picture: ", error);
      });
    })
    .catch(error => {
      console.error('Error uploading profile picture: ', error);  
    })
  }
};

const [imageUrl, setImageUrl] = useState(null)

const watchedPassword = watch("password");

const watchedProfilePicture = watch("profile-picture");

useEffect(() => {
  if (watchedProfilePicture && watchedProfilePicture.length > 0) {
    const imageType = watchedProfilePicture[0]?.type;
    setWrongFileType(!["image/jpeg", "image/png"].includes(imageType));
    if (["image/jpeg", "image/png"].includes(imageType)) {
      setImageUrl(URL.createObjectURL(watchedProfilePicture[0]));
    }
  } else {
    setImageUrl(null);
  }
}, [watchedProfilePicture]);

const toggleUsingPhone = () => {
  setUsingPhone((prevUsingPhone) => !prevUsingPhone);
};

const goToNextStep = () => {
  setCurrentStep((prevStep) => prevStep + 1);
};

const selectedMonth = watch("month");
const selectedYear = watch("year");

const { days } = useDaysInMonth(selectedMonth, selectedYear);

return (
  <main className="signup-page full-size">
    <div className="signup-form-container">
      <div className="signup-form-top-container">
        {/* <h4 className="x-button">×</h4> */}
        <h4 className="step-indicator">Step {currentStep} of 3</h4>
        {currentStep === 1 && <button className="blue-text-button login-instead-button" onClick={() => navigate('/login')}>Login instead</button>}
      </div>

      <form className="signup-form" onSubmit={handleSubmit(onSubmit)}>
        {currentStep === 1 && (
          <>
            <h2>Create your account</h2>
            <StandardInput
              label="Name"
              name="name"
              type="text"
              requirements={validationRules.name}
              register={register}
              displayMaxLength={true}
              error={errors.name}
            />
            {usingPhone ? (
              <StandardInput
                label="Phone"
                name="phone"
                type="tel"
                requirements={validationRules.phone}
                register={register}
                displayMaxLength={false}
                error={errors.phone}
              />
            ) : (
              <StandardInput
                label="Email"
                name="email"
                type="email"
                requirements={validationRules.email}
                register={register}
                displayMaxLength={false}
                error={errors.email}
              />
            )}
            <button
              onClick={toggleUsingPhone}
              type="button"
              className="blue-text-button"
            >
                Use {usingPhone ? "email" : "phone"} instead
            </button>
            <p className="date-of-birth-title">
              <strong>Date of birth</strong>
            </p>
            <p className="greyed-text date-of-birth-info">
              This will not be shown publicly. Confirm your own age, even if
              this account is for a business, a pet, or something else.
            </p>
            <div className="date-selector-container">
              <span className="standard-select-container month-select-container">
                <label className="greyed-text input-inner-label">Month</label>
                <select
                  className="standard-select month-select"
                  {...register("month", { required: true })}
                >
                  <option value=""></option>
                  <option value="january">January</option>
                  <option value="february">February</option>
                  <option value="march">March</option>
                  <option value="april">April</option>
                  <option value="may">May</option>
                  <option value="june">June</option>
                  <option value="july">July</option>
                  <option value="august">August</option>
                  <option value="september">September</option>
                  <option value="october">October</option>
                  <option value="november">November</option>
                  <option value="december">December</option>
                </select>
              </span>
              <span className="standard-select-container day-select-container">
                <label className="greyed-text input-inner-label">Day</label>
                <select
                  className="standard-select day-select"
                  {...register("day", { required: true })}
                >
                  <option value=""></option>
                  {days.map((day) => (
                    <option value={day} key={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </span>
              <span className="standard-select-container years-select-container">
                <label className="greyed-text input-inner-label">Year</label>
                <select
                  className="standard-select year-select"
                  {...register("year", { required: true })}
                >
                  <option value=""></option>
                  {years.map((year) => (
                    <option value={year} key={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </span>
            </div>
            {errors.month ||
              errors.day ||
              (errors.year && (
                <span className="standard-input-error">
                  Please enter your date of birth
                </span>
              ))}
          </>
        )}
        {currentStep === 2 && (
          <>
            <h2>You'll need a password</h2>
            <p className="grey-text">
              Make sure it fulfills the following requirements
            </p>
            <ul>
              <li
                className={`default-transition ${
                  (watchedPassword?.length ?? 0) >= 8
                    ? "blue-text"
                    : "greyed-text"
                }`}
              >
                8 characters or longer
              </li>
              <li
                className={`default-transition ${
                  /[A-Z]/.test(watchedPassword) ? "blue-text" : "greyed-text"
                }`}
              >
                At least one uppercase letter
              </li>
              <li
                className={`default-transition ${
                  /[0-9]/.test(watchedPassword) ? "blue-text" : "greyed-text"
                }`}
              >
                At least one number
              </li>
              <li
                className={`default-transition ${
                  /[!@#$%^&*(),.?":{}|<>]/.test(watchedPassword)
                    ? "blue-text"
                    : "greyed-text"
                }`}
              >
                At least one symbol
              </li>
            </ul>
            <StandardInput
              label="Password"
              name="password"
              type="password"
              requirements={validationRules.password}
              register={register}
              displayMaxLength={true}
              error={errors.password}
            />
          </>
        )}
        {currentStep === 3 && (
          <>
            <h2>Pick a profile picture</h2>
            <div className="full-width-height-center flex-column">
              <div className="profile-img-upload-container">
                <input
                  type="file"
                  className="file-input-real-btn"
                  id="file-input-real-btn"
                  {...register('profile-picture', validationRules.profile)}
                />
                <label htmlFor="file-input-real-btn">
                <img
                    src={`${REACT_APP_SERVER_URL}/assets/add_image_icon.png`}
                    alt="Upload image"
                    className="signup-camera-overlay"
                  />
                  <div className="dark-overlay"></div>
                  <img
                    className="file-input-img"
                    src={imageUrl ? imageUrl : `https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg`}
                    alt="profile-pic"
                  />
                </label>
              </div>
              {wrongFileType && (
                <span className="standard-input-error center-text">
                  {"Please select either a JPEG or PNG file"}
                </span>
              )}
            </div>
          </>
        )}
        <Button
          size="medium-stretch"
          variant="default"
          type="submit"
          disabled={!isValid}
        >
          {currentStep === 3 ? "Submit" : "Next"}
        </Button>
      </form>
    </div>
  </main>
);
};

export default SignupPage;
