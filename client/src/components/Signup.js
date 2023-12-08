import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./styles.css";
import { GENDERS, USER_ROLES, AGE_DATE_RANGE, USER_ROLES_DISPLAY } from "../constants";
import { 
    formatDate,
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    setToStorage,
    clearFromStorage
} from "../helpers";
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { authAPI, userApi } from "../api";
import useAuth from "../useAuth";
import { ImageModal, UserImage } from "./common";


const Signup = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    // Fields - username, firstname, lastname, email, password, confirmPassword, dob, gender
    const [displayName, setDisplayName] = useState({
        value: "",
        error: ""
    });
    const [firstName, setFirstName] = useState({
        value: "",
        error: ""
    });
    const [lastName, setLastName] = useState({
        value: "",
        error: ""
    });
    const [email, setEmail] = useState({
        value: "",
        error: ""
    });
    const [bio, setBio] = useState({
        value: "",
        error: ""
    });
    const [password, setPassword] = useState({
        value: "",
        error: ""
    });
    const [confirmPassword, setConfirmPassword] = useState({
        value: "",
        error: ""
    });
    const [dob, setDob] = useState({
        value: "",
        error: ""
    });
    const [gender, setGender] = useState({
        value: "",
        error: ""
    });
    const [role, setRole] = useState({
        value: USER_ROLES.CONNOISSEUR,
        error: ""
    });
    const [error, setError] = useState();
    const [images, setImages] = useState([]);
    const [showImagesModal, setShowImagesModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleToggleImagesModal = () => setShowImagesModal((prev) => !prev);

    const isFormInvalid = () => {
        if (!displayName.value || !firstName.value || !lastName.value ||
            !email.value || !password.value || !confirmPassword.value ||
            !dob.value || !gender.value || !role.value) {
                return true
        }
        return !!displayName.error || !!firstName.error || !!lastName.error
            || !!email.error || !!password.error || !!confirmPassword.error
            || !!dob.error || !!gender.error || !!role.error;
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation();
        if (isFormInvalid()) {
            setError("Make sure you have filled all fields without any errors")
            return;
        }
        setError();

        try {
            setLoading(true);
            const res = await authAPI.signUp(
                displayName.value.trim(),
                firstName.value.trim(),
                lastName.value.trim(),
                email.value.trim().toLowerCase(),
                dob.value,
                role.value,
                bio.value.trim(),
                gender.value,
                password.value,
            );
            
            const imagesToAdd = images
                .filter(({ _id, shouldDelete }) => !_id && !shouldDelete)
                .map((image) => image.file);

            const imagesToAddCount = imagesToAdd.length;
            if (imagesToAddCount > 0) {
                try {
                    setToStorage(process.env.REACT_APP_USER_ACCESS_TOKEN_KEY, res.accesstoken);
                    await userApi.uploadImageApi(res._id, imagesToAdd[0]);
                } catch (e) {
                    clearFromStorage(process.env.REACT_APP_USER_ACCESS_TOKEN_KEY)
                    throw e
                }
            }

            await auth.signIn(res?.accesstoken, async () => {
                setLoading(false);
                navigate("/home", {
                  replace: true,
                });
            });
        } catch (error) {
            setLoading(false);
            setError(
                error?.response?.data?.error ||
                error?.message ||
                "Error occurred while creating user. Please try again."
            );
        };
    };

    return (
    <Card className="signup-form">
        <h2 className="signup-header">Sign Up</h2>
        <div className="d-flex justify-content-center mb-3">
            {showImagesModal && (
                <ImageModal
                    show={showImagesModal}
                    onClose={handleToggleImagesModal}
                    images={images}
                    imageableType="User"
                    editable
                    onUpdate={(updatedImages) => {
                        setImages(updatedImages);
                        handleToggleImagesModal();
                    }}
                />
            )}
            <UserImage
                canUpload
                images={images}
                user={{ displayName: displayName?.value }}
                onClick={handleToggleImagesModal}
            />
        </div>
        <Form
            onChange={() => setError()}
        >
        <Form.Group className="mb-3 form-group" controlId="formBasicUsername">
            <Form.Label>Display Name*</Form.Label>
            <Form.Control
                required
                type="text"
                placeholder="Enter display name"
                value={displayName.value}
                onChange={(e) => {
                    const value = e?.target?.value
                    setDisplayName({
                        error: validateName("Display name", value),
                        value
                    });
                }}
                isInvalid={!!displayName.error}
            />
            <Form.Control.Feedback type="invalid">
                {displayName.error}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3 form-group" controlId="formBasicUsername">
            <Form.Label>First Name*</Form.Label>
            <Form.Control
                required
                type="text"
                placeholder="Enter first name"
                value={firstName.value}
                onChange={(e) => {
                    const value = e?.target?.value
                    setFirstName({
                        error: validateName("First name", value),
                        value
                    });
                }}
                isInvalid={!!firstName.error}
            />
            <Form.Control.Feedback type="invalid">
                {firstName.error}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3 form-group" controlId="formBasicUsername">
            <Form.Label>Last Name*</Form.Label>
            <Form.Control
                required
                type="text"
                placeholder="Enter last name"
                value={lastName.value}
                onChange={(e) => {
                    const value = e?.target?.value
                    setLastName({
                        error: validateName("Last name", value),
                        value
                    });
                }}
                isInvalid={!!lastName.error}
            />
            <Form.Control.Feedback type="invalid">
                {lastName.error}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3 form-group" controlId="formBasicEmail">
            <Form.Label>Email address*</Form.Label>
            <Form.Control
                required
                type="email"
                placeholder="Enter email"
                value={email.value}
                onChange={(e) => {
                    const value = e?.target?.value
                    setEmail({
                        error: validateEmail(value),
                        value
                    });
                }}
                isInvalid={!!email.error}
            />
            <Form.Control.Feedback type="invalid">
                {email.error}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3 form-group" controlId="formGenderSelect">
            <Form.Label>Gender*</Form.Label>
            <Form.Control
                required
                as="select"
                value={gender.value}
                onChange={(e) => {
                    const value = e?.target?.value
                    setGender({
                        error: value ? "" : "Gender is required",
                        value
                    });
                }}
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

        <Form.Group className="mb-3 form-group" controlId="formGenderSelect">
            <Form.Label>Date of Birth*</Form.Label>
            <Form.Control
                required
                type="date"
                value={dob.value}
                onChange={(e) => {
                    const value = e?.target?.value
                    setDob({
                        error: value ? "" : "Date of birth is required",
                        value
                    });
                }}
                min={formatDate(AGE_DATE_RANGE.MIN)}
                max={formatDate(AGE_DATE_RANGE.MAX)}
                isInvalid={!!dob.error}
            >
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                {dob.error}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3 form-group" controlId="formRoleSelect">
            <Form.Label>Role*</Form.Label>
            <Form.Control
                required
                as="select"
                value={role.value}
                onChange={(e) => {
                    const value = e?.target?.value
                    setRole({
                        error: value ? "" : "Role is required",
                        value
                    });
                }}
                isInvalid={!!role.error}
            >
                <option value="">Select role...</option>
                {Object.entries(USER_ROLES_DISPLAY).map(([value, display]) => (
                  <option value={value} key={value}>
                    {display}
                  </option>
                ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                {gender.error}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3 form-group" controlId="formBasicBio">
            <Form.Label>Bio</Form.Label>
            <Form.Control
                as="textarea"
                placeholder="Tell us something about yourself..."
                value={bio.value}
                onChange={(e) => {
                    const value = e?.target?.value
                    setBio({
                        error: "",
                        value
                    });
                }}
                isInvalid={!!bio.error}
            />
            <Form.Control.Feedback type="invalid">
                {bio.error}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3 form-group" controlId="formBasicPassword">
            <Form.Label>Password*</Form.Label>
            <Form.Control
                required
                type="password"
                placeholder="Password"
                value={password.value}
                onChange={(e) => {
                    const value = e?.target?.value;
                    setPassword({
                        error: validatePassword(value),
                        value
                    });
                }}
                isInvalid={!!password.error}
            />
            <Form.Control.Feedback type="invalid">
                {password.error}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3 form-group" controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password*</Form.Label>
            <Form.Control
                required
                type="password"
                placeholder="Confirm password"
                value={confirmPassword.value}
                onChange={(e) => {
                    const value = e?.target?.value
                    setConfirmPassword({
                        error: validateConfirmPassword(value, password.value),
                        value,
                    });
                }}
                isInvalid={!!confirmPassword.error}
            />
            <Form.Control.Feedback type="invalid">
                {confirmPassword.error}
            </Form.Control.Feedback>
        </Form.Group>

        {
            error ? (
                <Alert variant="danger">
                {error}
              </Alert>
            ) : null
        }

        <Button
            type="submit"
            variant="primary"
            disabled={isFormInvalid() || loading}
            onClick={handleSubmit}
            style={{ width: '100%' }}
        >
            {loading ? (
                <Spinner animation="border" role="status" size="sm">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            ) : (
                ""
            )}
            Sign Me Up
        </Button>
        <Button
            variant="link"
            onClick={() => navigate("/login")}
            style={{ width: '100%' }}
            className="mt-3"
        >
            Already have an account? Login
        </Button>
    </Form>
</Card>
)};

export default Signup;