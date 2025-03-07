import { useForm } from "react-hook-form";
import StandardInput from "../../Components/StandardInput/StandardInput";
import validationRules from "../SignupPage/validationRules";
import editProfilePopupValidation from "./editProfilePopupValidation";
import Button from "../../Components/Button/Button";
import { useEffect, useState } from "react";
import useFetchPrivateUserData from "../../hooks/useFetchPrivateUserData";
import FlashingGrayBarsLoadingAnimation from "../../Components/FlashingGrayBarsLoadingAnimation/FlashingGrayBarsLoadingAnimation";

const EditProfilePopup = ({setIsEditPopupOpen}) => {
  const [wrongFileType, setWrongFileType] = useState(false);

  const { userData, error, loading, fetchUserData } = useFetchPrivateUserData();

  useEffect(() => {
    fetchUserData();
  }, []);



  const profileImageSource = userData?.profile_image_url
    ? "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
      userData.profile_image_url
    : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

  const bannerImagesource = userData?.cover_image_url
  ? "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
      userData.cover_image_url
  : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0yCgViCJ4Hmeyk6dRvEqkrQ4AkhcRR04BXQ&s'

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm();

  useEffect(() => {
    if (userData) {
      reset({
        name: userData?.user_display_name || "",
        bio: userData?.bio || "",
        location: userData?.location || "",
        website: userData?.link || "",
      });
    }
  }, [userData]);

  const handleSave = () => {

  }

  const onSubmit = (data) => {

    const textInformationHasChanged =
      data.name != userData.user_display_name ||
      data.bio != userData.bio ||
      data.location != userData.location ||
      data.website != userData.link;
  
    const profileInformationHasChanged = data["profile-picture"].length > 0;
    const bannerInformationHasChanged = data["banner-image"].length > 0;
  
    if (!textInformationHasChanged && !profileInformationHasChanged && !bannerInformationHasChanged) {
      console.log("No changes made to data");
      return;
    }
  
    const token = JSON.parse(localStorage.getItem('jsonwebtoken'));
  
    // Update text information if it has changed
    if (textInformationHasChanged) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/changeUserDetails`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: data.name,
          bio: data.bio,
          location: data.location,
          website: data.website
        })
      })
      .then(response => response.json())
      .then(result => {
        if (!profileInformationHasChanged) {
          window.location.reload()
        }
      })
      .catch(error => {
        console.error('Error updating user details:', error);
      });
    }
  
    // Function to upload image using pre-signed URL

    // Upload profile picture if it has changed
    if (profileInformationHasChanged) {
      const profileImageFile = data["profile-picture"][0];

      fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/getPresignedUrlToUpdateProfileImage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fileType: profileImageFile.type })
      })
      .then(response => response.json())
      .then(({ url }) => {
        return fetch(url, {
          method: 'PUT',
          body: profileImageFile
        });
      })
      .then(uploadResponse => {
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload profile image');
        }
      })
      .catch(error => {
        console.error('Error uploading profile image:', error);
      });
    }
  
    // Upload banner image if it has changed
    if (bannerInformationHasChanged) {

      const userHasBanner = userData.cover_image_url;

      const bannerImageFile = data["banner-image"][0];
  
      if (userHasBanner) {
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/getPresignedUrlToUpdateBannerImage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ fileType: bannerImageFile.type })
        })
        .then(response => response.json())
        .then(({ url }) => {
          return fetch(url, {
            method: 'PUT',
            body: data["banner-image"][0]
          });
        })
        .then(uploadResponse => {
          if (!uploadResponse.ok) {
            throw new Error('Failed to upload banner image');
          }
        })
        .catch(error => {
          console.error('Error uploading banner image:', error);
        });
      } else {
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/getPresignedUrlToAddBannerImage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ fileType: bannerImageFile.type })
        })
        .then(response => response.json())
        .then(response => {
          const { url, uniqueId } = response;
          
          return fetch(url, {
            method: 'PUT',
            body: data["banner-image"][0]
          })
          .then(uploadResponse => {
            if (!uploadResponse.ok) {
              throw new Error('Failed to upload banner image');
            }
            return uniqueId; // Return the uniqueId for the next fetch call
          });
        })
        .then(uniqueId => {
          return fetch(`${process.env.REACT_APP_SERVER_URL}/api/users/updateBannerLink`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ uniqueId })
          });
        })
        .then(response => response.json())
        .then(data => {
          
        })
        .catch(error => {
          console.error('Error uploading banner image or updating banner link:', error);
        });
      }
    }
    window.location.reload()
  };

  const watchedProfile = watch('profile-picture')
  const watchedBanner = watch('banner-image')
  
  const [profilePictureUrl, setProfilePictureUrl] = useState(null)
  const [bannerPictureUrl, setBannerPictureUrl] = useState(null)

  useEffect(() => {
    if (watchedProfile && watchedProfile.length > 0) {
      const file = watchedProfile[0];
      const url = URL.createObjectURL(file);
      setProfilePictureUrl(url);
    }
  }, [watchedProfile]);

  useEffect(() => {
    if (watchedBanner && watchedBanner.length > 0) {
      const file = watchedBanner[0];
      const url = URL.createObjectURL(file);
      setBannerPictureUrl(url);
    }
  }, [watchedBanner]);


  return (
    <div className="edit-profile-popup-dark-overlay">
      <form
        className={`edit-profile-popup ${loading && "display-flex-center"}`}
        onSubmit={handleSubmit(onSubmit)}
      >
        {loading ? (
          <FlashingGrayBarsLoadingAnimation numberOfBars={10} spacingPx={30} verticalPosition='center'/>
        ) : (
          <>
            <div className="edit-profile-header">
              <button className="grey-hover-plain-text-button close-edit-profile-menu-button" onClick={() => setIsEditPopupOpen(false)}>
                ×
              </button>
              <h3>Edit Profile</h3>
              <Button
                type="submit"
                variant="default"
                size="extra-small"
                className="save-profile-changes-button"
                onClick={handleSave}
              >
                Save
              </Button>
            </div>
            <div className="banner-container">
              <div className="banner-image-upload-section">
                <input
                  type="file"
                  className="banner-upload-real-input"
                  id="banner-upload-display-button"
                  {...register(
                    "banner-image",
                    editProfilePopupValidation.profile
                  )}
                />
                <label htmlFor="banner-upload-display-button">
                  <img
                    src={`${process.env.REACT_APP_CLIENT_URL}/assets/add_image_icon.png`}
                    alt="Upload Banner"
                    className="banner-camera-overlay"
                  />
                  <div className="banner-add-dark-overlay"></div>
                  <img
                    className="banner-uploaded-image"
                    src={bannerPictureUrl ? bannerPictureUrl : bannerImagesource}
                    alt="banner-pic"
                  />
                </label>
              </div>
              {wrongFileType && (
                <span className="banner-upload-error center-text">
                  {"Please select either a JPEG or PNG file for your banner"}
                </span>
              )}
            </div>
            <div className="edit-profile-img-upload-and-error-container">
              <div className="edit-profile-img-upload-container">
                <input
                  type="file"
                  className="edit-profile-file-input-real-btn"
                  id="edit-profile-file-input-display-btn"
                  {...register(
                    "profile-picture",
                    editProfilePopupValidation.profile
                  )}
                />
                <label htmlFor="edit-profile-file-input-display-btn">
                  <img
                    src={`${process.env.REACT_APP_CLIENT_URL}/assets/add_image_icon.png`}
                    alt="Add image"
                    className="edit-profile-camera-overlay"
                  />
                  <div className="edit-profile-add-image-dark-overlay"></div>
                  <img
                    className="edit-profile-file-input-img"
                    src={profilePictureUrl ? profilePictureUrl : profileImageSource}
                    alt="profile-pic"
                  />
                </label>
              </div>
              {wrongFileType && (
                <span className="standard-input-error center-text">
                  {"Please select either a JPEG or PNG file"}
                </span>
              )}
            </div>
            <StandardInput
              label="Name"
              name="name"
              type="text"
              requirements={validationRules.name}
              register={register}
              displayMaxLength={true}
              error={errors.name}
              defaultText={userData?.user_display_name}
            />
            <StandardInput
              label="Bio"
              name="bio"
              type="text"
              requirements={editProfilePopupValidation.bio}
              register={register}
              displayMaxLength={true}
              error={errors.bio}
              isTextArea={true}
              textAreaLines={5}
              defaultText={userData?.bio}
            />
            <StandardInput
              label="Location"
              name="location"
              type="text"
              requirements={editProfilePopupValidation.location}
              register={register}
              displayMaxLength={true}
              error={errors.location}
              defaultText={userData?.location}
            />
            <StandardInput
              label="Website"
              name="website"
              type="url"
              requirements={editProfilePopupValidation.website}
              register={register}
              displayMaxLength={true}
              error={errors.website}
              defaultText={userData?.link}
            />
          </>
        )}
      </form>
    </div>
  );
};

export default EditProfilePopup;
