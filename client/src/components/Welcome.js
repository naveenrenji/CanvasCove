import React from "react";

import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import useAuth from "../useAuth";



const Welcome = () => {
    const auth = useAuth();
    
    if (auth?.isLoggedIn) {
        return (
            <div>
                Welcome page - goes to home if logged in. Gives option to login/signup otherwise
                <div />
                <Button as={Link} to="/home" variant="primary">
                    Go to home page
                </Button>
            </div>
        )
    }
    return (
        <div>
            Welcome page - goes to home if logged in. Gives option to login/signup otherwise
            <div />
            <Button as={Link} to="/sign-up" variant="primary">
                Go to sign up page
            </Button>
            <div />
            <Button as={Link} to="/login" variant="primary">
                Go to login page
            </Button>
        </div>
    )
};

export default Welcome;
