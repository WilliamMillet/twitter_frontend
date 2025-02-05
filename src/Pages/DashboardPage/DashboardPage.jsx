import "./DashboardPage.css";
import PostInterface from "../../Components/PostInterface/PostInterface";
import { useEffect, useState } from "react";
import StandardLayout from "../../Components/StandardLayout/StandardLayout";
import IndividualPost from "../../Components/IndividualPost/IndividualPost";
import useFetchData from "../../hooks/useFetchData";
import FlashingGrayBarsLoadingAnimation from "../../Components/FlashingGrayBarsLoadingAnimation/FlashingGrayBarsLoadingAnimation";
import { Suspense } from "react";

const DashboardPage = () => {
  const [selectedFeed, setSelectedFeed] = useState("For You");

  const userIdentifyingName = JSON.parse(
    localStorage.getItem("user_identifying_name")
  );

  // const posts = [
  //   {
  //     post_id: 1,
  //     user_identifying_name: "john_doe193",
  //     user_display_name: "John Doe",
  //     profile_image_url: "6069e6c2-ab6e-469f-8e66-24aa11e15316",
  //     bio: "This is my bio!",
  //     post_text: "Good morning everybody on this site",
  //     created_at: "2025-01-22T16:43:18.425134",
  //     mentioned_post_id: null,
  //     verified: true
  //   },
  // ];

  const [noPostsFound, setNoPostsFound] = useState(false);
  const [posts, setPosts] = useState([]);

  const getPosts = useFetchData();

  const handleLoadPosts = (offsetValue) => {
    if (selectedFeed === "Following") {
      getPosts.fetchData(
        `
        http://localhost:5000/api/posts/algorithm-sorted-posts/${userIdentifyingName}?limit=5&offset=${offsetValue}&followedBy=${userIdentifyingName}&orderBy=date`,
        "GET",
        { includeAuth: true }
      );
    } else if (selectedFeed === "For You") {
      getPosts.fetchData(
        `http://localhost:5000/api/posts/algorithm-sorted-posts/${userIdentifyingName}?limit=5&offset=${offsetValue}`,
        "GET",
        { includeAuth: true }
      );
    }
  };

  // Set the offset to zero, as 

  useEffect(() => {
    setPosts([]);
    handleLoadPosts(0);
  }, [selectedFeed]);

  useEffect(() => {

    if (getPosts.response && getPosts.response.length) {
      setPosts((prevPosts) => [...prevPosts, ...getPosts.response]);
    }
    if (getPosts?.response?.length === 0) {
      setNoPostsFound(true);
    }
  }, [getPosts.response]);

  // Set no posts found to false after 3 seconds so that the text dissapears. 3 seconds is the length of the fade in out animation

  useEffect(() => {
    if (noPostsFound) {
      setTimeout(() => setNoPostsFound(false), 3000);
    }
  }, [noPostsFound]);

  return (
    <StandardLayout>
      <div className="feed-buttons">
        <button
          className={`feed-individual-button ${
            selectedFeed === "For You" ? "active-feed" : "inactive-feed"
          }`}
          onClick={() => setSelectedFeed("For You")}
        >
          For You
        </button>
        <button
          className={`feed-individual-button ${
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
      <Suspense fallback={<FlashingGrayBarsLoadingAnimation numberOfBars={6} spacingPx={30} verticalPosition="start" />}>
        <>
          {posts.map((post) => (
            <IndividualPost key={post.post_id} postData={post} clickable={true} />
          ))}
          <button className="load-more-posts-button" onClick={() => handleLoadPosts(posts?.length || 0)}>
            Load more posts
          </button>
          <p
            className={`no-posts-found-button ${
              noPostsFound && "has-no-post-found-text"
            }`}
          >
            {noPostsFound && "No posts found!"}
          </p>
        </>
      </Suspense>
    </StandardLayout>
  );
};

export default DashboardPage;
