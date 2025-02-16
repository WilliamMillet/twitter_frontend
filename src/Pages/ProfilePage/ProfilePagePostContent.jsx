import { useEffect, useState } from "react";
import IndividualPost from "../../Components/IndividualPost/IndividualPost";
import useFetchData from "../../hooks/useFetchData";
import { useParams } from "react-router-dom";

const ProfilePagePostContent = () => {
  const { username } = useParams();

  const getUserPosts = useFetchData();

  const [posts, setPosts] = useState([]);
  const [noPostsFound, setNoPostsFound] = useState(false);

  const handleLoadPosts = (offsetValue) => {
    getUserPosts.fetchData(
      `${process.env.REACT_APP_SERVER_URL}/api/posts/algorithm-sorted-posts/${username}?limit=5&offset=${offsetValue}&orderBy=date&fromUsername=${username}`,
      "GET",
      { includeAuth: true }
    );
  };
  useEffect(() => {
    setPosts([]);
    handleLoadPosts(0);
  }, [username]);
  useEffect(() => {
    console.log(getUserPosts.response);

    if (getUserPosts.response && getUserPosts.response.length) {
      setPosts((prevPosts) => [...prevPosts, ...getUserPosts.response]);
    }
    if (getUserPosts?.response?.length === 0) {
      setNoPostsFound(true);
    }
  }, [getUserPosts.response]);

  return (
    <>
      {posts.map((post) => (
        <IndividualPost key={post.post_id} postData={post} clickable={true} />
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
  );
};

export default ProfilePagePostContent;
