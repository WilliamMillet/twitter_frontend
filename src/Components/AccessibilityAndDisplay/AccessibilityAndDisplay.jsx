import { useEffect, useState } from "react";
import "./AccessibilityAndDisplay.css";

const AccessibilityAndDisplay = () => {
  // selectedOption can and will be set as 'base-page', but there is no option in the option dropdown available for this. To change back to this, there will be back buttons

  const [selectedOption, setSelectedOption] = useState("base-page");
  const [selectedColorScheme, setSelectedColorScheme] = useState("dark-mode");

  const handleSelect = (value) => {
    setSelectedColorScheme(value);
  };

  return (
    <>
      {selectedOption === "base-page" && (
        <>
          <div className="settings-subsection-header">
          <h4>Accessibility and Display</h4>
          </div>
          <h3 className="background-title-text-accessibility-page">Background</h3>
          <div className="colour-scheme-option-containers">
            <div
              className={`color-scheme-option-div light-mode-option-div ${
                selectedColorScheme === "light-mode" &&
                "outline-color-scheme-blue"
              }`}
              onClick={() => handleSelect("light-mode")}
            >
              <img
                src={
                  selectedColorScheme === "light-mode"
                    ? "/assets/standard_open_tick.png"
                    : "/assets/standard_closed_tick.png"
                }
                alt={
                  selectedColorScheme === "light-mode" ? "Checked" : "Unchecked"
                }
              />
              Light Mode
            </div>
            <div
              className={`color-scheme-option-div dark-mode-option-div ${
                selectedColorScheme === "dark-mode" &&
                "outline-color-scheme-blue"
              }`}
              onClick={() => handleSelect("dark-mode")}
            >
              <img
                src={
                  selectedColorScheme === "dark-mode"
                    ? "/assets/standard_open_tick.png"
                    : "/assets/standard_closed_tick.png"
                }
                alt={
                  selectedColorScheme === "dark-mode" ? "Checked" : "Unchecked"
                }
              />
              Dark Mode
            </div>
          </div>
      <hr className="default-grey-line dark-mode-feature-separator" />

          <h1 className="center-text">This feature has not been implemented yet!</h1>
        </>
      )}
    </>
  );
};

export default AccessibilityAndDisplay;
