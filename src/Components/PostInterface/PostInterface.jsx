import { useEffect, useRef, useState } from "react";
import "./PostInterface.css";
import useFetchPrivateUserData from "../../hooks/useFetchPrivateUserData";
import Button from "../Button/Button";
import useFetchData from "../../hooks/useFetchData";
import ImagePopup from "../ImagePopup/ImagePopup";
import ThreadCreationInterface from "../ThreadCreationInterface/ThreadCreationInterface";
import { useNavigate } from "react-router-dom";


const PostInterface = () => {
  const { userData, error, loading, fetchUserData } = useFetchPrivateUserData();
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [input, setInput] = useState(undefined);
  const [image, setImage] = useState(undefined);
  const [imagePreview, setImagePreview] = useState(undefined);
  const [imagePopupActive, setImagePopupActive] = useState(false)
  const [threadCreationInterfaceActive, setThreadCreationInterfaceActive] = useState(false)
  const [userInputLength, setUserInputLength] = useState(0);

  const navigate = useNavigate()

  useEffect(() => {
    fetchUserData();
  }, []);

  const profileImageSource = userData?.profile_image_url
    ? "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
      userData.profile_image_url
    : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  const handleChange = (e) => {
    setUserInputLength(e.target.value.length);
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setInput(e.target.value);
  };

  const handleAddImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  };

  const handleRemoveImage = () => {
    setImage(null)
    setImagePreview(null)
    fileInputRef.current.value = null
  }

  const {
    response: uploadTextResponse,
    error: uploadTextError,
    loading: uploadTextLoading,
    fetchData: uploadTextFetchFunction,
  } = useFetchData();

  const {
    response: generatePresignedUrlResponse,
    error: generatePresignedUrlError,
    loading: generatePresignedUrlLoading,
    fetchData: generatePresignedUrlFetchFunction,
  } = useFetchData();

  const {
    response: awsUploadResponse,
    error: awsUploadError,
    loading: awsUploadLoading,
    fetchData: awsUploadFetchFunction,
  } = useFetchData();

  const {
    response: postImageMetadataResponse,
    error: postImageMetadataError,
    loading: postImageMetadataLoading,
    fetchData: postImageMetadataFetchFunction,
  } = useFetchData();

  const aggregatedErrors = [
    uploadTextError,
    generatePresignedUrlError,
    awsUploadError,
    postImageMetadataError
  ].filter(error => error !== undefined)

  // I could make it so the post redirects you to the post, or possibly does so in a new tab

  const handlePost = () => {
    uploadTextFetchFunction(
      `${process.env.REACT_APP_SERVER_URL}/api/posts/text`,
      "POST",
      { includeAuth: true },
      { postText: input },
      {
        onSuccess: (uploadTextData) => {
          setInput("");
          const { postId } = uploadTextData;
          if (image) {
            generatePresignedUrlFetchFunction(
              `${process.env.REACT_APP_SERVER_URL}/api/posts/presigned-url-for-upload`,
              "POST",
              { includeAuth: true },
              { fileType: image.type },
              {
                onSuccess: (presignedUrlData) => {
                  const { uniqueId, url } = presignedUrlData;
                  awsUploadFetchFunction(
                    url,
                    "PUT",
                    { contentType: image.type },
                    image,
                    {
                      onSuccess: () => {
                        postImageMetadataFetchFunction(
                          `${process.env.REACT_APP_SERVER_URL}/api/posts/${postId}/image-metadata`,
                          "POST",
                          { includeAuth: true },
                          { uuid: uniqueId },
                          {
                            onSuccess: () => {
                              handleRemoveImage()
                            },
                          }
                        );
                      },
                    }
                  );
                },
              }
            );
          }
        },
      }
    );
  };


  return (
    <div className="post-interface">
      <div className="post-interface-text-and-profile-and-image">
        <div className="post-interface-text-and-profile">
          <img
            src={profileImageSource}
            alt="Profile picture"
            className="post-interface-profile-image-container"
          />
          <textarea
            type="text"
            value={input}
            placeholder="What is happening?!"
            className="post-interface-text-input"
            onChange={handleChange}
            maxLength="400"
            ref={textareaRef}
          ></textarea>
        </div>
        {imagePreview && (
          <div className="post-interface-image-preview">
            <button className="frosted-glass-plain-text-button close-image-button" onClick={handleRemoveImage}>×</button>
            <img src={imagePreview} alt="Image preview" onClick={() => setImagePopupActive(true)}/>
          </div>
        )}
      </div>
      <div className="post-interface-buttons">
        <div className="upload-image-with-post-button">
          <img
            className="add-image-button-cover"
            src="/assets/image_icon.png"
            alt="Image"
            onClick={handleAddImageClick}
          />
          <input
            type="file"
            className="add-image-to-post-button-file-upload"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
        </div>
        <div className="right-hand-post-interface-actions-container">
          <p className="standard-input-error">{aggregatedErrors}</p>
          <p className="post-length-indicator">{userInputLength} / 400</p>
          {/* <button className="create-thread-button" onClick={() => setThreadCreationInterfaceActive(true)}>+</button> Featured disabled for now*/} 
          <Button variant="default" size="small" onClick={handlePost} disabled={!input || input.length < 1}>
            Post
          </Button>
        </div>
      </div>
        {imagePreview && imagePopupActive && <ImagePopup src={imagePreview} setImagePopupActive={setImagePopupActive}/>}
        {threadCreationInterfaceActive && <ThreadCreationInterface/> }
    </div>
  );
};

export default PostInterface;
