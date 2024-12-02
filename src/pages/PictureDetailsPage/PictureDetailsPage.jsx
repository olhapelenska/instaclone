import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PictureDetailsPage.scss";
import axios from "axios";

function PictureDetailsPage() {
  const { userId, postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const postResponse = await axios.get(
          `${baseUrl}/api/users/${userId}/posts/${postId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const galleryResponse = await axios.get(
          `${baseUrl}/api/users/${userId}/posts`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setPost(postResponse.data);
        setGallery(galleryResponse.data);
      } catch (error) {
        console.error(
          "Error fetching post details:",
          error.response?.data?.message || error.message
        );
      }
    };

    fetchData();
  }, [userId, postId]);

  const handlePostComment = async () => {
    const token = localStorage.getItem("token");

    if (!newComment.trim()) {
      setError("Comment cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/api/posts/${postId}/comments`,
        { user_id: user.id, comment: newComment.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedPostResponse = await axios.get(
        `${baseUrl}/api/users/${userId}/posts/${postId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPost(updatedPostResponse.data);
      setNewComment("");
      setError("");
    } catch (error) {
      console.error("Error posting comment:", error.response?.data);
      setError("Failed to post comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${baseUrl}/api/posts/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPost((prevPost) => ({
        ...prevPost,
        comments: prevPost.comments.filter(
          (comment) => comment.id !== commentId
        ),
      }));
    } catch (error) {
      console.error("Failed to delete comment:", error.response?.data?.message);
    }
  };

  const handleDeletePost = async () => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${baseUrl}/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate(`/users/${userId}`);
    } catch (error) {
      console.error("Error deleting post:", error.response?.data?.message);
      alert("Failed to delete post. Please try again.");
    }
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

  const currentIndex = gallery.findIndex((item) => item.id === postId);
  const prevPostId = currentIndex > 0 ? gallery[currentIndex - 1]?.id : null;
  const nextPostId =
    currentIndex < gallery.length - 1 ? gallery[currentIndex + 1]?.id : null;

  if (!post) return <p>Loading...</p>;

  return (
    <section className="picture-details">
      <button
        className="picture-details__close"
        onClick={() => navigate(`/users/${user.id}`)}
      >
        &times;
      </button>
      {prevPostId && (
        <button
          className="picture-details__arrow picture-details__arrow--left"
          onClick={() => navigate(`/users/${userId}/posts/${prevPostId}`)}
        >
          &lt;
        </button>
      )}
      {nextPostId && (
        <button
          className="picture-details__arrow picture-details__arrow--right"
          onClick={() => navigate(`/users/${userId}/posts/${nextPostId}`)}
        >
          &gt;
        </button>
      )}
      <div className="picture-details__container">
        <div className="picture-details__image">
          <img src={`${baseUrl}${post.image_url}`} alt={post.description} />
        </div>
        <div className="picture-details__info">
          <div className="picture-details__user">
            <img
              src={`${baseUrl}${post.profile_picture}`}
              alt="User profile"
              className="picture-details__user-picture"
            />
            <p className="picture-details__user-name">{post.user_name}</p>
          </div>
          <p className="picture-details__description">{post.description}</p>
          {user.id === post.user_id && (
            <button
              onClick={handleDeletePost}
              className="picture-details__delete-post"
            >
              Delete Post
            </button>
          )}
          <p className="picture-details__time-posted">
            {calculateRelativeTime(Date.parse(post.created_at))}
          </p>
          <p className="picture-details__time-posted">
            {post.likes_count} likes
          </p>
          <ul className="picture-details__comments">
            {Array.isArray(post.comments) && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <li key={comment.id} className="picture-details__comment">
                  <strong>{comment.user_name}:</strong> {comment.comment}
                  {user.id === post.user_id && (
                    <button
                      className="picture-details__delete-comment"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </ul>
          <div className="picture-details__comment-input">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="picture-details__input"
            />
            <button
              onClick={handlePostComment}
              className="picture-details__button"
            >
              Post
            </button>
          </div>
          {error && <p className="picture-details__error">{error}</p>}
        </div>
      </div>
    </section>
  );
}

export default PictureDetailsPage;
