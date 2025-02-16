import StandardInput from "../../StandardInput/StandardInput";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import useFetchData from "../../../hooks/useFetchData";

// Pass the set selected option as a prompt to allow users to return to the base account options page

const TerminateAccount = ({ setSelectedOption }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors},
  } = useForm();

  const navigate = useNavigate();

  const userProfileLink =
    "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
    JSON.parse(localStorage.getItem("profile_link_suffix"));
  const displayName = JSON.parse(localStorage.getItem("user_display_name"));
  const identifyingName = JSON.parse(
    localStorage.getItem("user_identifying_name")
  );

  const user_identifying_name = JSON.parse(
    localStorage.getItem("user_identifying_name")
  );

  const { error, fetchData } = useFetchData();

  const onSubmit = (data) => {
    fetchData(
      `${process.env.REACT_APP_SERVER_URL}/api/users/deleteAccount/${user_identifying_name}?password=${data.currentPassword}`,
      "DELETE",
      {},
      null,
      {
        onFinally: (data) => {
          navigate("/signup");
          localStorage.clear();
        },
      }
    );
  };

  return (
    <>
      <div className="account-information-header">
        <button
          className="text-only-button settings-arrow-btn"
          onClick={() => setSelectedOption("base-page")}
        >
          🡰
        </button>
        <h4>Deactivate account</h4>
      </div>
      <Link to={`/profile/${identifyingName}`} className="no-underline-link">
        <div className="visual-link-to-profile">
          <div className="profile-picture-small-icon-container">
            <img src={userProfileLink} alt="User profile image" />
          </div>
          <div className="profile-picture-small-icon">
            <div className="profile-nav-display-name-text">{displayName}</div>
            <div className="profile-nav-identifying-name-text">
              @{identifyingName}
            </div>
          </div>
        </div>
      </Link>
      <h3 className="deactivation-first-warning">
        This will deactivate your account
      </h3>
      <p className="greyed-text settings-sub-page-sub-text">
        You're about to start the process of deactivating your X account. Your
        display name, @username, and public profile will no longer be viewable
        on X.com, X for iOS, or X for Android.
      </p>
      <hr className="default-grey-line old-and-new-password-input-separator" />
      <form
        className="deactivate-account-input-container"
        onSubmit={handleSubmit(onSubmit)}
      >
        <StandardInput
          label="Current Password"
          name="currentPassword"
          type="password"
          register={register}
          displayMaxLength={false}
          error={errors.currentPassword}
        />
        {error && (
          <p className="standard-input-error password-tester-for-account-termination-error-message">
            {error}
          </p>
        )}

        <button className="deactivation-btn">Deactivate</button>
      </form>
    </>
  );
};

export default TerminateAccount;
