const getOwnProfileImageLink = () => {
    const profileSuffix = JSON.parse(localStorage.getItem("profile_link_suffix"));

    return profileSuffix
    ? "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
      profileSuffix
    : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";  
}

export default getOwnProfileImageLink