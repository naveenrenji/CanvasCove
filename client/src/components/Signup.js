import React, { useState } from "react";
import "./styles.css";
import { GENDERS } from "../constants";
import { Form, Button, Card } from 'react-bootstrap';


const Signup = () => {
    // Fields - username, firstname, lastname, email, password, confirmPassword, dob, gender
    const [userName, setUserName] = useState({
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

    const handleSubmit = async () => {
        // TODO - validate form and proceed
    }
    return (
    <Card className="signup-form">
        <h2 className="signup-header">Sign Up</h2>
        <Form>
        <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter username"
                value={userName.value}
                onChange={(e) => {
                    setUserName({
                        error: e?.target?.value ? "" : "Username is required",
                        value: e?.target?.value || ""
                    })
                }}
                isInvalid={!!userName.error}
            />
            <Form.Control.Feedback type="invalid">
                {userName.error}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>First Name</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter username"
                value={firstName.value}
                onChange={(e) => {
                    setFirstName({
                        error: e?.target?.value ? "" : "First name is required",
                        value: e?.target?.value || ""
                    })
                }}
                isInvalid={!!userName.error}
            />
            <Form.Control.Feedback type="invalid">
                {firstName.error}
            </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter username"
                value={lastName.value}
                onChange={(e) => {
                    setLastName({
                        error: e?.target?.value ? "" : "Last name is required",
                        value: e?.target?.value || ""
                    })
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
                type="email"
                placeholder="Enter email"
                value={email.value}
                onChange={(e) => {
                    setEmail({
                        error: e?.target?.value ? "" : "Email is required",
                        value: e?.target?.value || ""
                    })
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
                as="select"
                value={gender.value}
                onChange={(e) => {
                    setGender({
                        error: e?.target?.value ? "" : "Gender is required",
                        value: e?.target?.value || ""
                    })
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
                type="date"
                value={dob.value}
                onChange={(e) => {
                    setDob({
                        error: e?.target?.value ? "" : "Date of birth is required",
                        value: e?.target?.value || ""
                    })
                }}
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
                type="password"
                placeholder="Password"
                value={password.value}
                onChange={(e) => {
                    setPassword({
                        error: e?.target?.value ? "" : "Password is required",
                        value: e?.target?.value || ""
                    })
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
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword.value}
                onChange={(e) => {
                    setConfirmPassword({
                        error: e?.target?.value ? "" : "Password needs to be confirmed",
                        value: e?.target?.value || ""
                    })
                }}
                isInvalid={!!confirmPassword.error}
            />
            <Form.Control.Feedback type="invalid">
                {confirmPassword.error}
            </Form.Control.Feedback>
        </Form.Group>

        <Button
            variant="primary"
            type="submit"
            style={{ width: '100%' }}
            onClick={handleSubmit}
        >
            Sign Me Up
        </Button>
        </Form>
    </Card>
    );
};

export default Signup;