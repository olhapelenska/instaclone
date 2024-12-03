import { useEffect, useState } from "react";
import "./Posts.scss";
import axios from "axios";
import { NavLink } from "react-router";
function Posts() {
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const spriteUrl = `${import.meta.env.BASE_URL || ""}icons.svg`;
  const user = JSON.parse(localStorage.getItem("user"));

  const getPosts = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}/api/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error.response?.data?.message);
    }
  };

  const handleLike = async (postId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to like posts!");
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/api/posts/${postId}/likes`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      getPosts();
    } catch (error) {
      console.error("Error toggling like:", error.response?.data?.message);
    }
  };

  const handlePostComment = async (postId) => {
    const token = localStorage.getItem("token");
    const comment = commentInputs[postId]?.trim();

    if (!comment) return;

    try {
      await axios.post(
        `${baseUrl}/api/posts/${postId}/comments`,
        { user_id: user.id, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      getPosts();
    } catch (error) {
      console.error("Error posting comment:", error.response?.data?.message);
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  function calculateRelativeTime(date) {
    const SECONDS_IN_MINUTE = 60;
    const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE;
    const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR;
    const SECONDS_IN_MONTH = 30.44 * SECONDS_IN_DAY;
    const SECONDS_IN_YEAR = 365.25 * SECONDS_IN_DAY;

    const oldDateSeconds = Math.floor(date / 1000);
    const currentDate = Date.now();
    const currentDateSeconds = Math.floor(currentDate / 1000);
    const difference = currentDateSeconds - oldDateSeconds;

    let output = ``;
    if (difference < SECONDS_IN_MINUTE) {
      output = `${difference} seconds ago`;
    } else if (difference < SECONDS_IN_HOUR) {
      output = `${Math.floor(difference / SECONDS_IN_MINUTE)} minutes ago`;
    } else if (difference < SECONDS_IN_DAY) {
      output = `${Math.floor(difference / SECONDS_IN_HOUR)} hours ago`;
    } else if (difference < SECONDS_IN_MONTH) {
      output = `${Math.floor(difference / SECONDS_IN_DAY)} days ago`;
    } else if (difference < SECONDS_IN_YEAR) {
      output = `${Math.floor(difference / SECONDS_IN_MONTH)} months ago`;
    } else {
      output = `${Math.floor(difference / SECONDS_IN_YEAR)} years ago`;
    }

    return output;
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <section className="posts">
      <ul className="posts__list">
        {posts.map((post) => (
          <li key={post.id} className="posts__item">
            <div
              to={`/users/${post?.user_id || ""}`}
              className="posts__user-info"
            >
              <NavLink to={`/users/${post?.user_id || ""}`}>
                <img
                  className="posts__profile-picture"
                  src={`${baseUrl}${post.profile_picture}`}
                  alt="profile picture"
                />
              </NavLink>
              <NavLink to={`/users/${post?.user_id || ""}`}>
                <p className="posts__user-name">{post.user_name}</p>
              </NavLink>
            </div>
            <img
              className="posts__picture"
              src={`${baseUrl}${post.image_url}`}
              alt="post"
            />
            <button
              className="posts__likes"
              onClick={() => handleLike(post.id)}
            >
              <svg
                className={`posts__likes-icon ${
                  post.is_liked ? "posts__likes-icon--liked" : ""
                }`}
              >
                <use href={`${spriteUrl}#icon-heart`} />
              </svg>
            </button>
            <p className="posts__likes-count">{post.likes_count} likes</p>
            <div className="posts__description">
              <span>{post.user_name} </span>
              <span>{post.description}</span>
            </div>
            <p className="posts__comments-count">
              {post.comments_count} comments
            </p>
            <ul className="posts__comments-list">
              {post.comments.map((comment) => (
                <li key={comment.id} className="posts__comment">
                  <strong>{comment.user_name}:</strong> {comment.comment}
                </li>
              ))}
            </ul>
            <p className="posts__time-posted">
              {calculateRelativeTime(Date.parse(post.created_at))}
            </p>
            <div className="posts__comment-input">
              <input
                type="text"
                value={commentInputs[post.id] || ""}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                placeholder="Add a comment..."
                className="posts__input"
              />
              <button
                onClick={() => handlePostComment(post.id)}
                className="posts__button"
              >
                Post
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Posts;
