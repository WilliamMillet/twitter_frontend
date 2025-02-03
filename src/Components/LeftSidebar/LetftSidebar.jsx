import { useState } from "react";
import "./LeftSidebar.css";
import { Link, NavLink, useParams } from "react-router-dom";
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
            <li className="x-logo-li">
            <Link to='/'>
            <div className="x-main-icon-container">
            <img src="/assets/x_main_icon.png" alt="Profile" className="left-sidebar-x-icon"/>
            </div>
            </Link>
            </li>
            <li>
              <NavLink to="/" className={({isActive}) =>
                isActive ? 'header-item active-page-link' : 'header-item'
              }>
                <img src="/assets/home_icon.png" alt="Home" className="left-sidebar-main-icon"/>
                <span className="header-item">Home</span>
              </NavLink>
            </li>
            {/* <li>
              <NavLink to="/signup" className={({isActive}) =>
                isActive ? 'header-item active-page-link' : 'header-item'
              }>
                <span className="header-item">Signup</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/login" className={({isActive}) =>
                isActive ? 'header-item active-page-link' : 'header-item'
              }>
                <span className="header-item">Login</span>
              </NavLink>
            </li> */}
            {/* Login and signup have been commented out as they should not be visbile on this page, as this page is dedicated for signed in users only */}
            {/* However, to make this project more acessible to potential employers, I may make a publically acessible version of this page */}
            <li>
              <NavLink to={`/profile/${identifyingName}`} className={({isActive}) =>
                isActive ? 'header-item active-page-link' : 'header-item'
              }>
                <img src="/assets/profile_icon.png" alt="Profile" className="left-sidebar-main-icon"/>
                <span className="header-item">Profile</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" className={({isActive}) =>
                isActive ? 'header-item active-page-link' : 'header-item'
              }>
                <img src="/assets/settings_icon.png" alt="Settings" className="left-sidebar-main-icon"/>
                <span className="header-item">Settings</span>
              </NavLink>
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
