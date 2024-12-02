import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUpPage.scss";
import logo from "../../assets/images/logo.svg";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${baseUrl}/api/users/register`, {
        email,
        password,
        user_name: userName,
      });

      if (response.data?.id) {
        console.log("Sign up successful! New user:", response.data);
        navigate("/login");
      } else {
        throw new Error("User registration failed. No user ID returned.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-page__container">
        <div className="signup-page__sign-up">
          <div className="signup-page__logo">
            <img src={logo} alt="InstaClone Logo" />
          </div>
          <form className="signup-page__form" onSubmit={handleSignUp}>
            <input
              className="signup-page__input"
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
            <input
              className="signup-page__input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="signup-page__input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="signup-page__button" type="submit">
              Sign Up
            </button>
          </form>
          {error && <p className="signup-page__error">{error}</p>}
        </div>
        <div className="signup-page__login">
          <p className="signup-page__text">Already have an account?</p>
          <span
            className="signup-page__link"
            onClick={() => navigate("/login")}
          >
            Log in
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
