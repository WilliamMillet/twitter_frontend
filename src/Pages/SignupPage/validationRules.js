const validationRules = {
    name: {
        required: "Please enter your name",
        maxLength: {
            value: 50,
            message: "Name cannot be longer than 50 characters",
        },
    },
    phone: {
        required: "Please enter a phone number",
        maxLength: {
            value: 200,
            message: "Phone number cannot be longer than 200 characters",
        },
    },
    email: {
        required: "Please enter your email",
        maxLength: {
            value: 200,
            message: "Email cannot be longer than 200 characters",
        },
    },
    password: {
        required: "Please enter a password",
        maxLength: {
            value: 50,
            message: "Password cannot be longer than 50 characters",
        },
        minLength: {
            value: 8,
            message: "Password must be at least 8 characters long",
        },
        validate: {
            hasUpperCase: (value) => 
                /[A-Z]/.test(value) || "Password must contain an uppercase letter",
            hasNumber: (value) => 
                /[0-9]/.test(value) || "Password must contain a number",
            hasSpecialChar: (value) => 
                /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Password must contain one of the following special characters: !@#$%^&*(),.?\":{}|<>"
        }
    },
    profile: {
        required: 'Please upload a file',
        validate: {
            acceptedFormats: files => 
            ['image/jpeg', 'image/png'].includes(files[0]?.type)
        }
    }
};

export default validationRules;