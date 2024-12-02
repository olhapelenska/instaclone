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

  // Fetch post and gallery data
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

  // Handle posting a new comment
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

      // Fetch the updated post details to ensure consistency
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

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`${baseUrl}/api/posts/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted comment from the state
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

  // Determine current index and next/previous posts
  const currentIndex = gallery.findIndex((item) => item.id === postId);
  const prevPostId = currentIndex > 0 ? gallery[currentIndex - 1]?.id : null;
  const nextPostId =
    currentIndex < gallery.length - 1 ? gallery[currentIndex + 1]?.id : null;

  // Render loading state
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
          <ul className="picture-details__comments">
            {Array.isArray(post.comments) && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <li key={comment.id} className="picture-details__comment">
                  <strong>{comment.user_name}:</strong> {comment.comment}
                  {user.id === post.user_id && ( // Check if logged-in user owns the post
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
