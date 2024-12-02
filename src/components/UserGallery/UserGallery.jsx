import { NavLink } from "react-router";
import "./UserGallery.scss";

function UserGallery({ content: posts }) {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  if (!posts || posts.length === 0) {
    return <p className="gallery__empty">No posts yet.</p>;
  }

  return (
    <div className="gallery">
      {posts.map((post) => (
        <NavLink
          key={post.id}
          className="gallery__item"
          to={`/users/${post.user_id}/posts/${post?.id || ""}`}
        >
          <img
            src={`${baseUrl}${post.image_url}`}
            alt={post.description || "Post"}
            className="gallery__image"
          />
        </NavLink>
      ))}
    </div>
  );
}

export default UserGallery;
