import { useEffect, useState } from "react";
import useFetchData from "../../hooks/useFetchData";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ProfilePageMediaContent = () => {
    const { username } = useParams();

    const navigate = useNavigate()

    const getUserMedia = useFetchData();

    const [media, setMedia] = useState([]);
    const [noMediaFound, setNoMediaFound] = useState(false);

    const handleLoadMedia = (offsetValue) => {
        getUserMedia.fetchData(
            `${process.env.REACT_APP_SERVER_URL}/api/users/${username}/media?limit=5&offset=${offsetValue}`,
            "GET",
        );
    };
    
    useEffect(() => {
        setMedia([]);
        handleLoadMedia(0);
    }, [username]);


    useEffect(() => {
        console.log(getUserMedia.response);

        if (getUserMedia.response && getUserMedia.response.length) {
            setMedia((prevMedia) => [...prevMedia, ...getUserMedia.response]);
        }
        if (getUserMedia?.response?.length === 0) {
            setNoMediaFound(true);
        }
    }, [getUserMedia.response]);


    const uuidToImageLink = (uuid) => {
        return 'https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/' + uuid
    }



    // Data should be an object containing content_type and content_id
    // Content_type must be post or reply

    const handleRedirect = (data) => {
        const routes = {
          post: 'posts',
          reply: 'replies',
        };
      
        navigate(`/${routes[data.content_type]}/${data.content_id}`);
      };
        
    return (
        <>
            <div className="media-container">
            {media.map((item) => (
                <div className="individual-media-container">
                    <img src={uuidToImageLink(item.image_uuid)} alt='Media' onClick={() => handleRedirect(item)}/>
                </div>
            ))}
            </div>
            <button
                className="load-more-posts-button"
                onClick={() => handleLoadMedia(media?.length || 0)}
            >
                Load more media
            </button>
            <p
                className={`no-posts-found-button ${
                    noMediaFound && "has-no-media-found-text"
                }`}
            >
                {noMediaFound && "No media found!"}
            </p>
        </>
    );
};

export default ProfilePageMediaContent;
