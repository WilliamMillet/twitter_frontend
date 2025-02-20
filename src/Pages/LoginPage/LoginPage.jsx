import "./LoginPage.css";
import { useForm } from "react-hook-form";
import StandardInput from "../../Components/StandardInput/StandardInput";
import Button from "../../Components/Button/Button";
import { useState } from "react";
import { useNavigate } from 'react-router-dom'


const LoginPage = () => {
  const [usingPhone, setUsingPhone] = useState(true);
  const [wrongPassOrContact, setWrongPassOrContact] = useState(false)

  const toggleUsingPhone = () => {
    setUsingPhone((prevUsingPhone) => !prevUsingPhone);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm();

  const navigate = useNavigate()


  const onSubmit = (data) => {

    const loginData = {
        password: data.password,
        ...(usingPhone ? { phone: data.phone } : { email: data.email})
    }

    fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => {
        if (response.status === 400) {
            setWrongPassOrContact(true)
            throw new Error('Invalid email or password')
        }
        return response.json();
      })
    .then(data => {
            localStorage.setItem('jsonwebtoken', JSON.stringify(data.token))
            localStorage.setItem('user_display_name', JSON.stringify(data.user_display_name))
            localStorage.setItem('user_identifying_name', JSON.stringify(data.user_identifying_name))
            localStorage.setItem('profile_link_suffix', JSON.stringify(data.profile_link_suffix))
            navigate('/'); 
    })
    .catch(error => {
        console.error('Error: ', error)
    })
  };

  const validation = {
    required: "Please enter a phone number",
    maxLength: {
      value: 200,
      message: "Username number cannot be longer than 200 characters",
    },
  };

  return (
    <main className="login-page full-size">
      <div className="login-form-container">
        <div className="login-form-top-container">
          <h4 className="x-button">×</h4>
        </div>
        <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
          <h2>Login to your account</h2>
          {usingPhone ? (
            <StandardInput
              label="Phone Number"
              name="phone"
              type="tel"
              requirements={validation}
              register={register}
              displayMaxLength={false}
              error={errors.username}
            />
          ) : (
            <StandardInput
              label="Email"
              name="email"
              type="email"
              requirements={validation}
              register={register}
              displayMaxLength={false}
              error={errors.username}
            />
          )}
          <button
            onClick={toggleUsingPhone}
            type="button"
            className="blue-text-button"
          >
            Use {usingPhone ? "email" : "phone"} instead
          </button>
          <StandardInput
            label="Password"
            name="password"
            type="password"
            requirements={validation}
            register={register}
            displayMaxLength={false}
            error={errors.password}
          />
          {wrongPassOrContact && <span className="standard-input-error">{usingPhone ? 'Phone number' : 'Email'} or password is incorrect.</span>}
          <button className="blue-text-button signup-instead-button" onClick={() => navigate('/signup')}>Signup instead</button>
          <Button
            size="medium-stretch"
            variant="default"
            type="submit"
            disabled={!isValid}
          >
            Login        
          </Button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
