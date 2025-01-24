import { useRef, useState } from "react";
import getOwnProfileImageLink from "../../utils/getOwnProfileImageLink";
import Button from "../Button/Button";

const ThreadCreationDraftItem = ({
  index,
  activeThreadIndex,
  handleActivateThreadIndex,
  handleAddToThread,
  register,
  isBasePost,
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Check if this thread is active

  const active = activeThreadIndex === index;

  const [userInputLength, setUserInputLength] = useState(0);
  const [image, setImage] = useState(undefined);
  const [imagePreview, setImagePreview] = useState(undefined);

  const handleChange = (e) => {
    setUserInputLength(e.target.value.length);
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddImageClick = () => {
    fileInputRef.current.click();
  };

  const handleAddImageKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === " ") {
        handleAddImageClick()
    }
  }

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    fileInputRef.current.value = null;
  };

  const handleClickDraftItem = () => {
    handleActivateThreadIndex(index);
    textareaRef.current.focus();
  };

  const handleFocus = () => {
    if (!active) {
      handleActivateThreadIndex(index);
    }
  };

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
          {active && <div className="thread-creation-vertical-line"></div>}
        </div>
        <div className="thread-creation-input-container">
          <textarea
            type="text"
            className="thread-creation-input-field"
            placeholder={
              isBasePost ? "What is happening?" : "Add to your thread"
            }
            ref={textareaRef}
            onChange={handleChange}
            rows="1"
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
              src="/assets/image_icon.png"
              alt="Image"
              onClick={handleAddImageClick}
              onKeyDown={handleAddImageKeyDown}
              tabIndex={0}
            />
            <input
              type="file"
              className="add-image-to-post-button-file-upload"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>
          <div className="thread-creation-right-actions">
            <p className="post-length-indicator">{userInputLength} / 400</p>
            <button className="create-thread-button" onClick={handleAddToThread}>+</button>
            <Button variant="default" size="small-stretch">
              Post all
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreadCreationDraftItem;
