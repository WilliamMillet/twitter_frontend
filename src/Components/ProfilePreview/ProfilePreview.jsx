import getProfileLinkOrPlaceholder from "../../utils/getProfileLinkOrPlaceholder";
import truncateString from "../../utils/truncateString";
import Button from "../Button/Button";
import { useNavigate } from "react-router-dom";

const ProfilePreview = ({profileData, truncateAtChar = 13, includeBio = false}) => {

    const navigate = useNavigate()

      const handleClick = (user_identifying_name) => {
        navigate(`/profile/${user_identifying_name}`);
        window.location.reload();
      };
    

    return ( 
        <div
        className="top-profile-row"
        onClick={() => handleClick(profileData.user_identifying_name)}
      >
        <div className="top-profile-image-container">
          <img
            src={getProfileLinkOrPlaceholder(
                profileData.profile_image_url
            )}
            alt=""
          />
        </div>
        <div className="top-profile-name-and-verification-status">
          <div>
            <p className="top-profile-display-name">
              {truncateString(profileData.user_display_name, truncateAtChar)}
            </p>
            {profileData.verified === 1 && (
              <img
                className="verification-check-image"
                src="https://uploiad.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/1200px-Twitter_Verified_Badge.svg.png"
              ></img>
            )}
          </div>
          <div>
            <p className="greyed-text">
              @{truncateString(profileData.user_identifying_name, truncateAtChar)}
            </p>
          </div>
          {includeBio && profileData.bio && (
            <p className="top-profile-bio">
                {truncateString(profileData.bio, truncateAtChar * 2)} {/* Bio is truncated at twice the regular character limit */}
            </p>
          )}
        </div>
        <Button
          variant="default"
          size="small"
          className="top-profile-follow-button"
        >
          Profile
        </Button>
      </div>
    );
}
 
export default ProfilePreview;

