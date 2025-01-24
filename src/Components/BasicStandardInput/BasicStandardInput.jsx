import { useState } from "react";
import "./BasicStandardInput.css";

// IMPORTANT NOTICE
// This exists for inputs that are NOT designed to be in a react hook form. It is not compatible with inputs that are in a form

const BasicStandardInput = ({
  label,
  name,
  displayMaxLength,
  type = "text",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputLength, setInputLength] = useState(0);

  const handleChange = (e) => {
    setInputLength(e.target.value.length);
  };


  return (
    <div className="standard-input-container">
      <label
        htmlFor={name}
        className={`standard-label ${
          isFocused ? `focused-standard-label` : `unfocused-standard-label`
        } ${inputLength > 0 ? "grey-label-out-of-way" : ""} ${
          error ? "red" : ""
        }`}
      >
        {label}
      </label>
      {displayMaxLength && (
        <p className={`input-length-indicator ${isFocused ? "" : "invisible"}`}>
          {inputLength} / {requirements.maxLength.value}
        </p>
      )}
      <input
        type={type}
        id={name}
        className={`standard-input ${
          isFocused ? `focused-standard-input` : `unfocused-standard-input`
        } ${error ? "red-border" : ""}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        
        maxLength={
          requirements.maxLength.value
            ? requirements.maxLength.value
            : undefined
        }
      />
      {error && <span className="standard-input-error">{error.message}</span>}
    </div>
  );
};

export default BasicStandardInput;
