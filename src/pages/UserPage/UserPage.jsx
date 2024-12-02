import React, { useEffect, useState } from "react";
import UserInfo from "../../components/UserInfo/UserInfo";
import GalleryHeader from "../../components/GalleryHeader/GalleryHeader";
import UserGallery from "../../components/UserGallery/UserGallery";
import axios from "axios";
import { useParams } from "react-router";

function UserPage() {
  const [user, setUser] = useState();
  const [activeTab, setActiveTab] = useState("posts");
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const { id } = useParams();

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${baseUrl}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data?.message);
    }
  };

  const refreshPosts = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(`${baseUrl}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser((prev) => ({ ...prev, posts: response.data.posts }));
    } catch (error) {
      console.error("Error refreshing posts:", error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <main className="user-page">
      <UserInfo
        profilePicture={user.profile_picture}
        userName={user.user_name}
        postCount={user.posts.length}
        userId={user.id}
        refreshPosts={refreshPosts}
      />
      <GalleryHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <UserGallery
        content={activeTab === "posts" ? user.posts : user.savedPosts}
        userId={user.id}
      />
    </main>
  );
}

export default UserPage;
