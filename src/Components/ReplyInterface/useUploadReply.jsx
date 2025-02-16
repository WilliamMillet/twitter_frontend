import useFetchData from "../../hooks/useFetchData";

const useUploadReply = () => {
  // Correctly call Hooks at the top level
  const uploadReplyText = useFetchData();
  const generateReplyPresignedUrl = useFetchData();
  const replyAwsUpload = useFetchData(); // Renamed variable
  const sendReplyImageMetadata = useFetchData();

  const aggregatedErrors = [
    uploadReplyText.error,
    generateReplyPresignedUrl.error,
    replyAwsUpload.error, // Fixed variable name
    sendReplyImageMetadata.error,
  ].filter(Boolean); // Simplified filter

  const handleUploadReply = (
    replyText,
    replyImage,
    parentPostId,
    parentReplyId = null,
    isPartOfThread = false
  ) => {
    uploadReplyText.fetchData(
      `${process.env.REACT_APP_SERVER_URL}/api/replies/text`,
      "POST",
      { includeAuth: true },
      {
        replyText,
        parentPostId,
        parentReplyId,
        isPartOfThread,
      },
      {
        onSuccess: (uploadTextData) => {
          const { replyId } = uploadTextData;
          if (replyImage) {
            generateReplyPresignedUrl.fetchData(
              `${process.env.REACT_APP_SERVER_URL}/api/replies/presigned-url`,
              "POST",
              { includeAuth: true },
              { replyId, fileType: replyImage.type },
              {
                onSuccess: (presignedUrlData) => {
                  
                  const { uniqueId } = presignedUrlData

                  replyAwsUpload.fetchData(
                    presignedUrlData.url,
                    "PUT",
                    {  contentType: replyImage.type  },
                    replyImage,
                    {
                      onSuccess: () => {
                        sendReplyImageMetadata.fetchData(
                          `${process.env.REACT_APP_SERVER_URL}/api/replies/${replyId}/image-metadata`,
                          "POST",
                          { includeAuth: true },
                          { uuid: uniqueId },
                          {
                            onSuccess: () => {
                              window.location.reload();
                            },
                          }
                        );
                      },
                    }
                  );
                },
              }
            );
          } else {
            window.location.reload();
          }
        },
      }
    );
  };

  return { handleUploadReply, aggregatedErrors };
};

export default useUploadReply;