import React, { useState } from "react";
import "./styles.css";
import { GENDERS, AGE_DATE_RANGE } from "../constants";
import { 
    formatDate,
    validateName,
    validateEmail,
    validatePassword,
    validateConfirmPassword
} from "../helpers";
import { Form, Button, Card, Alert } from 'react-bootstrap';


const Signup = () => {
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
    const isFormInvalid = () => {
        return !!displayName.error || !!firstName.error || !!lastName.error
            || !!email.error || !!password.error || !!confirmPassword.error || !!dob.error || !!gender.error;
    };
    const [error, setError] = useState()

    const handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation();
        if (isFormInvalid) {
            setError("Make sure you have filled all fields without any errors")
        } else {
            setError();
            alert("Good to go!")
        }
    }
    return (
    <Card className="signup-form">
        <h2 className="signup-header">Sign Up</h2>
        <Form
            onChange={() => setError()}
        >
        <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Display Name</Form.Label>
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

        <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>First Name</Form.Label>
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

        <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Last Name</Form.Label>
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

        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
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

        <Form.Group className="mb-3" controlId="formGenderSelect">
            <Form.Label>Gender</Form.Label>
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
                <option value="">Select...</option>
                {Object.entries(GENDERS).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
                {gender.error}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formGenderSelect">
            <Form.Label>Date of Birth</Form.Label>
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

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
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

        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
                required
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword.value}
                onChange={(e) => {
                    const value = e?.target?.value
                    setConfirmPassword({
                        error: validateConfirmPassword(value, password),
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
            disabled={isFormInvalid()}
            onClick={handleSubmit}
            style={{ width: '100%' }}
        >
            Sign Me Up
        </Button>
    </Form>
</Card>
)};

export default Signup;