import React from "react";
import { Link } from 'react-router-dom';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import useAuth from "../useAuth";
import { WelcomeImage } from "../assets";
// import backgroundImage from '../path_to_your_image/artistic_background.jpg'; // Update this path to your image file

const Welcome = () => {
    const auth = useAuth();

    const welcomeCard = (linkTo, buttonText) => (
        <Card className="text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}> {/* Semi-transparent background for readability */}
            <Card.Body>
                <Card.Title>Welcome Page</Card.Title>
                <Card.Text>
                    {auth?.isLoggedIn ? "Go to home if logged in." : "Gives option to login/signup otherwise"}
                </Card.Text>
                <Button as={Link} to={linkTo} variant="primary">
                    {buttonText}
                </Button>
            </Card.Body>
        </Card>
    );

    return (
        <div style={{ 
            backgroundImage: `url(${WelcomeImage})`,
            backgroundSize: 'cover',
            height: '100vh',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Container>
                <Row className="justify-content-md-center">
                    <Col md={12} className="text-center">
                        <h2>Welcome to CanvasCove!</h2>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Welcome;
