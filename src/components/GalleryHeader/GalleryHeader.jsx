import "./GalleryHeader.scss";

function GalleryHeader({ activeTab, setActiveTab }) {
  const spriteUrl = `${import.meta.env.BASE_URL || ""}icons.svg`;
  return (
    <div className="gallery-header">
      <button
        className={`gallery-header__tab ${
          activeTab === "posts" ? "gallery-header__tab--active" : ""
        }`}
        onClick={() => setActiveTab("posts")}
      >
        <svg className="gallery-header__icon">
          <use href={`${spriteUrl}#icon-posts`} />
        </svg>
        Posts
      </button>
      <button
        className={`gallery-header__tab ${
          activeTab === "saved" ? "gallery-header__tab--active" : ""
        }`}
        onClick={() => setActiveTab("saved")}
      >
        <svg className="gallery-header__icon">
          <use href={`${spriteUrl}#icon-saved`} />
        </svg>
        Saved
      </button>
    </div>
  );
}

export default GalleryHeader;
