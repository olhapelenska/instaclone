import logo from "../../assets/images/logo.svg";
import houseIcon from "../../assets/images/home.svg";
import logOutIcon from "../../assets/images/log-out.svg";
import { Link, NavLink } from "react-router";
import "./Header.scss";

function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header className="header">
      <div className="header__container">
        <NavLink to="/" className="header__logo">
          <img src={logo} alt="InstaClone Logo" />
        </NavLink>
        <nav className="header__nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "header__home header__home--active" : "header__home"
            }
          >
            <img src={houseIcon} alt="Home Icon" />
          </NavLink>
          <NavLink to={`/users/${user?.id || ""}`} className="header__profile">
            <img src={`${baseUrl}${user.profile_picture}`} alt="Profile Icon" />
          </NavLink>
          <div className="header__log-out">
            <img src={logOutIcon} alt="" onClick={handleLogout} />
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
