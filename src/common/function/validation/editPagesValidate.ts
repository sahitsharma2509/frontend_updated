interface IValues {
    avatar: string | null;
    firstName: string;
    lastName: string;
    displayName: string;
    emailAddress: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface IErrorMessages {
    avatar?: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    emailAddress?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

const validate = (values: IValues): IErrorMessages => {
    const errors: IErrorMessages = {};

    // Validation for avatar
    if (typeof values.avatar === 'string') {
		const validImageTypes = ['jpg', 'jpeg', 'png'];
		const extension = values.avatar.split('.').pop()?.toLowerCase() || '';
		if (!validImageTypes.includes(extension)) {
			errors.avatar = 'File must be a .jpg, .jpeg or .png';
		}
	} else {
		errors.avatar = 'Avatar is required';
	}
	

    // Validation for firstName
    if (!values.firstName) {
        errors.firstName = 'First name is required';
    } else if (values.firstName.length < 2) {
        errors.firstName = 'First name should be at least 2 characters';
    }

    // Add more validation checks as needed...

    return errors;
};

export default validate;



