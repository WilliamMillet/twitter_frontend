import getProfileLinkOrPlaceholder from "../../utils/getProfileLinkOrPlaceholder";
import truncateString from "../../utils/truncateString";
import { useNavigate } from "react-router-dom";

const SearchDropDown = ({ results, search }) => {
  const navigate = useNavigate();

  const handleRedirectToProfile = (user_identifying_name) => {
    navigate(`/profile/${user_identifying_name}`);
  };

  const handleRedirectToSearchPage = () => {
    navigate(`/search/${search.trim()}`)
    window.location.reload()
  }

  return (
    <div className="search-drop-down-menu">
      {search && (
        <button className="main-search-button" onMouseDown={handleRedirectToSearchPage}>
          🔎︎ Search for '{search}'
        </button>
      )}
      {results.map((user, index) => (
        <div
          className="search-profiles-row"
          key={index}
          onMouseDown={() =>
            handleRedirectToProfile(user.user_identifying_name)
          }
        >
          <div className="search-profiles-image-container">
            <img
              src={getProfileLinkOrPlaceholder(user.profile_image_url)}
              alt={`Profile picture of ${user.user_display_name}`}
            />
          </div>
          <div className="search-profiles-name-and-verification-status">
            <div className="search-profiles-display-name-and-verification-status">
              <p className="search-profiles-user-display-name-text">
                {truncateString(user.user_display_name, 20)}
              </p>
            </div>
            <p className="search-profiles-user-identifying-name-text">
              @{truncateString(user.user_identifying_name, 20)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchDropDown;
