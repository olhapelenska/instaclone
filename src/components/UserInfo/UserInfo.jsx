import { useState } from "react";
import axios from "axios";
import "./UserInfo.scss";

function UserInfo({
  profilePicture,
  userName,
  postCount,
  userId,
  refreshPosts,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    image: null,
  });
  const [error, setError] = useState("");
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.description || !formData.image) {
      setError("All fields are required.");
      return;
    }

    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();
    formDataToSend.append("description", formData.description);
    formDataToSend.append("image_url", formData.image);
    formDataToSend.append("user_id", userId);

    try {
      await axios.post(`${baseUrl}/api/posts`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setIsModalOpen(false);
      setFormData({ description: "", image: null });
      refreshPosts();
    } catch (error) {
      setError("Failed to create post. Please try again.");
    }
  };

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
        <button
          className="user-info__add-post"
          onClick={() => setIsModalOpen(true)}
        >
          Add Post
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal__content">
            <button
              className="modal__close"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <h3 className="modal__title">Create a Post</h3>
            <form className="modal__form" onSubmit={handleFormSubmit}>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter a description..."
                className="modal__input"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="modal__file-input"
                required
              />
              <button type="submit" className="modal__submit">
                Post
              </button>
              {error && <p className="modal__error">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserInfo;
