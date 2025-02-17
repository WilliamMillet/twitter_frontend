import "./IndividualPost.css";
import convertIsoStringDateToFormattedTimeSinceNow from "../../utils/convertIsoStringDateToFormattedTimeSinceNow";
import ImageButton from "../ImageButton/ImageButton";
import ImageToggleableButton from "../ImageToggleableButton/ImageToggleableButton";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ImagePopup from "../ImagePopup/ImagePopup";
import IndividualMentionedPost from "./IndividualMentionedPost";
import FlashingGrayBarsLoadingAnimation from "../FlashingGrayBarsLoadingAnimation/FlashingGrayBarsLoadingAnimation";
import StandardPopup from "../StandardPopup/StandardPopup";
import useClickOutside from "../../hooks/useClickOutside";
import useFetchData from "../../hooks/useFetchData";
import abbreviateNumber from "../../utils/abbreviateNumber";
import useProfileIsOwn from "../../hooks/useProfileIsOwn";
import truncateString from "../../utils/truncateString";

const IndividualPost = ({ postData, clickable = false, connectedToReply = false }) => {

  const [postLiked, setPostLiked] = useState(null);
  // augmentedLikeCount includes likes or unlikes made by the user while on the page
  const [augmentedLikeCount, setAugmentedLikeCount] = useState(postData?.like_count || 0);
  const [imagePopupActive, setImagePopupActive] = useState(false);
  const [sharePopupActive, setSharePopupActive] = useState(false);
  const [miscOptionsActive, setMiscOptionsActive] = useState(false);
  // Flag to track whether the initial like status has been fetched
  const [initialLikeFetched, setInitialLikeFetched] = useState(false);
  const [postHasBeenRemoved, setPostHasBeenRemoved] = useState({value: false, reason: null});
  // This ref will store the initially fetched like value so it doesn’t change on later renders.
  const initialLikeRef = useRef(null);

  const navigate = useNavigate();

  // Toggle share popup visibility.
  const toggleSharePopupActive = () => {
    setSharePopupActive((prev) => !prev);
  };

  const profileImageSource = postData?.profile_image_url
    
  
  ? "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
      postData.profile_image_url
    : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  const postImageSource = postData?.image_uuid
    ? "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
      postData.image_uuid
    : null;

  // Extract mentioned post data if available.
  let mentionedData;
  if (postData?.mentioned_post_id) {
    mentionedData = Object.keys(postData)
      .filter((key) => key.startsWith("mentioned_"))
      .reduce((acc, key) => {
        acc[key] = postData[key];
        return acc;
      }, {});
  }

  const handleCopyLinkToClipboard = () => {
    navigator.clipboard.writeText(
      `${process.env.REACT_APP_CLIENT_URL}/posts/${postData.post_id}`
    );
  };

  const sharePopupData = [
    {
      iconImgSrc: `${REACT_APP_SERVER_URL}/assets/link_icon.png`,
      text: "Copy link",
      onClick: handleCopyLinkToClipboard,
      textAfterClick: 'Copied!'
    },
  ];

  // Create a ref for clicking outside the share popup.
  const sharePopupRef = useClickOutside(() =>
    setSharePopupActive(false)
  );

  // Create a ref for clicking outside the misc options popup.
  const miscOptionsRef = useClickOutside(() =>
    setMiscOptionsActive(false)
  );

  // Data for the miscellaneous options popup.

  const profileIsOwn = useProfileIsOwn(postData.user_identifying_name);

  const uploadBlock = useFetchData();

  const handleBlock = () => {
    uploadBlock.fetchData(
      `${process.env.REACT_APP_SERVER_URL}/api/users/${postData.user_display_name}/block`,
      "POST",
      { includeAuth: true },
      null,
      {
        onSuccess: () => {
          navigate("/");
          setPostHasBeenRemoved({value: true, reason: 'userBlocked'})
        },
      }
    );
  };


  const miscOptionsData = [
    profileIsOwn
      ? {
          text: "✖ Delete Post",
          onClick: () => {
            handleDeletePost(postData.post_id);
            setMiscOptionsActive(false);
          }
        }
      : {
          iconImgSrc: `${REACT_APP_SERVER_URL}/assets/block_icon.png`,
          text: `Block @${truncateString(postData.user_display_name, 15)}`,
          onClick: handleBlock
        }
  ];

  const timeSincePostCreation =
    convertIsoStringDateToFormattedTimeSinceNow(postData?.created_at) || null;

  const handleRedirectToProfile = (e) => {
    e.stopPropagation();
    navigate(`/profile/${postData.user_identifying_name}`);
  };

  const handleRedirectToPostPage = () => {
    navigate(`/posts/${postData.post_id}`);
  };

  // Initialize custom hooks for API calls.
  const checkIfUserHasLikedPost = useFetchData();
  const uploadLike = useFetchData();
  const deleteLike = useFetchData();

  // Fetch initial like status 
  useEffect(() => {
    if (!initialLikeFetched) {
      checkIfUserHasLikedPost.fetchData(
        `${process.env.REACT_APP_SERVER_URL}/api/posts/${postData.post_id}/is-liked-by-user`,
        'GET',
        { includeAuth: true }
      );
    }
  }, [initialLikeFetched, postData.post_id, checkIfUserHasLikedPost]);

  // When the response comes in, store it in state and in a ref, then mark the fetch as complete.
  useEffect(() => {
    if (!initialLikeFetched && checkIfUserHasLikedPost.response !== null) {
      initialLikeRef.current = checkIfUserHasLikedPost.response;
      setPostLiked(checkIfUserHasLikedPost.response);
      setInitialLikeFetched(true);
    }
  }, [checkIfUserHasLikedPost.response, initialLikeFetched]);

  // Trigger API call upon toggling like
  useEffect(() => {
    // Do nothing until the initial like status is fetched.
    if (!initialLikeFetched) return;
    // Only proceed if the user’s toggle is different from the initial value.
    if (postLiked === initialLikeRef.current) return;

    if (postLiked === true) {
      // User liked the post.
      uploadLike.fetchData(
        `${process.env.REACT_APP_SERVER_URL}/api/posts/${postData.post_id}/like`,
        'POST',
        { includeAuth: true },
        null
      );
      setAugmentedLikeCount((prev) => prev + 1);
      initialLikeRef.current = true;
    } else if (postLiked === false) {
      // User unliked the post.
      deleteLike.fetchData(
        `${process.env.REACT_APP_SERVER_URL}/api/posts/${postData.post_id}/like`,
        'DELETE',
        { includeAuth: true }
      );
      setAugmentedLikeCount((prev) => prev - 1);
      initialLikeRef.current = false;
    }
  }, [
    postLiked,
    initialLikeFetched,
    postData.like_count,
    postData.post_id,
    uploadLike,
    deleteLike,
  ]);

  const deletePost = useFetchData();

  const handleDeletePost = (postId) => {
    const handleSuccessfulDelete = () => {
      if (clickable) {
        setPostHasBeenRemoved({value: true, reason: 'postDeleted'});
      } else {
        navigate('/');
      }
    };

    deletePost.fetchData(
      `${process.env.REACT_APP_SERVER_URL}/api/posts/${postData.post_id}`,
      'DELETE',
      { includeAuth: true },
      null,
      {
        onSuccess: handleSuccessfulDelete,
      }
    );
  };


  if (!postData) {
    return <FlashingGrayBarsLoadingAnimation />;
  }

  if (postHasBeenRemoved.value === true) {
    return (
      <div className="individual-post post-has-been-deleted">
        <p className="greyed-text" >
          {postHasBeenRemoved.reason === 'userBlocked' && 'User has been blocked!'}
          {postHasBeenRemoved.reason === 'postDeleted' && 'Post has been deleted!'}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`individual-post 
        ${clickable ? "clickable-individual-post" : "unclickable-individual-post"}
        ${connectedToReply ? "connected-to-reply" : "not-connected-to-reply"}
        `}
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
          {connectedToReply && <div className="line-to-next-reply"></div>}
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
                alt="Verified"
              />
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
            {/* Three-dot button toggles the misc options popup */}
            <button
              className="three-dot-button margin-left-auto three-dots-individual-post"
              onClick={(e) => {
                e.stopPropagation();
                setMiscOptionsActive((prev) => !prev);
              }}
            >
              ···
            </button>
            {miscOptionsActive && (
              <div ref={miscOptionsRef}>
                <StandardPopup popupData={miscOptionsData} position='right'/>
              </div>
            )}
          </div>
          <div className="individual-post-text-container">
            <p className="individual-post-text">{postData.post_text}</p>
            {postImageSource && (
              <div className="individual-post-image-container">
                <img
                  src={postImageSource}
                  alt="Post content"
                  onClick={() => setImagePopupActive(true)}
                />
              </div>
            )}
            {mentionedData && (
              <IndividualMentionedPost mentionedPostData={mentionedData} />
            )}
          </div>
        </div>
      </div>
      {!clickable && (
        <hr className="nintey-percent-width-grey-line clicked-post-grey-line" />
      )}
      <div className="individual-post-second-row">
        <ImageToggleableButton
          imgSrcWhenInactive={`${REACT_APP_SERVER_URL}/unclicked_comment_icon.png`}
          imgSrcWhenActive={`${REACT_APP_SERVER_URL}/assets/clicked_comment_icon.png`}
          widthInPx={20}
          text={abbreviateNumber(postData.reply_count)}
          textActiveColor="#4c96d5"
          hoverColor="twitterBlue"
          navigateLocation={`/posts/${postData.post_id}`}
        />
        <ImageToggleableButton
          imgSrcWhenInactive={`${REACT_APP_SERVER_URL}/assets/unclicked_heart_icon.png`}
          imgSrcWhenActive={`${REACT_APP_SERVER_URL}/assets/clicked_heart_icon.png`}
          setToggle={setPostLiked}
          toggle={postLiked}
          widthInPx={25}
          text={abbreviateNumber(augmentedLikeCount)}
          textActiveColor="#fb73b3"
          hoverColor="heartPink"
        />
        <div className="image-popup-icon-and-popup">
          <ImageButton
            imgSrc={`${REACT_APP_SERVER_URL}/assets/unclicked_share_icon.png`}
            widthInPx={20}
            // Text is intentionally NOT applied
            textActiveColor="#4c96d5"
            hoverColor="twitterBlue"
            handleClick={toggleSharePopupActive}
          />
          {sharePopupActive && (
            <div ref={sharePopupRef}>
              <StandardPopup popupData={sharePopupData} />
            </div>
          )}
        </div>
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
