import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { GENDERS } from "../constants";
import { updateUserApi } from "../api/user"; // Your API call
import useAuth from "../useAuth"; // Your auth hook
import {
  validateName,
  validatePassword,
  validateConfirmPassword,
} from "../helpers"; // Import validation functions

const UpdateUser = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    gender: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState(""); // Separate state for form-wide errors
  const navigate = useNavigate();
  const { currentUser } = useAuth(); // Assuming useAuth provides currentUser

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Validate the field on change
    let error = "";
    switch (name) {
      case "firstName":
      case "lastName":
        error = validateName(name, value);
        break;
      case "newPassword":
        error = validatePassword(value);
        break;
      case "confirmNewPassword":
        error = validateConfirmPassword(value, formData.newPassword);
        break;
      default:
        break;
    }
    setErrors({ ...errors, [name]: error });
  };

  const isFormValid = () => {
    return Object.values(errors).every((error) => error === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setFormError("Please fill out all fields correctly."); // Update form-wide error
      return;
    }
    try {
      await updateUserApi(currentUser._id, formData);
      alert("Updated Successfully");
      navigate("/profile"); // Redirect to profile or another page
    } catch (error) {
      setFormError(
        error.message || "An error occurred while updating the profile."
      ); // Update form-wide error
    }
  };

  return (
    <Card className="mx-auto my-5" style={{ maxWidth: "500px" }}>
      <Card.Body>
        <h2 className="text-center mb-4">Update Profile</h2>
        <Form onSubmit={handleSubmit}>
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

          <Form.Group className="mb-3 form-group" controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              isInvalid={!!errors.lastName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.lastName}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3 form-group" controlId="formBio">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              as="textarea"
              name="bio"
              placeholder="Tell us something about yourself"
              value={formData.bio}
              onChange={handleChange}
              isInvalid={!!errors.bio}
            />
            <Form.Control.Feedback type="invalid">
              {errors.bio}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3 form-group" controlId="formGenderSelect">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              isInvalid={!!errors.gender}
            >
              <option value="">Select gender...</option>
              {Object.values(GENDERS).map((gender) => (
                <option value={gender} key={gender}>
                  {gender}
                </option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.gender}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group
            className="mb-3 form-group"
            controlId="formCurrentPassword"
          >
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={formData.currentPassword}
              onChange={handleChange}
              isInvalid={!!errors.currentPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.currentPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3 form-group" controlId="formNewPassword">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              isInvalid={!!errors.newPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.newPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group
            className="mb-3 form-group"
            controlId="formConfirmNewPassword"
          >
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              isInvalid={!!errors.confirmNewPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmNewPassword}
            </Form.Control.Feedback>
          </Form.Group>

          {formError && <Alert variant="danger">{formError}</Alert>}

          <Button
            type="submit"
            variant="primary"
            disabled={!isFormValid()}
            className="w-100 mt-3"
          >
            Update Profile
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UpdateUser;
