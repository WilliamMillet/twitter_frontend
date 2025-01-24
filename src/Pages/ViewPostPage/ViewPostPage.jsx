import "./ViewPostPage.css";
import StandardLayout from "../../Components/StandardLayout/StandardLayout";
import { useNavigate, useParams } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";
import IndividualPost from "../../Components/IndividualPost/IndividualPost";
import { useEffect } from "react";

const ViewPostPage = () => {
  const { id } = useParams(); // Get the post id
  const navigate = useNavigate()
  
  const {
    response: mainPostResponse,
    error: mainPostError,
    loading: mainPostLoading,
    fetchData: mainPostFetchFunction,
  } = useFetchData();

  useEffect(() => {
    mainPostFetchFunction(`http://localhost:5000/api/posts/${id}`, "GET");
  }, [id]);

  useEffect(() => {
    console.log(mainPostResponse);
  }, [mainPostResponse]);

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
      <IndividualPost postData={mainPostResponse || null} />
    </StandardLayout>
  );
};

export default ViewPostPage;


