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
      <div className="user-info__content">
        <h1 className="user-info__name">{userName}</h1>
        <div className="user-info__post-count">
          <span className="user-info__post-count-number">{postCount} </span>
          <span className="user-info__post-count-text">Posts</span>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
