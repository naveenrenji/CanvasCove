import React, { useState } from "react";
import { Form, Button, Card } from 'react-bootstrap';


const Login = () => {
    // Fields - username, firstname, lastname, email, password, confirmPassword, dob, gender
    const [email, setEmail] = useState({
        value: "",
        error: ""
    });
    const [password, setPassword] = useState({
        value: "",
        error: ""
    });

    const handleSubmit = async () => {
        // TODO - validate form and proceed
    }

    return (
    <Card className="signup-form">
        <h2 className="signup-header">Login</h2>
        <Form>
        <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Email</Form.Label>
            <Form.Control
                type="text"
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

        <Button
            variant="primary"
            type="submit"
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