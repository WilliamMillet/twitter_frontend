import StandardInput from "../../StandardInput/StandardInput";
import { useForm } from "react-hook-form";
import Button from "../../Button/Button";
import { useState } from "react";

// Pass the set selected option as a prompt to allow users to return to the base account options page

const AccountInformation = ({setSelectedOption}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();


  const [userData, setUserData] = useState(false);
  const [authError, setAuthError] = useState(null);

  const user_identifying_name = JSON.parse(
    localStorage.getItem("user_identifying_name")
  );

  const onSubmit = (data) => {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/users/getMainPublicAndPrivateUserDetails/${user_identifying_name}?password=${data.password}`
    )
      .then((response) => {
        if (response.status === 401) {
          setAuthError(true)
          throw new Error("Unauthorised access")
        } 
        return response.json()
      })
      .then((response) => {

          setUserData(response)
          setAuthError(false)
        
      })
      .catch((err) => {
        console.error("Error fetching user data: ", err);
      });
  };

  return (
    <>
      <div className="account-information-header">
        <button
          className="text-only-button settings-arrow-btn"
          onClick={() => setSelectedOption("base-page")}
        >
          🡰
        </button>{" "}
        <h4>Account information</h4>
      </div>
      <h3 className="confirm-password-text">Confirm your password</h3>
      <p className="greyed-text settings-sub-page-sub-text">
        Please enter your password in order to get this.
      </p>
      <hr className="default-grey-line" />
      <form
        className="password-input-container"
        onSubmit={handleSubmit(onSubmit)}
      >
        <StandardInput
          label="Password"
          name="password"
          type="password"
          register={register}
          displayMaxLength={false}
          error={errors.password || authError}
        />
        <p className="standard-input-error password-tester-invalid-text">
          {authError && "Invalid email or password"}
        </p>
        <Button variant="default-colorful" size="small">
          Confirm
        </Button>
      </form>
      {userData && (
        <>
          <hr className="default-grey-line" />
          <div className="private-user-details-container">
            <h3 className="private-user-details-container-title">
              Your details
            </h3>
            <div className="user-detail-row">
              <p>Identifying Name:</p> <p>{userData.user_identifying_name}</p>
            </div>
            <hr className="default-grey-line" />
            <div className="user-detail-row">
              <p>Display Name:</p> <p>{userData.user_display_name}</p>
            </div>
            <hr className="default-grey-line" />
            <div className="user-detail-row">
              <p>Verified:</p> <p>{userData.verified ? "Yes" : "No"}</p>
            </div>
            <hr className="default-grey-line" />
            {userData.email ? (
              <div className="user-detail-row">
                <p>Email:</p> <p>{userData.email}</p>
              </div>
            ) : (
              <div className="user-detail-row">
                <p>Phone:</p> <p>{userData.phone}</p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AccountInformation;
