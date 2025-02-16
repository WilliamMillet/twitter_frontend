import { useEffect, useState } from "react";
import IndividualPost from "../../Components/IndividualPost/IndividualPost";
import useFetchData from "../../hooks/useFetchData";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import IndividualReply from "../../Components/IndividualReply/IndividualReply";

const ProfilePageReplyContent = () => {
  const { username } = useParams();

  const getUserRepliesWithParentPosts = useFetchData();

  const [repliesWithParentPosts, setRepliesWithParentPosts] = useState([]);
  const [noRepliesWithParentPostsFound, setNoRepliesWithParentPostsFound] = useState(false);

  const handleLoadRepliesWithParentPosts = (offsetValue) => {
    getUserRepliesWithParentPosts.fetchData(
      `${process.env.REACT_APP_SERVER_URL}/api/users/${username}/replies?limit=5&offset=${offsetValue}`,
      "GET",
    );
  };
  useEffect(() => {
    setRepliesWithParentPosts([]);
    handleLoadRepliesWithParentPosts(0);
  }, [username]);
  useEffect(() => {

    if (getUserRepliesWithParentPosts.response && getUserRepliesWithParentPosts.response.length) {
      setRepliesWithParentPosts((prevPosts) => [...prevPosts, ...getUserRepliesWithParentPosts.response]);
    }
    if (getUserRepliesWithParentPosts?.response?.length === 0) {
      setNoRepliesWithParentPostsFound(true);
    }
  }, [getUserRepliesWithParentPosts.response]);

  // Transform the post and reply data to be an object in the format [...{postData: {....}, replyData: {....}}]

  const transformedArray = useMemo(() => {
    // nameMap for remapping post keys
    const nameMap = {
      parent_post_id: "post_id",
      parent_post_user_identifying_name: "user_identifying_name",
      parent_post_user_display_name: "user_display_name",
      parent_profile_image_url: "profile_image_url",
      parent_post_verified: "verified",
      parent_post_bio: "bio",
      parent_post_text: "post_text",
      parent_post_image_uuid: "image_uuid",
      parent_post_created_at: "created_at",
      parent_mentioned_post_id: "mentioned_post_id",
      mentioned_post_text: "mentioned_post_text",
      mentioned_post_created_at: "mentioned_post_created_at",
      mentioned_post_image_uuid: "mentioned_post_image_uuid",
      mentioned_post_user_display_name: "mentioned_post_user_display_name",
      mentioned_post_user_identifying_name: "mentioned_post_user_identifying_name",
      mentioned_post_user_profile_image_url: "mentioned_post_user_profile_image_url",
      mentioned_post_user_bio: "mentioned_post_user_bio",
      mentioned_post_user_verified: "mentioned_post_user_verified",
      parent_like_count: "like_count",
      parent_reply_count: "reply_count"
    };
  
    // Map over your array of objects
    return repliesWithParentPosts.map((item) => {
      // Convert the current object into an array of entries
      const entries = Object.entries(item);
      
      // Slice the first 15 entries for replyData and the rest for postData
      const replyEntries = entries.slice(0, 15);
      const postEntries = entries.slice(15);
      
      // Convert the reply entries back into an object
      const replyData = Object.fromEntries(replyEntries);
      
      // Build the postData object while remapping keys based on nameMap
      const postData = postEntries.reduce((acc, [key, value]) => {
        const newKey = nameMap[key] || key;
        acc[newKey] = value;
        return acc;
      }, {});

      return { replyData, postData };
    });
  }, [repliesWithParentPosts]);
  

  return (
    <>
      {transformedArray.map((data, index) => (
        <div className="individual-post-and-reply-combined">
          <IndividualPost key={`p-${index}`} postData={data.postData} clickable={true} connectedToReply={true}/>
          <IndividualReply key={`r-${index}`} replyData={data.replyData} clickable={true} connectedToPost={true}/>
        </div>
      ))}
      <button
        className="load-more-posts-button"
        onClick={() => handleLoadRepliesWithParentPosts(repliesWithParentPosts?.length || 0)}
      >
        Load more replies
      </button>
      <p
        className={`no-posts-found-button ${
          noRepliesWithParentPostsFound && "has-no-post-found-text"
        }`}
      >
        {noRepliesWithParentPostsFound && "No Replies found!"}
      </p>
    </>
  );
};

export default ProfilePageReplyContent;
