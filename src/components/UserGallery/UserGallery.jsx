import "./UserGallery.scss";

function UserGallery({ content }) {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  if (!content || content.length === 0) {
    return <p className="gallery__empty">No posts yet.</p>;
  }

  return (
    <div className="gallery">
      {content.map((item) => (
        <div key={item.id} className="gallery__item">
          <img
            src={`${baseUrl}${item.image_url}`}
            alt={item.description || "Post"}
            className="gallery__image"
          />
        </div>
      ))}
    </div>
  );
}

export default UserGallery;
