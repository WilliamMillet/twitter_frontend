import "./DashboardPage.css";
import PostInterface from "../../Components/PostInterface/PostInterface";
import { useState } from "react";
import StandardLayout from "../../Components/StandardLayout/StandardLayout";
import IndividualPost from "../../Components/IndividualPost/IndividualPost";
import useFetchData from "../../hooks/useFetchData";

const DashboardPage = () => {
  const [selectedFeed, setSelectedFeed] = useState("For You");

  const posts = [
    {
      post_id: 1,
      user_identifying_name: "john_doe193",
      user_display_name: "John Doe",
      profile_image_url: "6069e6c2-ab6e-469f-8e66-24aa11e15316",
      bio: "This is my bio!",
      post_text: "Good morning everybody on this site",
      created_at: "2025-01-22T16:43:18.425134",
      mentioned_post_id: null,
      verified: true
    },
  ];

  return (
    <StandardLayout>
      <div className="feed-buttons">
        <button
          className={`feed-individual-button following-button ${
            selectedFeed === "For You" ? "active-feed" : "inactive-feed"
          }`}
          onClick={() => setSelectedFeed("For You")}
        >
          For You
        </button>
        <button
          className={`feed-individual-button following-button ${
            selectedFeed === "Following" ? "active-feed" : "inactive-feed"
          }`}
          onClick={() => setSelectedFeed("Following")}
        >
          Following
        </button>
      </div>
      <div className="feed-button-accents">
        <div
          className={`button-accent ${
            selectedFeed === "Following" && "zero-opacity"
          }`}
        ></div>
        <div
          className={`button-accent ${
            selectedFeed === "For You" && "zero-opacity"
          }`}
        ></div>
      </div>
      <PostInterface />
      {posts.map((post) => (
        <IndividualPost postData={post} clickable={true}/>
      ))}
    </StandardLayout>
  );
};

export default DashboardPage;
