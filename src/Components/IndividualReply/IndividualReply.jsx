import "./IndividualReply.css";
import convertIsoStringDateToFormattedTimeSinceNow from "../../utils/convertIsoStringDateToFormattedTimeSinceNow";
import ImageToggleableButton from "../ImageToggleableButton/ImageToggleableButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImagePopup from "../ImagePopup/ImagePopup";
import FlashingGrayBarsLoadingAnimation from "../FlashingGrayBarsLoadingAnimation/FlashingGrayBarsLoadingAnimation";

// Post data should be an object with the following keys:

// reply_id
// post_id
// parent_reply_id
// user_identifying_name
// reply_text
// reply_image_uuid
// is_part_of_thread
// created_at
// user_identifying_name,
// user_display_name,
// profile_image_url,
// verified,
// bio,

// created_at is an ISO date string

// Clickable makes the post a link that navigates you to the post page
// Clickable also leads to the post changing its background colour slightly on hover

// The not connected to reply variable is a boolean that is used to format the post when it is to be connected to a reply

const IndividualReply = ({
  replyData,
  clickable = false,
  connectedToPost = false,
  connectedToChildReply = false,
}) => {
  const [replyLiked, setReplyLiked] = useState(false);
  const [imagePopupActive, setImagePopupActive] = useState(false);

  const profileImageSource = replyData?.profile_image_url
    ? "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
      replyData.profile_image_url
    : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  const replyImageSource = replyData?.reply_image_uuid
    ? "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
      replyData.reply_image_uuid
    : null;

  const timeSinceReplyCreation =
    convertIsoStringDateToFormattedTimeSinceNow(replyData?.created_at) || null;

  const navigate = useNavigate();

  const handleRedirectToProfile = (e) => {
    e.stopPropagation();
    navigate(`/profile/${replyData.user_identifying_name}`);
  };

  const handleRedirectToReplyPage = () => {
    navigate(`/replies/${replyData.reply_id}`);
  };

  if (!replyData) {
    return <FlashingGrayBarsLoadingAnimation />;
  }

  return (
    <div
      className={`individual-reply ${
        clickable ? "clickable-individual-reply" : ""
      } ${connectedToPost ? "connected-to-post" : "not-connected-to-post"}
        ${connectedToChildReply ? "connected-to-child-reply": 'not-connected-to-child-reply'}
      `} // The clickable individual post class is applied so that the div can be given a different colour upon hover when it is clickable
      onClick={clickable ? handleRedirectToReplyPage : undefined}
      style={{ ...(clickable && { cursor: "pointer" }) }}
    >
      <div className="individual-reply-fist-row">
        <div className="individual-row-profile-image-container">
          <img
            src={profileImageSource}
            alt="Profile picture"
            className="individual-reply-profile-image"
            onClick={handleRedirectToProfile}
          />
          {connectedToChildReply && <div className="line-to-next-reply"></div>}
        </div>
        <div className="individual-reply-main-information-container">
          <div className="individual-user-info-and-timing-container">
            <p
              className="individual-reply-display-name-text"
              onClick={handleRedirectToProfile}
            >
              {replyData.user_display_name}
            </p>
            {replyData.verified !== 0 && (
              <img
                className="verification-check-image"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/1200px-Twitter_Verified_Badge.svg.png"
              ></img>
            )}
            <p
              className="individual-reply-identifying-name-text"
              onClick={handleRedirectToProfile}
            >
              @{replyData.user_identifying_name}
            </p>
            <p className="individual-reply-time-since-creation-text">
              {timeSinceReplyCreation}
            </p>
            <button className="three-dot-button margin-left-auto">···</button>
          </div>
          <div className="individual-reply-text-container">
            <p className="individual-reply-text">{replyData.reply_text}</p>
            {replyImageSource && (
              <div className="individual-reply-image-container">
                <img
                  src={replyImageSource}
                  onClick={() => setImagePopupActive(true)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="individual-reply-second-row">
        <ImageToggleableButton
          imgSrcWhenInactive="/assets/unclicked_comment_icon.png"
          imgSrcWhenActive="/assets/clicked_comment_icon.png"
          widthInPx={20}
          text="3.5k"
          textActiveColor="#4c96d5"
          hoverColor="twitterBlue"
          navigateLocation={`/reply/${replyData.post_id}`}
        />
        <ImageToggleableButton
          imgSrcWhenInactive="/assets/unclicked_heart_icon.png"
          imgSrcWhenActive="/assets/clicked_heart_icon.png"
          setToggle={setReplyLiked}
          toggle={replyLiked}
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
          src={replyImageSource}
          setImagePopupActive={setImagePopupActive}
        />
      )}
    </div>
  );
};

export default IndividualReply;
