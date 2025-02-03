import "./ProfilePage.css";
import StandardLayout from "../../Components/StandardLayout/StandardLayout";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import isoDateToDisplayableFormat from "../../utils/isoDateToDisplayableFormat";
import truncateString from "../../utils/truncateString";
import StandardOptions from "../../Components/StandardOptions/StandardOptions";
import Button from "../../Components/Button/Button";
import EditProfilePopup from "./EditProfilePopup";
import useFetchData from "../../hooks/useFetchData";
import IndividualPost from "../../Components/IndividualPost/IndividualPost";

const ProfilePage = () => {
  const { username } = useParams();

  const [userDetails, setUserDetails] = useState({});
  const [followingBtnHovered, setFollowingBtnHovered] = useState(false)

  const personalUserIdentifyingName = JSON.parse(
    localStorage.getItem("user_identifying_name")
  );
  const [profileIsOwn, setProfileIsOwn] = useState(null);
  const [following, setFollowing] = useState(null);

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  useEffect(() => {
    if (personalUserIdentifyingName && userDetails.user_identifying_name) {
      const match =
        personalUserIdentifyingName === userDetails.user_identifying_name;
      setProfileIsOwn(match);
    }
  }, [userDetails, personalUserIdentifyingName]);

  useEffect(() => {
    console.log(profileIsOwn);
  }, [profileIsOwn]);

  // Media options

  const [selectedOption, setSelectedOption] = useState("Posts");
  const options = ["Posts", "Replies", "Highlights", "Media"];
  const borders = [false, true, false];

  // Get public data affiliated with user profile

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/users/getMainPublicUserDetails/${username}`
    )
      .then((response) => response.json())
      .then((data) => setUserDetails(data))
      .catch((err) => {
        console.error("Error fetching main user details: ", err);
      });
  }, [username]);

  const getUserPosts = useFetchData();
  const getUserPostCount = useFetchData();
  const checkIfFollowing = useFetchData();
  const getFollowerCount = useFetchData();
  const getFollowingCount = useFetchData();

  useEffect(() => {
    getUserPosts.fetchData(
      `http://localhost:5000/api/posts/?user=${username}`,
      "GET"
    );
    getUserPostCount.fetchData(
      `http://localhost:5000/api/posts/${username}/post-count`,
      "GET"
    );

    checkIfFollowing.fetchData(
      `http://localhost:5000/api/users/${personalUserIdentifyingName}/is-following/${username}`,
      "GET"
    );
    getFollowerCount.fetchData(
      `http://localhost:5000/api/users/${username}/follower-count`,
      "GET"
    );
    getFollowingCount.fetchData(
      `http://localhost:5000/api/users/${username}/following-count`,
      "GET"
    );
  }, [username]);

  // useEffect to update the following state once it is found it whether or not the user is being followed

  useEffect(() => {
    setFollowing(checkIfFollowing?.response?.isFollowing || null); // Optional chaining to avoid errors on the first render of the page
  }, [checkIfFollowing.response]);

  console.log(getFollowingCount.response);

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
      `http://localhost:5000/api/users/${username}/follow`,
      "POST",
      { includeAuth: true },
      null,
      { onSuccess: () => setFollowing(true) }
    );
  };

  const handleUnfollow = () => {
    deleteFollowRelationFromServer.fetchData(
      `http://localhost:5000/api/users/${username}/unfollow`,
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
            <Button
              variant="default-border-only"
              size="medium"
              onClick={() => setIsEditPopupOpen(true)}
            >
              Edit Profile
            </Button>
          )}

          {profileIsOwn === false && (
            <>
              {following ? (
                <Button
                  variant="default-border-only"
                  size="medium"
                  onClick={handleUnfollow}
                  className='following-button'
                  setHovered={setFollowingBtnHovered}
                >
                  {followingBtnHovered ? 'Unfollow' : 'Following'}
                </Button>
              ) : (
                <Button
                  variant='default'
                  size="medium"
                  onClick={handleFollow}
                >
                  Follow
                </Button>
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
            options={["Posts", "Replies", "Highlights", "Media"]}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            defaultOption="Posts"
            borders={[false, true, false]}
            textAlign="center"
          />
        </div>
      </div>
      {getUserPosts?.response &&
        getUserPosts.response.map((post) => (
          <IndividualPost key={post.id} clickable={true} postData={post} />
        ))}
      {isEditPopupOpen && (
        <EditProfilePopup
          userDetails={userDetails}
          setIsEditPopupOpen={setIsEditPopupOpen}
        />
      )}
    </StandardLayout>
  );
};

export default ProfilePage;
