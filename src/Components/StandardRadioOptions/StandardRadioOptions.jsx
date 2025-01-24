import { useState } from "react";
import "./StandardRadioOptions.css";

// options should be structured in the following way:
//
// const checkboxOptions = [
//     { label: 'From Anyone', value: 'fromAnyone' },
//     { label: 'Only Contacts', value: 'onlyContacts' },
//     { label: 'No One', value: 'noOne' },
//   ];

const StandardRadioOptions = ({ options, selectedValue, setSelectedValue }) => {

  const handleSelect = (value) => {
    setSelectedValue(value);
  };

  return (
    <div className="standard-radio-options-container">
      {options.map((option, index) => (
        <div
          className="standard-radio-option"
          key={index}
          onClick={() => handleSelect(option.value)}
        >
          <span>{option.label}</span>
          <img
            src={
              selectedValue === option.value
                ? "/assets/standard_open_tick.png"
                : "/assets/standard_closed_tick.png"
            }
            alt={selectedValue === option.value ? "Checked" : "Unchecked"}
          />
        </div>
      ))}
    </div>
  );
};

export default StandardRadioOptions;
