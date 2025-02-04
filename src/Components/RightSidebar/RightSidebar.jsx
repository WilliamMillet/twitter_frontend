import "./RightSidebar.css";
import useFetchData from "../../hooks/useFetchData";
import { useEffect } from "react";
import getProfileLinkOrPlaceholder from "../../utils/getProfileLinkOrPlaceholder";
import Button from "../Button/Button";
import truncateString from "../../utils/truncateString";
import { Navigate, useNavigate } from "react-router-dom";

const RightSidebar = () => {

  const navigate = useNavigate()
  const getTopProfiles = useFetchData();

  useEffect(() => {
    getTopProfiles.fetchData(
      `http://localhost:5000/api/users/top-accounts-main-details?limit=4`,
      "GET"
    );
  }, []);

  const handleClick = (user_identifying_name) => {
    navigate(`/profile/${user_identifying_name}`)
  }

  return (
    <aside className="right-sidebar">
      <div className="right-sidebar-main-container">
        <input
          type="search"
          className="main-search-bar"
          placeholder="🔎︎   Search"
        />
        <div className="top-accounts-container">
          <h1 className="who-to-follow-title">Who to follow</h1>
          <div className="top-accounts-inner-container">
            {getTopProfiles?.response &&
              getTopProfiles.response.map((profile, index) => (
                <div className="top-profile-row" key={index} onClick={() => handleClick(profile.user_identifying_name)}>
                  <div className="top-profile-image-container">
                    <img
                      src={getProfileLinkOrPlaceholder(
                        profile.profile_image_url
                      )}
                      alt=""
                    />
                  </div>
                  <div className="top-profile-name-and-verification-status">
                    <div>
                      <p className="top-profile-display-name">{truncateString(profile.user_display_name, 13)}</p>
                      {profile.verified === 1 && (
                        <img
                          className="verification-check-image"
                          src="https://uploiad.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/1200px-Twitter_Verified_Badge.svg.png"
                        ></img>
                      )}
                    </div>
                    <div>
                      <p className="greyed-text">
                        @{truncateString(profile.user_identifying_name, 13)}
                      </p>
                    </div>
                  </div>
                    <Button variant='default' size='small' className='top-profile-follow-button'>
                        Profile
                    </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
