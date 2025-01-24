import "./StandardOptions.css";
import { useState } from "react";

const StandardOptions = ({
  options,
  selectedOption,
  setSelectedOption,
  defaultOption,
  borders = [false, false, false],
  vertical = false,
  boldSelect = true,
  colorInactiveOptionsGrey = true,
  highlightSelect = true,
  optionHeight = 'medium',
  textAlign = 'center',
  rightArrow = false
}) => {
  // Borders should be an array with true or false for top, bottom and sides
  // [1, 0, 1] would mean yes for top, no for bottom and yes for sides

  // selectedOption and setSelectedOptional are optional prompts. If the state does not need to be stored, it is better not to pass them

  // Right arrow is designed to work with vertically ordered options

  // The three option heights are small, medium and large (As of when this comment was written at least)

  // Note that the vertical styled underlines seem to be completly pointless as they are unused. Shadows are used for this
  return (
    <>
      <div
        className={`standard-options
          ${borders[0] && "include-top-border"}
          ${borders[1] && "include-bottom-border"}
          ${vertical ? "vertical-styled" : "horizontal-styled"}`}
      >
        {options.map((option) => (
          <button
            key={option}
            className={`feed-ind-button following-button ${
              selectedOption === option ? "active-option" : "inactive-option"
            }
            ${borders[2] && "include-side-borders"}
            ${textAlign === 'center' && "text-align-center"}
            ${textAlign === 'left' && "text-align-left-with-padding"}
            ${textAlign === 'right' && "text-align-right"}
            ${optionHeight === 'large' && "large-option-height"}
            ${optionHeight === 'medium' && "large-option-height"}
            ${highlightSelect && "include-highlight"}
            ${vertical ? 'vertical-button-styling': 'horizontal-button-styling'}
            `}
            onClick={() => setSelectedOption && setSelectedOption(option)}
          >
            <p className="option-text">{option}</p> {rightArrow && <span className="right-arrow-text">&gt;</span>} 
          </button>
        ))}
      </div>
      <div className={`standard-option-underlines ${vertical ? "vertical-styled" : "horizontal-styled"}`}>
        {options.map((option) => (
          <div
            key={option}
            className={`ind-button-accent ${
              selectedOption != option && "zero-opacity"
            }`}
          ></div>
        ))}
      </div>
    </>
  );
};

export default StandardOptions;
