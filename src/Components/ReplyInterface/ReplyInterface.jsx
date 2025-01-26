import "./ReplyInterface.css";
import { Link } from "react-router-dom";
import FlashingGrayBarsLoadingAnimation from "../FlashingGrayBarsLoadingAnimation/FlashingGrayBarsLoadingAnimation";
import getOwnProfileImageLink from "../../utils/getOwnProfileImageLink";
import { useRef, useState } from "react";
import Button from "../Button/Button";

// The following properties of parentPostData are available
// post_id,
// user_identifying_name,
// user_display_name,
// profile_image_url,
// verified,
// bio,
// post_text,
// image_uuid,
// created_at,
// mentioned_post_id,
// mentioned_post_text,
// mentioned_post_created_at,
// mentioned_post_image_uuid,
// mentioned_post_user_display_name,
// mentioned_post_user_identifying_name,
// mentioned_post_user_profile_image_url,
// mentioned_post_user_bio,
// mentioned_post_user_verified

const ReplyInterface = ({ parentPostData }) => {
  const textareaRef = useRef(null);
  const fileUploadRef = useRef(null);

  const [textInputLength, setTextInputLength] = useState(0);
  const [textInput, setTextInput] = useState(null);
  const [imageInput, setImageInput] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  // When clicked on, the replyinterface div should expand
  const [isActive, setIsActive] = useState(false);

  const handleTextInputChange = (e) => {
    setTextInput(e.target.value);
    setTextInputLength(e.target.value.length);
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  // Create a link to the image uploaded to preview it in the post

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageInput(file)
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // If a user tabs to the icon for the image and presses enter or space it should click the hidden file input button and open the file menu

  const handleAddImageClick = () => {
    fileUploadRef.current.click();
  };

  const handleAddImageKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      fileUploadRef.current.click();
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    fileUploadRef.current.value = null;
  };


  const handleFocus = () => {
    setIsActive(true);
  };


  const handlePost = () => {};

  if (!parentPostData) {
    return (
      <div className="reply-interface">
        <FlashingGrayBarsLoadingAnimation numberOfBars={2} />
      </div>
    );
  }
  return (
    <div className="reply-interface">
      <div className="reply-interface-first-column">
        <img
          src={getOwnProfileImageLink()}
          alt="Your profile"
          className={`reply-interface-your-profile-link ${
            isActive
              ? "reply-interface-your-profile-link-when-active"
              : "reply-interface-your-profile-link-when-inactive"
          }`}
        />
      </div>
      <div className="reply-interface-second-column">
        {isActive && (
          <div className="user-being-replied-to-name-container">
            <p className="replying-to-text">
              Replying to{" "}
              <Link
                to={`posts/${parentPostData.user_identifying_name}`}
                className="replying-to-link-to-profile blue-text"
              >
                @{parentPostData.user_identifying_name}
              </Link>
            </p>
          </div>
        )}
        <div className="reply-interface-user-inputs">
            <textarea
              className="reply-interface-text-input"
              ref={textareaRef}
              onFocus={handleFocus}
              onChange={handleTextInputChange}
              value={textInput}
              placeholder="Post your reply"
              rows="1"
              maxLength={400}
            ></textarea>
            {imagePreview && (
              <div className="reply-interface-image-preview">
                <button
                  className="frosted-glass-plain-text-button reply-interface-close-image-button"
                  onClick={handleRemoveImage}
                >
                  ×
                </button>
                <img
                  src={imagePreview}
                  alt="Image preview"
                  className="reply-interface-image-upload"
                />
              </div>
            )}
        </div>
        {isActive && (
          <div className="reply-interface-actions">
            <div className="upload-image-with-post-button">
              <img
                className="reply-inteface-add-image-button-cover"
                src="/assets/image_icon.png"
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
                ref={fileUploadRef}
              />
            </div>
            <div className="reply-interface-actions-right">
              <p className="post-length-indicator">{textInputLength} / 400</p>
              <Button
                variant="default"
                size="small"
                onClick={handlePost}
                disabled={textInputLength === 0}
              >
                Reply
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplyInterface;
