import Users from "../../components/Users/Users";
import Posts from "../../components/Posts/Posts";
import "./HomePage.scss";

function HomePage() {
  return (
    <main className="home-page">
      <div className="home-page__container">
        <Users />
        <Posts />
      </div>
    </main>
  );
}

export default HomePage;
