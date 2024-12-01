import "./UserInfo.scss";

function UserInfo({ profilePicture, userName, postCount }) {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  return (
    <div className="user-info">
      <img
        className="user-info__profile-picture"
        src={`${baseUrl}${profilePicture}`}
        alt={`${userName}'s profile`}
      />
      <h2 className="user-info__name">{userName}</h2>
      <p className="user-info__post-count">{postCount} Posts</p>
    </div>
  );
}

export default UserInfo;
