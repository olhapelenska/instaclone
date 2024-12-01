import "./GalleryHeader.scss";

function GalleryHeader({ activeTab, setActiveTab }) {
  return (
    <div className="user-content-header">
      <button
        className={`user-content-header__tab ${
          activeTab === "posts" ? "user-content-header__tab--active" : ""
        }`}
        onClick={() => setActiveTab("posts")}
      >
        Posts
      </button>
      <button
        className={`user-content-header__tab ${
          activeTab === "saved" ? "user-content-header__tab--active" : ""
        }`}
        onClick={() => setActiveTab("saved")}
      >
        Saved
      </button>
    </div>
  );
}

export default GalleryHeader;
