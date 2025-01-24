import StandardInput from "../../StandardInput/StandardInput";
import { useForm } from "react-hook-form";
import Button from "../../Button/Button";
import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom'

// Pass the set selected option as a prompt to allow users to return to the base account options page

const BlockedAccounts = ({ setSelectedOption }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm();

  const navigate = useNavigate()

  const userProfileLink = 'https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/' + JSON.parse(localStorage.getItem('profile_link_suffix')) 
  const displayName = JSON.parse(localStorage.getItem('user_display_name'))
  const identifyingName = JSON.parse(localStorage.getItem('user_identifying_name'))

  const [authError, setAuthError] = useState(false);

  const user_identifying_name = JSON.parse(
    localStorage.getItem("user_identifying_name")
  );

  const onSubmit = (data) => {

    fetch(`http://localhost:5000/api/users/deleteAccount/${user_identifying_name}?password=${data.currentPassword}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.status === 200) {
        setAuthError(false)
        navigate('/signup');
        localStorage.clear()
      } else {
        if (response.status === 401) {
          console.log('true')
          setAuthError(true)
        }
        throw new Error('Error deleting account')
      }
    })
    .catch(err => {
      console.error('Error deleting account: ', err.message);
    })

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
      <Link to={`/profile/${identifyingName}`} className='no-underline-link'>
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
            You're about to start the process of deactivating your X account. Your display name, @username, and public profile will no longer be viewable on X.com, X for iOS, or X for Android.
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
          error={errors.currentPassword || authError} // Check if this auth error stuff needs to be here. Also check the auth error lsightly below
        />
        <p className="standard-input-error password-tester-for-account-termination-error-message">
          {authError && "Incorrect password. Please try again"}
        </p>

        <button className='deactivation-btn'>
            Deactivate
        </button>
      </form>
    </>
  );
};

export default BlockedAccounts;
