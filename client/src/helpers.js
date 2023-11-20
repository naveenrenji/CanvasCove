import { NAME_LENGTHS } from "./constants";

// TODO - Decide on trimming
export const validateName = (fieldName, fieldValue) => {
    if (!fieldValue) {
        return `${fieldName} is required`
    }
    if (fieldValue.length < NAME_LENGTHS.MIN) {
        return `${fieldName} should be minimum of ${NAME_LENGTHS.MIN} characters`
    }
    if (fieldValue.length > NAME_LENGTHS.MAX) {
        return `${fieldName} should be maximum of ${NAME_LENGTHS.MAX} characters`
    }
    return "";
};

export const validateEmail = (value) => {
    if (!value) {
        return "Email is required"
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return "Invalid email format";
    }
    return "";
};

export const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

export const validatePassword = (value) => {
    if (!value) {
        return "Password is required";
    };
    if (!/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$/.test(value)) {
        return "Min 8 chars password required with at least one of each - uppercase letter, number, and special character";
    };
    return "";
};

export const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) {
        return "Confirm password is required"
    }
    if (confirmPassword !== password) {
        return "Confirm password does not match with password"
    }
    return "";
};
