const getProfileLinkOrPlaceholder = (awsUrlEnd) => {
    return awsUrlEnd
    ? "https://the-bucket-of-william-millet.s3.ap-southeast-2.amazonaws.com/" +
    awsUrlEnd
    : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
}

export default getProfileLinkOrPlaceholder