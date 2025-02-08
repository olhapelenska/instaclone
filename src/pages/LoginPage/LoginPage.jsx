import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/images/logo.svg";
import "./LoginPage.scss";

function LoginPage({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${baseUrl}/api/users/login`, {
        email,
        password,
      });

      const token = response.data.token;
      const user = response.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setIsAuthenticated(true);

      navigate("/");

      console.log("Login successful! Token saved:", token);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
    }
  };

  const handleDemoLogin = () => {
    setEmail("alice@example.com");
    setPassword("password123");

    setTimeout(() => {
      handleLogin();
    }, 300);
  };

  return (
    <div className="login-page">
      <div className="login-page__container">
        <div className="login-page__login">
          <div className="login-page__logo">
            <img src={logo} alt="InstaClone Logo" />
          </div>
          <form className="login-page__form" onSubmit={handleLogin}>
            <input
              className="login-page__input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="login-page__input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="login-page__button" type="submit">
              Log in
            </button>
          </form>
          <button className="login-page__demo-button" onClick={handleDemoLogin}>
            Demo Login
          </button>
          {error && <p className="login-page__error">{error}</p>}
        </div>
        <div className="login-page__sign-up">
          <p className="login-page__text">Don't have an account?</p>
          <span
            className="login-page__link"
            onClick={() => navigate("/sign-up")}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
