import React, { useState } from "react";
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

import { authAPI } from "../api";
import useAuth from "../useAuth";

const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    // TODO - validate form and proceed
    e.preventDefault();
    e.stopPropagation();
    if (!email || !password) {
      setError("Email and password is required to sign in");
    }
    try {
      setLoading(true);
      const res = await authAPI.login(email.trim(), password.trim());
      await auth.signIn(res?.accesstoken, () => {
        setLoading(false);
        navigate(from || "/home", {
          replace: true,
        });
      });
    } catch (error) {
      setLoading(false);
      setError(
        error?.response?.data?.error ||
          error?.message ||
          "Error occurred while signing in. Please try again."
      );
    }
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
              setEmail(e?.target?.value);
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
              setPassword(e?.target?.value);
            }}
            // isInvalid={!!password}
          />
          {/* <Form.Control.Feedback type="invalid">
                {password ? "" : "Password is required"}
            </Form.Control.Feedback> */}
        </Form.Group>

        {error ? <Alert variant="danger">{error}</Alert> : null}

        <Button
          type="submit"
          variant="primary"
          disabled={!email || !password || loading}
          style={{ width: "100%" }}
          onClick={handleSubmit}
        >
          {loading ? (
            <Spinner animation="border" role="status" size="sm">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : (
            ""
          )}
          Login
        </Button>
        <Button
          variant="link"
          onClick={() => navigate("/sign-up")}
          style={{ width: "100%" }}
          className="mt-3"
        >
          Don't have an account? Sign up here
        </Button>
      </Form>
    </Card>
  );
};

export default Login;
