import { useEffect, useState } from "react";
import "./Posts.scss";
import heartIcon from "../../assets/images/heart.svg";
import axios from "axios";
import { NavLink } from "react-router";
function Posts() {
  const [posts, setPosts] = useState([]);
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const getPosts = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${baseUrl}/api/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
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

      console.log(response.data.message);
      getPosts(); // Refresh posts to update likes count
    } catch (error) {
      console.error("Error toggling like:", error.response?.data?.message);
    }
  };

  useEffect(() => {
    getPosts();
  }, []); // Empty dependency array to avoid repeated calls

  return (
    <section className="posts">
      <ul className="posts__list">
        {posts.map((post) => (
          <li key={post.id} className="posts__item">
            <div className="posts__user-info">
              <NavLink to={`/users/${post?.user_id || ""}`}>
                <img
                  className="posts__profile-picture"
                  src={`${baseUrl}${post.profile_picture}`}
                  alt="profile picture"
                />
              </NavLink>
              <p className="posts__user-name">{post.user_name}</p>
            </div>
            <img
              className="posts__picture"
              src={`${baseUrl}${post.image_url}`}
              alt="post"
            />
            <div className="posts__likes">
              <img
                className={`posts__likes-icon ${
                  post.is_liked ? "posts__likes-icon--liked" : ""
                }`}
                src={heartIcon}
                alt="heart icon"
                onClick={() => handleLike(post.id)}
              />
              <p className="posts__likes-count">{post.likes_count} likes</p>
            </div>
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
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Posts;
