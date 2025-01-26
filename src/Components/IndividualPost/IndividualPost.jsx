import "./IndividualPost.css";
import convertIsoStringDateToFormattedTimeSinceNow from "../../utils/convertIsoStringDateToFormattedTimeSinceNow";
import ImageToggleableButton from "../ImageToggleableButton/ImageToggleableButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImagePopup from "../ImagePopup/ImagePopup";
import IndividualMentionedPost from "./IndividualMentionedPost";
import FlashingGrayBarsLoadingAnimation from "../FlashingGrayBarsLoadingAnimation/FlashingGrayBarsLoadingAnimation";

// Post data should be an object with the following keys:

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

// The mentioned post data will be null in cases where there is no mentioned_post_id

// Clickable makes the post a link that navigates you to the post page
// Clickable also leads to the post changing its background colour slightly on hover

const IndividualPost = ({ postData, clickable = false }) => {
  const [postLiked, setPostLiked] = useState(false);
  const [imagePopupActive, setImagePopupActive] = useState(false);

  const profileImageSource = postData?.profile_image_url
    ? "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
      postData.profile_image_url
    : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  const postImageSource = postData?.image_uuid
    ? "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
      postData.image_uuid
    : null;

  // Create a new version of the postData with only mentioned values, which can then be passed as a prop to the IndividualMentionedPost component 

  // console.log("Post data: ", postData)

  let mentionedData

  if (postData?.mentioned_post_id) {
    mentionedData = Object.keys(postData)
    .filter(key => key.startsWith("mentioned_"))
    .reduce((acc, key) => {
      acc[key] = postData[key]
      return acc
    }, {})  
  }

  // console.log("Mentioned post data: ", mentionedData)



  const timeSincePostCreation =
    convertIsoStringDateToFormattedTimeSinceNow(postData?.created_at) || null;

  const navigate = useNavigate();

  const handleRedirectToProfile = (e) => {
    e.stopPropagation();
    navigate(`/profile/${postData.user_identifying_name}`);
  };

  const handleRedirectToPostPage = () => {
    navigate(`/posts/${postData.post_id}`);
  };

  if (!postData) {

    return (
      <FlashingGrayBarsLoadingAnimation/>
    );
  }

  return (
    <div
      className={`individual-post ${clickable && "clickable-individual-post"}`} // The clickable individual post class is applied so that the div can be given a different colour upon hover when it is clickable
      onClick={clickable ? handleRedirectToPostPage : undefined}
      style={{ ...(clickable && { cursor: "pointer" }) }}
    >
      <div className="individual-post-fist-row">
        <div className="individual-row-profile-image-container">
          <img
            src={profileImageSource}
            alt="Profile picture"
            className="individual-post-profile-image"
            onClick={handleRedirectToProfile}
          />
        </div>
        <div className="individual-post-main-information-container">
          <div className="individual-user-info-and-timing-container">
            <p
              className="individual-post-display-name-text"
              onClick={handleRedirectToProfile}
            >
              {postData.user_display_name}
            </p>
            {postData.verified !== 0 && (
              <img
                className="verification-check-image"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/1200px-Twitter_Verified_Badge.svg.png"
              ></img>
            )}
            <p
              className="individual-post-identifying-name-text"
              onClick={handleRedirectToProfile}
            >
              @{postData.user_identifying_name}
            </p>
            <p className="individual-post-time-since-creation-text">
              {timeSincePostCreation}
            </p>
            <button className="three-dot-button margin-left-auto">···</button>
          </div>
          <div className="individual-post-text-container">
            <p className="individual-post-text">{postData.post_text}</p>
            {postImageSource && (
              <div className="individual-post-image-container">
                <img
                  src={postImageSource}
                  onClick={() => setImagePopupActive(true)}
                />
              </div>
            )}
            {mentionedData && <IndividualMentionedPost mentionedPostData={mentionedData}/>}
          </div>
        </div>
      </div>
      <div className="individual-post-second-row">
        <ImageToggleableButton
          imgSrcWhenInactive="/assets/unclicked_comment_icon.png"
          imgSrcWhenActive="/assets/clicked_comment_icon.png"
          widthInPx={20}
          text="3.5k"
          textActiveColor="#4c96d5"
          hoverColor="twitterBlue"
          navigateLocation={`/posts/${postData.post_id}`}
        />
        <ImageToggleableButton
          imgSrcWhenInactive="/assets/unclicked_heart_icon.png"
          imgSrcWhenActive="/assets/clicked_heart_icon.png"
          setToggle={setPostLiked}
          toggle={postLiked}
          widthInPx={25}
          text="9.2k"
          textActiveColor="#fb73b3"
          hoverColor="heartPink"
        />
        <ImageToggleableButton
          imgSrcWhenInactive="/assets/unclicked_share_icon.png"
          imgSrcWhenActive="/assets/clicked_share_icon.png"
          widthInPx={20}
          // Text is intentionally NOT applied
          textActiveColor="#4c96d5"
          hoverColor="twitterBlue"
        />
      </div>
      {imagePopupActive && (
        <ImagePopup
          src={postImageSource}
          setImagePopupActive={setImagePopupActive}
        />
      )}
    </div>
  );
};

export default IndividualPost;
