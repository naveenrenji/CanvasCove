import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { GENDERS } from "../constants";
import { updateUserApi } from "../api/user"; // Your API call
import useAuth from "../useAuth"; // Your auth hook
import { validateName, validatePassword, validateConfirmPassword } from "../helpers"; // Import validation functions

const UpdateUser = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        gender: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState(''); // Separate state for form-wide errors
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Assuming useAuth provides currentUser

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Validate the field on change
        let error = '';
        switch (name) {
            case 'firstName':
            case 'lastName':
                error = validateName(name, value);
                break;
            case 'newPassword':
                error = validatePassword(value);
                break;
            case 'confirmNewPassword':
                error = validateConfirmPassword(value, formData.newPassword);
                break;
            default:
                break;
        }
        setErrors({ ...errors, [name]: error });
    };

    const isFormValid = () => {
        return Object.values(errors).every(error => error === "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            setFormError("Please fill out all fields correctly."); // Update form-wide error
            return;
        }
        try {
            await updateUserApi(currentUser._id, formData);
            alert('Updated Successfully');
            navigate('/profile'); // Redirect to profile or another page
        } catch (error) {
            setFormError(error.message || "An error occurred while updating the profile."); // Update form-wide error
        }
    };

    return (
        <Card className="update-form">
            <h2 className="update-header">Update Profile</h2>
            <Form onSubmit={handleSubmit}>
                {/* Form fields for firstName, lastName, bio, gender */}
                {/* ... */}
                {/* Example: Field for firstName */}
                <Form.Group className="mb-3 form-group" controlId="formFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        isInvalid={!!errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                        {errors.firstName}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Repeat similar structure for lastName, bio, and other fields */}
                {/* ... */}

                <Button
                    type="submit"
                    variant="primary"
                    disabled={!isFormValid()}
                    style={{ width: '100%' }}
                >
                    Update Profile
                </Button>
            </Form>
        </Card>
    );
};

export default UpdateUser;
