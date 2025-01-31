import { useState, useRef, useEffect } from "react";
import "./StandardInput.css";


// IMPORTANT NOTICE
// This exists for inputs that are designed to be in a react hook form. It is not compatible with inputs that are outside of a react hook form

// Max length is sourced from the requirements/validation rules provided

// Default text is here so that the input length can be defined as greater then 1, therefore activating the styling for filled text. It is an ugly solution but the least convoluted of all the solutions I tried

const StandardInput = ({
  label,
  name,
  register,
  requirements,
  displayMaxLength = false,
  type = "text",
  error,
  className,
  isTextArea = false,
  textAreaLines = 3,
  defaultText = null
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputLength, setInputLength] = useState(defaultText ? 1: 0);
  const [scrollIsAcitive, setScrollIsActive] = useState(false); // This exists for text areas. If the user scrolls down a bit, this should be true

  const handleChange = (e) => {
    setInputLength(e.target.value.length);
  };

  const textareaRef = useRef(null);

  const { ref: textRef, ...textRest } = register(name);
  


  const handleScroll = () => {
    if (textareaRef.current.scrollTop > 0) {
      setScrollIsActive(true);
    } else {
      setScrollIsActive(false);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div
      className={`${
        isTextArea ? "standard-text-area-container" : "standard-input-container"
      } ${className}`}
    >
      <label
        htmlFor={name}
        className={`standard-label ${
          isFocused ? `focused-standard-label` : `unfocused-standard-label`
        } ${inputLength > 0 ? "grey-label-out-of-way" : ""}
        ${error ? "red" : ""}
        ${scrollIsAcitive && 'label-styling-when-scroll-is-active'} 
        `
        
      }
      >
        {label}
      </label>
      {displayMaxLength && (
        <p className={`input-length-indicator ${!isFocused && "invisible"} ${scrollIsAcitive && 'input-length-indicator-when-scroll-is-active'}`}>
          {inputLength} / {requirements.maxLength.value}
        </p>
      )}
      {isTextArea ? (
        <textarea
          id={name}
          className={`standard-input standard-textarea-input ${
            isFocused ? `focused-standard-textarea` : `unfocused-standard-textarea`
          } ${error ? "red-border" : ""}`}
          {...register(name, {
            ...(requirements || { required: `${label} is required` }),
            onChange: handleChange,
            onBlur: () => setIsFocused(false),
          })}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={textAreaLines}
          {...textRest}
          ref={(e) => {
            textRef(e);
            textareaRef.current = e;
          }}
          maxLength={
            displayMaxLength && requirements?.maxLength?.value
              ? requirements.maxLength.value
              : undefined
          }
        ></textarea>
      ) : (
        <input
          type={type}
          id={name}
          className={`standard-input ${
            isFocused ? `focused-standard-input` : `unfocused-standard-input`
          } ${error ? "red-border" : ""}`}
          // Pass the provided requirement props if they are given. If not, pass a 'required' validation rule
          {...register(name, {
            ...(requirements || { required: `${label} is required` }),
            onChange: handleChange,
            onBlur: () => setIsFocused(false),
          })}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={
            displayMaxLength && requirements?.maxLength?.value
              ? requirements.maxLength.value
              : undefined
          }
        />
      )}
      {error && <span className="standard-input-error">{error.message}</span>}
    </div>
  );
};

export default StandardInput;
