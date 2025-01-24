const editProfilePopupValidation = {
    bio: {
        required: false,
        maxLength: {
            value: 160,
            message: 'Bio cannot be longer than 160 characters'
        },
        pattern: {
            value: /^[a-zA-Z0-9\s]*$/,
            message: 'Bio can only contain letters, numbers, and spaces'
        }
    },
    location: {
        required: false,
        maxLength: {
            value: 30,
            message: 'Location cannot be longer than 30 characters'
        }
    },
    website: {
        required: false,
        maxLength: {
            value: 100,
            message: 'Website link cannot be longer than 100 characters'
        }
    },
    images: {
        required: false,
        validate: {
            acceptedFormats: files => 
            ['image/jpeg', 'image/png'].includes(files[0]?.type)
        }
    }
}

export default editProfilePopupValidation
