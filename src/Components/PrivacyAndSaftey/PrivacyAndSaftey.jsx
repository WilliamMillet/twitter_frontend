import { useEffect, useState } from "react";
import "./PrivacyAndSaftey.css";
import StandardOptions from "../StandardOptions/StandardOptions";
import MutedWords from "./MutedWords/MutedWords";
import BlockedAccounts from "./BlockedAccounts/BlockedAccounts";

const PrivacyAndSaftey = () => {
  // selectedOption can and will be set as 'base-page', but there is no option in the option dropdown available for this. To change back to this, there will be back buttons

  const [selectedOption, setSelectedOption] = useState("base-page");
  const options = [
    "Muted words",
    "Blocked accounts"
  ];
  const borders = [false, false, false];





  return (
    <>
      {selectedOption === "base-page" && (
        <>
          <h4 className="settings-sub-page-title">Your account</h4>
          <p className="greyed-text settings-sub-page-sub-text">
            See information about your account, download an archive of your
            data, or learn about your account deactivation options
          </p>
          <StandardOptions
            options={options}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            defaultOption="Account information"
            borders={[false, false, false]}
            vertical={true}
            boldSelect={false}
            highlightSelect={false}
            colorInactiveOptionsGrey={false}
            optionHeight="large"
            textAlign="left"
            rightArrow={true}
          />
        </>
      )}
      {selectedOption === "Muted words" && <MutedWords setSelectedOption={setSelectedOption}/>}
      {selectedOption === "Blocked accounts" && <BlockedAccounts setSelectedOption={setSelectedOption}/>}
    </>
  );
};

export default PrivacyAndSaftey;
