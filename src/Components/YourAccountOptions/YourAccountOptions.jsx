import { useEffect, useState } from "react";
import "./YourAccountOptions.css";
import StandardOptions from "../StandardOptions/StandardOptions";
import ChangePassword from './ChangePassword/ChangePassword'
import AccountInformation from "./AccountInformation/AccountInformation";
import TerminateAccount from "./TerminateAccount/TerminateAccount";

const YourAccountOptions = () => {
  // selectedOption can and will be set as 'base-page', but there is no option in the option dropdown available for this. To change back to this, there will be back buttons

  const [selectedOption, setSelectedOption] = useState("base-page");
  const options = [
    "Account information",
    "Change your password",
    "Deactivate your account",
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
      {selectedOption === "Account information" && <AccountInformation setSelectedOption={setSelectedOption}/>}
      {selectedOption === "Change your password" && <ChangePassword setSelectedOption={setSelectedOption}/>}
      {selectedOption === "Deactivate your account" && <TerminateAccount setSelectedOption={setSelectedOption}/>}
    </>
  );
};

export default YourAccountOptions;
