import "./RightSidebar.css";
import useFetchData from "../../hooks/useFetchData";
import { useEffect, useState } from "react";
import getProfileLinkOrPlaceholder from "../../utils/getProfileLinkOrPlaceholder";
import Button from "../Button/Button";
import truncateString from "../../utils/truncateString";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../hooks/useDebounce";
import SearchDropDown from "./SearchDropDown";
import ProfilePreview from "../ProfilePreview/ProfilePreview";

const RightSidebar = () => {
  const navigate = useNavigate();
  const getTopProfiles = useFetchData();

  useEffect(() => {
    getTopProfiles.fetchData(
      `http://localhost:5000/api/users/top-accounts-main-details?limit=4`,
      "GET"
    );
  }, []);


  const [search, setSearch] = useState('')
  const [searchBarFocused, setSearchBarFocused] = useState(false)

  const getMatchingProfiles = useFetchData()
  
  const handleGetMatchingProfiles = () => {
    getMatchingProfiles.fetchData(
        `http://localhost:5000/api/users/top-accounts-main-details?limit=5&pattern=${JSON.stringify(search)}`,
        "GET"
      );
  }

  useDebounce(handleGetMatchingProfiles, 600, search)

  // Redirect on enter if the user has entered a search

  const handleRedirectToSearchPage = (e) => {
    if (e.key === 'Enter' && search.trim()) {
        e.preventDefault();
        navigate(`/search/${search.trim()}`)
        window.location.reload()

    }
  }


  return (
    <aside className="right-sidebar">
      <div className="right-sidebar-main-container">
        <input
          type="search"
          className="main-search-bar"
          placeholder="🔎︎   Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setSearchBarFocused(true)}
          onBlur={() => setSearchBarFocused(false)}
          onKeyDown={handleRedirectToSearchPage}
        />
        <div className="search-drop-down-menu-container">
            { getMatchingProfiles.response && searchBarFocused && <SearchDropDown results={getMatchingProfiles.response} search={search}/> }
        </div>
        <div className="top-accounts-container">
          <h1 className="who-to-follow-title">Who to follow</h1>
          <div className="top-accounts-inner-container">
            {getTopProfiles?.response &&
              getTopProfiles.response.map((profile, index) => (
                <ProfilePreview profileData={profile} key={index}/>
              ))}
          </div>
        </div>
        <div className="right-sidebar-links-container">
          <a
            href="https://x.com/en/tos"
            className="greyed-text"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of service
          </a>
          <a
            href="https://x.com/en/privacy"
            className="greyed-text"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
          <a
            href="https://help.x.com/en/rules-and-policies/x-cookies"
            className="greyed-text"
            target="_blank"
            rel="noopener noreferrer"
          >
            Cookie Policy
          </a>
          <a
            href="https://help.x.com/en/resources/accessibility"
            className="greyed-text"
            target="_blank"
            rel="noopener noreferrer"
          >
            Accessibility
          </a>
          <a
            href="https://business.x.com/en/help/troubleshooting/how-x-ads-work"
            className="greyed-text"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ads info
          </a>
          <p className="greyed-text">@ 2025 X Corp.</p>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
