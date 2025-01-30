import "./ViewPostPage.css";
import StandardLayout from "../../Components/StandardLayout/StandardLayout";
import { useNavigate, useParams } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";
import IndividualPost from "../../Components/IndividualPost/IndividualPost";
import ReplyInterface from "../../Components/ReplyInterface/ReplyInterface";
import { useEffect } from "react";
import IndividualReply from "../../Components/IndividualReply/IndividualReply";

const ViewPostPage = () => {
  const { id } = useParams(); // Get the post id
  const navigate = useNavigate()

  const getPostData = useFetchData()
  const getRepliesData = useFetchData()

  useEffect(() => {
    getPostData.fetchData(`http://localhost:5000/api/posts/${id}`, "GET");
    getRepliesData.fetchData(`http://localhost:5000/api/posts/${id}/replies`, "GET")
  }, [id]);


  useEffect(() => {
    console.log(getRepliesData.response);
  }, [getPostData.response]);

  const handleNavigateToMainPage = () => {
    navigate('/')
  }

  return (
    <StandardLayout>
      <div className="post-page-header">
        <button
          className="text-only-button settings-arrow-btn"
          onClick={handleNavigateToMainPage}
        >
          🡰
        </button>{" "}
        <h4>Account information</h4>
      </div>
      <IndividualPost postData={getPostData.response || null} />
      <ReplyInterface parentPostData={getPostData.response}/>
      {getRepliesData.response && getRepliesData.response.map(reply => (
        <IndividualReply replyData={reply}/>
      ))}
    </StandardLayout>
  );
};

export default ViewPostPage;


