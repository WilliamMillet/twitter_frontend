// const handleUploadThread = (data) => {
//   const uploadPostText = useFetchData();
//   const generatePostPresignedUrl = useFetchData();
//   const postAwsUpload = useFetchData();
//   const sendPostImageMetadata = useFetchData();

//   const aggregatedErrors = [
//     uploadPostText.error,
//     generatePostPresignedUrl.error,
//     postAwsUpload.error,
//     sendPostImageMetadata.error,
//   ].filter((error) => error !== undefined);

//   const postText = data["thread-item-1-text"];
//   const postImage = data["thread-item-1-image"];

  

//   const handleThreadCreation = () => {
//     uploadPostText.fetchData(
//       "http://localhost:5000/api/posts/text",
//       "POST",
//       { includeAuth: true },
//       { postText: postText },
//       {
//         onSuccess: (uploadTextData) => {
//           setInput("");
//           const { postId } = uploadTextData;
//           if (postImage) {
//             generatePostPresignedUrl.fetchData(
//               "http://localhost:5000/api/posts/presigned-url-for-upload",
//               "POST",
//               { includeAuth: true },
//               { fileType: postImage.type },
//               {
//                 onSuccess: (presignedUrlData) => {
//                   const { uniqueId, url } = presignedUrlData;
//                   postAwsUpload.fetchData(
//                     url,
//                     "PUT",
//                     { contentType: postImage.type },
//                     postImage,
//                     {
//                       onSuccess: () => {
//                         sendPostImageMetadata.fetchData(
//                           `http://localhost:5000/api/posts/${postId}/image-metadata`,
//                           "POST",
//                           { includeAuth: true },
//                           { uuid: uniqueId },
//                           {
//                             onSuccess: () => {
//                               handleAddAdditionalFetchItems(postId)
//                             },
//                           }
//                         );
//                       },
//                     }
//                   );
//                 },
//               }
//             );
//           }
//         },
//       }
//     );
//   };

//   const handleAddAdditionalFetchItems = (postId) => {

//   }


//   handleThreadCreation();
// };

// export default handleUploadThread;

// // Obseleted logic

// // const handlePost = () => {
// //     uploadPostTextFetchFunction(
// //       "http://localhost:5000/api/posts/text",
// //       "POST",
// //       { includeAuth: true },
// //       { postText: data["thread-item-1-text"] },
// //       {
// //         onSuccess: (uploadTextData) => {
// //           setInput("");
// //           const { postId } = uploadTextData;
// //           if (image) {
// //               handleGeneratePresignedUrlForPostUpload(postid);
// //           }
// //         },
// //       }
// //     );

// //     const handleGeneratePresignedUrlForPostUpload = (postId) => {
// //       generatePresignedUrlFetchFunction(
// //         "http://localhost:5000/api/posts/presigned-url-for-upload",
// //         "POST",
// //         { includeAuth: true },
// //         { fileType: image.type },
// //         {
// //           onSuccess: (presignedUrlData) => {
// //             const { uniqueId, url } = presignedUrlData;
// //             handleUploadPostImage(uniqueId, url);
// //           },
// //         }
// //       );
// //     };

// //     const handleUploadPostImage = (uniqueId, url) => {
// //       awsUploadFetchFunction(url, "PUT", { contentType: image.type }, image, {
// //         onSuccess: () => {
// //           handlePostMetadata();
// //         },
// //       });

// //       postImageMetadataFetchFunction(
// //         `http://localhost:5000/api/posts/${postId}/image-metadata`,
// //         "POST",
// //         { includeAuth: true },
// //         { uuid: uniqueId },
// //         {
// //           onSuccess: () => {
// //             setImage(null);
// //           },
// //         }
// //       );
// //     };
// //    }

// // const {
// //     response: uploadPostTextResponse,
// //     error: uploadPostTextError,
// //     loading: uploadPostTextLoading,
// //     fetchData: uploadPostTextFetchFunction,
// //   } = useFetchData();

// //   const {
// //     response: generatePostPresignedUrlResponse,
// //     error: generatePostPresignedUrlError,
// //     loading: generatePostPresignedUrlLoading,
// //     fetchData: generatePostPresignedUrlFetchFunction,
// //   } = useFetchData();

// //   const {
// //     response: postAwsUploadResponse,
// //     error: postAwsUploadError,
// //     loading: postAwsUploadLoading,
// //     fetchData: postAwsUploadFetchFunction,
// //   } = useFetchData();

// //   const {
// //     response: sendPostImageMetadataResponse,
// //     error: sendPostImageMetadataError,
// //     loading: sendPostImageMetadataLoading,
// //     fetchData: sendPostImageMetadataFetchFunction,
// //   } = useFetchData();

// //   const aggregatedErrors = [
// //     uploadPostTextError,
// //     generatePostPresignedUrlError,
// //     postAwsUploadError,
// //     sendPostImageMetadataError,
// //   ].filter((error) => error !== undefined);
