import { useEffect, useState } from "react";
import "./Users.scss";
import axios from "axios";
import { NavLink } from "react-router";

function Users() {
  const [users, setUsers] = useState([]);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  console.log(users);

  const getUsers = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${baseUrl}/api/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(response.data);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="users">
      <ul className="users__list">
        {users.map((user) => {
          return (
            <NavLink
              className="users__item"
              key={user.id}
              to={`/users/${user?.id || ""}`}
            >
              <img
                className="users__picture"
                src={`${baseUrl}${user.profile_picture}`}
                alt="profile picture"
              />
              <p className="users__username">{user.user_name}</p>
            </NavLink>
          );
        })}
      </ul>
    </div>
  );
}

export default Users;
