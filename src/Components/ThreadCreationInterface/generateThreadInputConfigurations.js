export const generateInputConfigurations = (id) => ({
    text: {
      name: `thread-item-${id}-text`,
      requirements: {
        required: 'Please enter some text!',
        maxLength: {
          value: 400,
          message: 'Thread post or reply cannot exceed 400 characters!'
        }
      }
    },
    file: {
      name: `thread-item-${id}-image`,
      requirements: {
        validate: {
          type: (file) => (
            // If a file has been uploaded, make sure it is the right file type
            !file?.[0] || ["image/jpeg", "image/png"].includes(file?.[0]?.type) || "Only JPEG and PNG files are allowed"
          ),
          size: (file) => (
            // If a file has been uploaded, make sure it does not exceed 5 megabytes
            !file?.[0] || file?.[0]?.size < 5000000 || "Please upload a file smaller than 5MB!"
          )
        }
      }
    }
  });