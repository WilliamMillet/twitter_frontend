import { useNavigate } from "react-router-dom";

// mentionedUserData should be an object with the following keys

// mentioned_post_id,
// mentioned_post_text,
// mentioned_post_created_at,
// mentioned_post_image_uuid,
// mentioned_post_user_display_name,
// mentioned_post_user_identifying_name,
// mentioned_post_user_profile_image_url,
// mentioned_post_bio,
// mentioned_post_verified

const IndividualMentionedPost = ({ mentionedPostData }) => {

  const mentionedPostProfileImageSource =
    mentionedPostData?.mentioned_post_user_profile_image_url
      ? "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
        mentionedPostData.mentioned_post_user_profile_image_url
      : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  const mentionedPostImageSource = mentionedPostData?.mentioned_post_image_uuid
    ? "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
      mentionedPostData.mentioned_post_image_uuid
    : null;

  const navigate = useNavigate();


  const handleRedirectToPostPage = () => {
    navigate(`/posts/${mentionedPostData.mentioned_post_id}`);
  };

  // No handle redirect to profile

  return (
    <div className="mentioned_post-container" onClick={handleRedirectToPostPage}>
      <div className="mentioned-post-container-metadata-row">
        <div className="individual-row-profile-image-container">
          <img
            src={mentionedPostProfileImageSource}
            alt="Profile picture"
            className="mentioned-post-profile-image"
          />
        </div>
        <p className="mentioned-post-display-name-text">
          {mentionedPostData.mentioned_post_user_display_name}
        </p>
        {mentionedPostData.mentioned_user_verified && (
          <img
            className="mentioned-user-verification-check-image"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/1200px-Twitter_Verified_Badge.svg.png"
          ></img>
        )}
        <p className="mentioned-post-identifying-name-text">
          @{mentionedPostData.mentioned_post_user_identifying_name}
        </p>
      </div>
      <div className="mentioned-post-container-main-content">
        <p className="mentioned-post-text">
          {mentionedPostData.mentioned_post_text}
        </p>
        {mentionedPostImageSource && <img src={mentionedPostImageSource} />}
      </div>
    </div>
  );
};

export default IndividualMentionedPost;
