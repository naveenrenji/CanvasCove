import React, { useState } from "react";
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";

import { authAPI } from "../api";
import useAuth from "../useAuth";


const Login = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();

    const handleSubmit = async (e) => {
        // TODO - validate form and proceed
        e.preventDefault()
        e.stopPropagation();
        if (!email || !password) {
            setError("Email and password is required to sign in");
        }
        try {
            const res = await authAPI.login(
                email.trim(),
                password.trim()
            );
            await auth.signIn(res?.accesstoken, () => {
                navigate("/home", {
                  replace: true,
                });
            });
        } catch (error) {
            setError(
                error?.response?.data?.error ||
                error?.message ||
                "Error occurred while signing in. Please try again."
            );
        };

    };

    return (
    <Card className="signup-form">
        <h2 className="signup-header">Login</h2>
        <Form>
        <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Email</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter email"
                value={email}
                onChange={(e) => {
                    setEmail(e?.target?.value)
                }}
                // isInvalid={!!email}
            />
            {/* <Form.Control.Feedback type="invalid">
                Email is required
            </Form.Control.Feedback> */}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                    setPassword(e?.target?.value)
                }}
                // isInvalid={!!password}
            />
            {/* <Form.Control.Feedback type="invalid">
                {password ? "" : "Password is required"}
            </Form.Control.Feedback> */}
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
            disabled={!email || !password}
            style={{ width: '100%' }}
            onClick={handleSubmit}
        >
            Login
        </Button>
        </Form>
    </Card>
    );
};

export default Login;