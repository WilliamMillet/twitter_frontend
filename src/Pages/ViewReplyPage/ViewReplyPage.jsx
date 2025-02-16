import "./ViewReplyPage.css";
import StandardLayout from "../../Components/StandardLayout/StandardLayout";
import { useNavigate, useParams } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";
import IndividualPost from "../../Components/IndividualPost/IndividualPost";
import ReplyInterface from "../../Components/ReplyInterface/ReplyInterface";
import { useEffect, useRef } from "react";
import IndividualReply from "../../Components/IndividualReply/IndividualReply";

const ViewReplyPage = () => {
  const { id } = useParams(); // Get the reply id
  const navigate = useNavigate();

  const replyRef = useRef(null)


    const getRepliesData = useFetchData()

    useEffect(() => {
      getRepliesData.fetchData(`${process.env.REACT_APP_SERVER_URL}/api/replies/${id}/descendant-replies`, "GET")
    }, [id]);

  const handleNavigateToMainPage = () => {
    navigate("/");
  };

  const getMainReplyAndPostData = useFetchData();

  // Should get data in the format
//   {
//     replyData,
//     parentData,
//     isReplyingToReply,
//   }

  useEffect(() => {
    getMainReplyAndPostData.fetchData(
      `${process.env.REACT_APP_SERVER_URL}/api/replies/${id}`,
      "GET"
    );
  }, [id]);

  return (
    <StandardLayout doubleViewHeightCenterGridItem={true}>
      <div className="reply-page-header">
        <button
          className="text-only-button settings-arrow-btn"
          onClick={handleNavigateToMainPage}
        >
          🡰
        </button>
        <h4>Post</h4>
      </div>
      {getMainReplyAndPostData.response && (
        <div className="individual-post-and-reply-combined reply-page-main-content">
          {getMainReplyAndPostData?.response?.isReplyingToReply ? (
            <IndividualReply replyData={getMainReplyAndPostData.response.parentData} connectedToChildReply={true} clickable={true}/>
          ) : (
            <IndividualPost postData={getMainReplyAndPostData.response.parentData} connectedToReply={true} clickable={true}/>
          )}
          <div className="main-reply-to-scroll-to-container" ref={replyRef}>
              <IndividualReply replyData={getMainReplyAndPostData.response.replyData} connectedToPost={true} />
          </div>
        </div>
      )}
      {getMainReplyAndPostData?.response?.replyData && <ReplyInterface parentData={getMainReplyAndPostData.response.replyData} replyingToReply={true} />}
      {getRepliesData.response &&
        getRepliesData.response.map((reply) => (
          <IndividualReply replyData={reply} clickable={true}/>
        ))}
    </StandardLayout>
  );
};

export default ViewReplyPage;
