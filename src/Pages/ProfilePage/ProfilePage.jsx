import "./ProfilePage.css";
import StandardLayout from "../../Components/StandardLayout/StandardLayout";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import isoDateToDisplayableFormat from "../../utils/isoDateToDisplayableFormat";
import truncateString from "../../utils/truncateString";
import StandardOptions from "../../Components/StandardOptions/StandardOptions";
import Button from "../../Components/Button/Button";
import EditProfilePopup from "./EditProfilePopup";
import useFetchData from "../../hooks/useFetchData";
import StandardPopup from "../../Components/StandardPopup/StandardPopup";
import useClickOutside from "../../hooks/useClickOutside";
import useProfileIsOwn from "../../hooks/useProfileIsOwn";
import ProfilePagePostContent from "./ProfilePagePostContent";
import ProfilePageReplyContent from "./ProfilePageReplyContent";
import ProfilePageMediaContent from "./ProfilePageMediaContent";
import PortalPopup from "../../Components/PortalPopup/PortalPopup"

const ProfilePage = () => {

  const navigate = useNavigate();

  const { username } = useParams();


  const [userActionsPopupActive, setUserActionsPopupActive] = useState(false);

  const toggleUserActionsPopupActive = () => {
    setUserActionsPopupActive((prev) => !prev);
  };

  const userActionPopupRef = useClickOutside(() =>
    setUserActionsPopupActive(false)
  );

  const uploadBlock = useFetchData();

  const handleBlock = () => {
    uploadBlock.fetchData(
      `${process.env.REACT_APP_SERVER_URL}/api/users/${username}/block`,
      "POST",
      { includeAuth: true },
      null,
      {
        onSuccess: () => {
          navigate("/");
        },
      }
    );
  };


  // Scroll to the top of the page upon load. This is necessary as if you zoom into one page scroll down then navigate to this page, you will not end up at the top

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopyLinkToClipboard = () => {
    navigator.clipboard.writeText(
      `${process.env.REACT_APP_CLIENT_URL}/profile/${username}`
    );
  };

  const userActionPopupData = [
    {
      iconImgSrc: `${process.env.REACT_APP_CLIENT_URL}/assets/block_icon.png`,
      text: `Block @${truncateString(username, 15)}`,
      onClick: handleBlock,
    },
    {
      iconImgSrc: `${process.env.REACT_APP_CLIENT_URL}/assets/link_icon.png`,
      text: "Copy link",
      onClick: handleCopyLinkToClipboard,
      textAfterClick: 'Copied!'
    },
  ];

  const [userDetails, setUserDetails] = useState({});
  const [followingBtnHovered, setFollowingBtnHovered] = useState(false);


  const [following, setFollowing] = useState(null);

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);


  const profileIsOwn = useProfileIsOwn(userDetails.user_identifying_name);


  // Media options

  const [selectedOption, setSelectedOption] = useState("Posts");
  const options = ["Posts", "Replies", "Media"];
  const borders = [false, true, false];

  // Get public data affiliated with user profile


  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/users/getMainPublicUserDetails/${username}`
    )
      .then((response) => response.json())
      .then((data) => setUserDetails(data))
      .catch((err) => {
        console.error("Error fetching main user details: ", err);
      });
  }, [username]);

  
  const getUserPostCount = useFetchData();
  const checkIfFollowing = useFetchData();
  const getFollowerCount = useFetchData();
  const getFollowingCount = useFetchData();

  useEffect(() => {

    getUserPostCount.fetchData(
      `${process.env.REACT_APP_SERVER_URL}/api/posts/${username}/post-count`,
      "GET"
    );

    const ownName = JSON.parse(localStorage.getItem("user_identifying_name"))

    checkIfFollowing.fetchData(
      `${process.env.REACT_APP_SERVER_URL}/api/users/${ownName}/is-following/${username}`,
      "GET"
    );
    getFollowerCount.fetchData(
      `${process.env.REACT_APP_SERVER_URL}/api/users/${username}/follower-count`,
      "GET"
    );
    getFollowingCount.fetchData(
      `${process.env.REACT_APP_SERVER_URL}/api/users/${username}/following-count`,
      "GET"
    );
  }, [username]);

  // useEffect to update the following state once it is found it whether or not the user is being followed

  useEffect(() => {
    setFollowing(checkIfFollowing?.response?.isFollowing || null); // Optional chaining to avoid errors on the first render of the page
  }, [checkIfFollowing.response]);

  const userProfileLink = userDetails?.profile_image_url
    ? "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
      userDetails.profile_image_url
    : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  const bannerLink = userDetails?.cover_image_url
    ? "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
      userDetails.cover_image_url
    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0yCgViCJ4Hmeyk6dRvEqkrQ4AkhcRR04BXQ&s";

  const uploadFollowRelationToServer = useFetchData();
  const deleteFollowRelationFromServer = useFetchData();

  const handleFollow = () => {
    uploadFollowRelationToServer.fetchData(
      `${process.env.REACT_APP_SERVER_URL}/api/users/${username}/follow`,
      "POST",
      { includeAuth: true },
      null,
      { onSuccess: () => setFollowing(true) }
    );
  };

  const handleUnfollow = () => {
    deleteFollowRelationFromServer.fetchData(
      `${process.env.REACT_APP_SERVER_URL}/api/users/${username}/unfollow`,
      "DELETE",
      { includeAuth: true },
      null,
      { onSuccess: () => setFollowing(false) }
    );
  };

  return (
    <StandardLayout>
      <div className="profile-top-container">
        <Link to="/" className="arrow-icon text-only-button no-underline">
          🡰
        </Link>
        <div>
          <p className="profile-top-container-name-text">
            {userDetails.user_display_name}
          </p>
          {getUserPostCount?.response && (
            <p className="profile-top-container-post-count">
              {getUserPostCount.response.post_count} post
              {getUserPostCount.response.post_count != 1 && "s"}
              {/* Add s if the number should be pluralised */}
            </p>
          )}
          {/* ^^^^^ I gotta fix this as some point */}
        </div>
      </div>
      <div className="user-page-main-profile-container">
        <img
          src={userProfileLink}
          alt={`${userDetails.user_display_name}'s profile picture`}
        />
      </div>
      <div className="profile-banner-container">
        <img src={bannerLink} alt="Banner" />
      </div>
      <div className="user-basic-details">
        <div className="profile-action-container">
          {profileIsOwn === true && (
            <>
              <Button
                variant="default-border-only"
                size="medium"
                onClick={() => setIsEditPopupOpen(true)}
              >
                Edit Profile
              </Button>
            </>
          )}
          {profileIsOwn === false && (
            <>
              {following ? (
                <Button
                  variant="default-border-only"
                  size="medium"
                  onClick={handleUnfollow}
                  className="following-button"
                  setHovered={setFollowingBtnHovered}
                >
                  {followingBtnHovered ? "Unfollow" : "Following"}
                </Button>
              ) : (
                <Button variant="default" size="medium" onClick={handleFollow}>
                  Follow
                </Button>
              )}
              <Button
                className="additional-profile-actions-button"
                variant="default-border-only"
                size="medium-circle"
                onClick={toggleUserActionsPopupActive}
              >
                ···
              </Button>
              {userActionsPopupActive && (
                <StandardPopup
                  popupData={userActionPopupData}
                  position={"top-left"}
                  ref={userActionPopupRef}
                />
              )}
              <p className="standard-input-error">
                {uploadFollowRelationToServer.error}{" "}
                {deleteFollowRelationFromServer.error}
              </p>
            </>
          )}
        </div>
        <div className="display-name-and-verification-conatiner">
          <p className="user-profile-display-name-text">
            {userDetails.user_display_name}
          </p>
          {userDetails.verified === 1 && (
            <img
              className="verification-check-image"
              src="https://uploiad.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/1200px-Twitter_Verified_Badge.svg.png"
            ></img>
          )}
        </div>
        <div className="identifying-name-container">
          <p className="user-profile-identifying-name-text">
            @{userDetails.user_identifying_name}
          </p>
        </div>
        <div className="bio-container">{userDetails.bio}</div>
        <div className="location-link-and-date-joined-container">
          {userDetails.location && (
            <p className="profile-location-text">📌 {userDetails.location} </p>
          )}
          {userDetails.link && (
            <p className="profile-link-text">
              🔗{" "}
              <a
                href={userDetails.link}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-text-link"
              >
                {truncateString(userDetails.link, 30)}
              </a>
            </p>
          )}
          <p className="profile-date-joined-text">
            ⏰ Joined{" "}
            {isoDateToDisplayableFormat(
              userDetails.created_at,
              true,
              true,
              false
            )}
          </p>
        </div>
        <div className="following-and-followers-count-container"></div>
        {getFollowingCount?.response && (
          <button className="following-count-button">
            <span className="following-count-number">
              {getFollowingCount.response.following_count}
            </span>
            <span className="following-count-text"> Following</span>
          </button>
        )}
        {getFollowerCount?.response && (
          <button className="follower-count-button">
            <span className="follower-count-number">
              {getFollowerCount.response.follower_count}
            </span>
            <span className="follower-count-text"> Followers</span>
          </button>
        )}
        <div className="followers-preview-container"></div>
        <div className="user-media-options-container">
          <StandardOptions
            options={["Posts", "Replies", "Media"]}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            defaultOption="Posts"
            borders={[false, true, false]}
            textAlign="center"
          />
        </div>
      </div>
      {selectedOption === 'Posts' && <ProfilePagePostContent/>}
      {selectedOption === 'Replies' && <ProfilePageReplyContent/>}
      {selectedOption === 'Media' && <ProfilePageMediaContent/>}
      {isEditPopupOpen && (
        <PortalPopup>
        <EditProfilePopup
          userDetails={userDetails}
          setIsEditPopupOpen={setIsEditPopupOpen}
        />
        </PortalPopup>
      )}
    </StandardLayout>
  );
};

export default ProfilePage;
