import { useEffect, useState, Suspense } from "react";
import { useParams } from "react-router-dom";

import "./SearchPage.css";
import StandardLayout from "../../Components/StandardLayout/StandardLayout";
import StandardOptions from "../../Components/StandardOptions/StandardOptions";
import IndividualPost from "../../Components/IndividualPost/IndividualPost";
import FlashingGrayBarsLoadingAnimation from "../../Components/FlashingGrayBarsLoadingAnimation/FlashingGrayBarsLoadingAnimation";
import ProfilePreview from "../../Components/ProfilePreview/ProfilePreview";
import useFetchData from "../../hooks/useFetchData";

const SearchPage = () => {
  const { query } = useParams();

  const [selectedOption, setSelectedOption] = useState("Top");
  const [noPostsFound, setNoPostsFound] = useState(false);
  const [posts, setPosts] = useState([]);

  const getPosts = useFetchData([]);
  const getMatchingProfiles = useFetchData();

  const userIdentifyingName = JSON.parse(
    localStorage.getItem("user_identifying_name")
  );

  const handleLoadPosts = (offsetValue) => {
    let sortMethod;

    if (selectedOption === "Top") sortMethod = "score";
    if (selectedOption === "Latest") sortMethod = "date";

    getPosts.fetchData(
      `http://localhost:5000/api/posts/algorithm-sorted-posts/${userIdentifyingName}?limit=5&offset=${offsetValue}&pattern=${query}&orderBy=${sortMethod}`,
      "GET",
      { includeAuth: true }
    );
  };

  useEffect(() => {
    setPosts([]);
    handleLoadPosts(0);
  }, [selectedOption]);

  useEffect(() => {
    console.log(getPosts.response);

    if (getPosts.response && getPosts.response.length) {
      setPosts((prevPosts) => [...prevPosts, ...getPosts.response]);
    }
    if (getPosts?.response?.length === 0) {
      setNoPostsFound(true);
    }
  }, [getPosts.response]);

  useEffect(() => {
    let limit;
    if (selectedOption === "Top") {
      limit = 4;
    } else if (selectedOption === "People") {
      limit = 50; // There probably won't be more than 50 users on this test site. I may change this later.
    }

    getMatchingProfiles.fetchData(
      `http://localhost:5000/api/users/top-accounts-main-details?limit=${limit}&pattern=${JSON.stringify(
        query
      )}`,
      "GET"
    );
  }, [selectedOption]);

  return (
    <StandardLayout>
      <StandardOptions
        options={["Top", "Latest", "People"]}
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
        defaultOption="Posts"
        borders={[false, true, false]}
        textAlign="center"
      />

      {selectedOption === "Top" && (
        <>
          <h3 className="search-page-people-label">People</h3>
          {getMatchingProfiles.response &&
            getMatchingProfiles.response.map((profile, index) => (
              <ProfilePreview
                key={index}
                profileData={profile}
                truncateAtChar="40"
                includeBio={true}
              />
            ))}
          <button
            className="view-all-people-button"
            onClick={() => setSelectedOption("People")}
          >
            View all
          </button>
        </>
      )}

      {selectedOption === "People" && (
        <div>
          <h3 className="search-page-people-label">People</h3>
          {(getMatchingProfiles.response || []).map((profile, index) => (
            <ProfilePreview
              key={index}
              profileData={profile}
              truncateAtChar="40"
              includeBio={true}
              fractcals={true}
            />
          ))}
        </div>
      )}

      {["Top", "Latest"].includes(selectedOption) && (
        <>
          <h3 className="search-page-post-label">Posts</h3>
          {posts.map((post) => (
            <IndividualPost
              key={post.post_id}
              postData={post}
              clickable={true}
            />
          ))}
          <button
            className="load-more-posts-button"
            onClick={() => handleLoadPosts(posts?.length || 0)}
          >
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
      )}
    </StandardLayout>
  );
};

export default SearchPage;