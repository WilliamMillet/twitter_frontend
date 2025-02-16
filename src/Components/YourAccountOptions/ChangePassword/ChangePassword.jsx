import StandardInput from "../../StandardInput/StandardInput";
import { useForm } from "react-hook-form";
import Button from "../../Button/Button";
import { useEffect, useState } from "react";
import validationRules from "../../../Pages/SignupPage/validationRules";

// Pass the set selected option as a prompt to allow users to return to the base account options page

const AccountInformation = ({ setSelectedOption }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm();

  const [userData, setUserData] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [equalityError, setEqualityError] = useState(false); // If the passwords are equal, there is no error. If they are not equal, there is an error which will be used to trigger the error coloring
  const [success, setSuccess] = useState(false)


  const user_identifying_name = JSON.parse(
    localStorage.getItem("user_identifying_name")
  );

  // Check for equality when either the new password or the confirm new password changes

  const newPasswordInput = watch("newPassword");
  const confirmNewPasswordInput = watch("confirmNewPassword");

  useEffect(() => {
    console.log(equalityError)
    if (newPasswordInput != confirmNewPasswordInput) {
      setEqualityError(true);
    } else {
      setEqualityError(false);
    }
  }, [newPasswordInput, confirmNewPasswordInput]);

  const onSubmit = (data) => {
    // Do a request to change the password with a password verificaiton middleware
    fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/changePassword/${user_identifying_name}?password=${data.currentPassword}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newPassword: data.newPassword }),
    })
      .then((response) => {
        if (response.status === 401) {
          console.log("is working");
          setAuthError(true);
          throw new Error("Unauthorised access");
        }
        return response.json();
      })
      .then((response) => {
        console.log(response);
        setSuccess(true)
        setUserData(response);
        setAuthError(false);
      })
      .catch((err) => {
        console.error("Error fetching user data: ", err);
        setSuccess(false)
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
        <h4>Change your Password</h4>
      </div>
      <form
        className="change-password-input-container"
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
    <p className="standard-input-error password-tester-for-change-password-invalid-text">
          {authError && "Incorrect password. Please try again"}
        </p>

        <hr className="default-grey-line old-and-new-password-input-separator" />

        <StandardInput
          label="New Password"
          name="newPassword"
          type="password"
          register={register}
          requirements={validationRules.password}
          displayMaxLength={false}
          error={errors.newPassword || equalityError} // Check if this auth error stuff needs to be here. Also check the auth error lsightly below
        />
        <StandardInput
          label="Confirm New Password"
          name="confirmNewPassword"
          type="password"
          register={register}
          displayMaxLength={false}
          error={errors.confirmNewPassword || equalityError} // Check if this auth error stuff needs to be here. Also check the auth error lsightly below
        />
        <p className="standard-input-error password-equality-invalid-text">
          {equalityError && "Passwords are not the same"}
        </p>
        <Button variant="default-colorful" size="small">
          Save
        </Button>
        {success && <p className="success-text successful-password-update-text">Password updated successfully!</p>}
      </form>
    </>
  );
};

export default AccountInformation;
