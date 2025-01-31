import { useState } from "react";
import "./LeftSidebar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LeftSidebar = () => {
  const userProfileLink =
    "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
    JSON.parse(localStorage.getItem("profile_link_suffix"));
  const displayName = JSON.parse(localStorage.getItem("user_display_name"));
  const identifyingName = JSON.parse(
    localStorage.getItem("user_identifying_name")
  );

  const [popupActive, setPopupActive] = useState(false);
  const navigate = useNavigate();

  const togglePopup = () => {
    setPopupActive((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="left-sidebar">
      <div className="left-sidebar-inner-container">
        <nav>
          <ul>
            <li>
              <Link to="/">
                <span className="header-item">Home</span>
              </Link>
            </li>
            <li>
              <Link to="/signup">
                <span className="header-item">Signup</span>
              </Link>
            </li>
            <li>
              <Link to="/login">
                <span className="header-item">Login</span>
              </Link>
            </li>
            <li>
              <Link to={`/profile/${identifyingName}`}>
                <span className="header-item">Profile</span>
              </Link>
            </li>
            <li>
              <Link to="/settings">
                <span className="header-item">Settings</span>
              </Link>
            </li>
          </ul>
          <div
            className={`logout-popup ${
              popupActive ? "full-opacity" : "zero-opacity"
            }`}
          >
            <button className="logout-button" onClick={handleLogout}>
              Logout @{identifyingName}
            </button>
          </div>
          <div className="profile-nav-item" onClick={togglePopup}>
            <div className="profile-picture-small-icon-container">
              <img src={userProfileLink} alt="User profile image" />
            </div>
            <div className="profile-picture-small-icon">
              <div className="profile-nav-display-name-text">{displayName}</div>
              <div className="profile-nav-identifying-name-text">
                @{identifyingName}
              </div>
            </div>
            <p className="user-options-button">···</p>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default LeftSidebar;
