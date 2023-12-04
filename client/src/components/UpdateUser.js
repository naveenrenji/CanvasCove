import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { GENDERS } from "../constants";
import { updateUserApi } from "../api/user"; // Your API call
import useAuth from "../useAuth"; // Your auth hook

const UpdateUser = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        bio: '',
        gender: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '' // Used for frontend validation only
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Assuming useAuth provides currentUser

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isFormValid = () => {
        // Add your validation logic here
        return true; // Replace with actual validation
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            setError("Please fill out all fields correctly.");
            return;
        }
        try {
            const updatedUser = await updateUserApi(currentUser._id, formData);
            // Handle success (e.g., show a message, redirect, etc.)
            navigate('/profile'); // Redirect to profile page or wherever appropriate
        } catch (error) {
            setError(error.message || "An error occurred while updating the profile.");
        }
    };

    return (
        <Card className="update-form">
            <h2 className="update-header">Update Profile</h2>
            <Form
                onChange={() => setError()}
            >
                {/* Similar form group structure as in Signup for firstName, lastName, and bio */}
                {/* ... */}

                <Form.Group className="mb-3 form-group" controlId="formGenderSelect">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                        as="select"
                        value={gender.value}
                        onChange={handleChange}
                        isInvalid={!!gender.error}
                    >
                        <option value="">Select gender...</option>
                        {Object.values(GENDERS).map((gender) => (
                            <option value={gender} key={gender}>
                                {gender}
                            </option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                        {gender.error}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Fields for current password, new password, and confirm new password */}
                <Form.Group className="mb-3 form-group" controlId="formCurrentPassword">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword.value}
                        onChange={handleChange}
                        isInvalid={!!currentPassword.error}
                    />
                    <Form.Control.Feedback type="invalid">
                        {currentPassword.error}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 form-group" controlId="formNewPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="New Password"
                        value={newPassword.value}
                        onChange={handleChange}
                        isInvalid={!!newPassword.error}
                    />
                    <Form.Control.Feedback type="invalid">
                        {newPassword.error}
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 form-group" controlId="formConfirmNewPassword">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmNewPassword.value}
                        onChange={handleChange}
                        isInvalid={!!confirmNewPassword.error}
                    />
                    <Form.Control.Feedback type="invalid">
                        {confirmNewPassword.error}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Error Alert */}
                {error && <Alert variant="danger">{error}</Alert>}

                <Button
                    type="submit"
                    variant="primary"
                    disabled={isFormInvalid()}
                    onClick={handleSubmit}
                    style={{ width: '100%' }}
                >
                    Update Profile
                </Button>
            </Form>
        </Card>
    );
};

export default UpdateUser;
