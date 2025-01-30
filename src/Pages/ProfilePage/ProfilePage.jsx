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

  const personalUserIdentifyingName = JSON.parse(localStorage.getItem('user_identifying_name'))
  const [profileIsOwn, setProfileIsOwn] = useState(false);

  const [isEditPopupOpen, SetIsEditPopupOpen] = useState(false)

  useEffect(() => {
    const match = (personalUserIdentifyingName === userDetails.user_identifying_name);
    setProfileIsOwn(match);
  }, [userDetails, personalUserIdentifyingName]);


  // Media options

  const [selectedOption, setSelectedOption] = useState("Posts");
  const options = ["Posts", "Replies", "Highlights", "Media"];
  const borders = [false, true, false];

  // Get public data affiliated with user profile

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/getMainPublicUserDetails/${username}`)
      .then((response) => response.json())
      .then((data) => setUserDetails(data))
      .catch((err) => {
        console.error("Error fetching main user details: ", err);
      });
  }, [username]);

  const getUserPosts = useFetchData()

  useEffect(() => {
    getUserPosts.fetchData`http://localhost:5000/api/posts/?user=${username}, 'GET`()
  }, [username])

  const userProfileLink = userDetails?.profile_image_url
  ? "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
  userDetails.profile_image_url
  : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  console.log(userDetails)

  const bannerLink = userDetails?.cover_image_url
  ? "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
  userDetails.cover_image_url
  : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0yCgViCJ4Hmeyk6dRvEqkrQ4AkhcRR04BXQ&s'


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
          <p className="profile-top-container-post-count">0 posts</p>{" "}
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
          {profileIsOwn ? (
            <>
            <Button variant='default-border-only' size='medium' onClick={() => SetIsEditPopupOpen(true)}>
              Edit Profile
            </Button>

            </>
          ) : (
            <>
            
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
      {isEditPopupOpen && <EditProfilePopup userDetails={userDetails}/>}
      {getUserPosts.data.map()}
    </StandardLayout>
  );
};

export default ProfilePage;
