import { useRef, useState } from "react";
import getOwnProfileImageLink from "../../utils/getOwnProfileImageLink";
import Button from "../Button/Button";
import { generateInputConfigurations } from "./generateThreadInputConfigurations";

const ThreadCreationDraftItem = ({
  id,
  activeThreadId,
  handleActivateThreadId,
  handleAddToThread,
  register,
  threadItems,
}) => {
  // The base post which thread replies are attached to will always have an id of 1 if the code is written correctly

  const isBasePost = id === 1;

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Check if this thread is active

  const active = activeThreadId === id;

  const isLastReply = id === threadItems[threadItems.length - 1]?.id;

  const [userInputLength, setUserInputLength] = useState(0);
  const [imagePreview, setImagePreview] = useState(undefined);

  // Ensure the textarea is always the minimum number of lines that will fit the text of a given post

  const handleChange = (e) => {
    setUserInputLength(e.target.value.length);
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Create a link to the image uploaded to preview it in the post

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // If a user tabs to the icon for the image and presses enter or space it should click the hidden file input button and open the file menu

  const handleAddImageClick = () => {
    fileInputRef.current.click();
  };

  const handleAddImageKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      fileInputRef.current.click();
    }
  };

  // Remove the image preview and clear the file upload input

  const handleRemoveImage = () => {
    setImagePreview(null);
    fileInputRef.current.value = null;
  };

  // If anywhere on thread item is clicked, the input should focus

  const handleClickDraftItem = () => {
    handleActivateThreadId(id);
    textareaRef.current.focus();
  };

  const handleFocus = () => {
    if (!active) {
      handleActivateThreadId(id);
    }
  };

  // Set up the registers for the form in a way that lets the refs still be used elsewhere

  const inputConfig = generateInputConfigurations(id);

  const { ref: textRef, ...textRest } = register(inputConfig.text.name);
  const { ref: fileRef, ...fileRest } = register(inputConfig.file.name);

  return (
    <div
      className={`thread-creation-draft-item ${
        !active && "inactive-thread-creation-item"
      }`}
      onClick={handleClickDraftItem}
      onFocus={handleFocus}
    >
      <div className="thread-creation-draft-item-profile-and-content">
        <div className="thread-creation-profile-info-container">
          <img src={getOwnProfileImageLink()} alt="Profile" />
          {active && !isLastReply && (
            <div className="thread-creation-vertical-line"></div>
          )}
        </div>
        <div className="thread-creation-input-container">
          <textarea
            type="text"
            className="thread-creation-input-field"
            placeholder={
              isBasePost ? "What is happening?" : "Add to your thread"
            }
            onChange={handleChange}
            rows="1"
            {...textRest}
            ref={(e) => {
              textRef(e);
              textareaRef.current = e;
            }}
            maxLength={400}
          ></textarea>
          {imagePreview && (
            <div className="thread-creation-image-image-preview">
              <button
                className="frosted-glass-plain-text-button thread-creation-close-image-button"
                onClick={handleRemoveImage}
              >
                ×
              </button>
              <img
                src={imagePreview}
                alt="Image preview"
                className="thread-creation-image-upload"
              />
            </div>
          )}
        </div>
      </div>
      {active && (
        <div className="thread-creation-action-buttons-container">
          <div className="upload-image-with-post-button">
            <img
              className="add-image-button-cover"
              src={`${process.env.REACT_APP_CLIENT_URL}/assets/image_icon.png`}
              alt="Image"
              onClick={handleAddImageClick}
              onKeyDown={handleAddImageKeyDown}
              tabIndex={0}
            />
            <input
              type="file"
              accept=".png, .jpeg, .jpg"
              className="add-image-to-post-button-file-upload"
              onChange={handleImageUpload}
              {...fileRest}
              ref={(e) => {
                fileRef(e);
                fileInputRef.current = e;
              }}
            />
          </div>
          <div className="thread-creation-right-actions">
            <p className="post-length-indicator">{userInputLength} / 400</p>
            <button
              className="create-thread-button"
              onClick={() => handleAddToThread(id)}
            >
              +
            </button>
            <Button variant="default" size="small-stretch" type='submit'>
              Post all
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreadCreationDraftItem;
