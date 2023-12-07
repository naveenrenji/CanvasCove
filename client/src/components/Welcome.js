import React from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import { WelcomeImage } from "../assets";
import useAuth from "../useAuth";
import { Link } from "react-router-dom";
import { Icon } from "./common";

const Welcome = () => {
    const auth = useAuth();

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
                        <div>
                            <h2>Welcome to <span style={{ fontFamily: "playfair-italic" }}>CanvasCove</span>!</h2>
                            <span>A dynamic hub connecting art enthusiasts with creators,</span><br />
                            <span>offering a vibrant platform to explore art, artist bios,</span><br />
                            <span>portfolios, and stay updated with the</span><br />
                            <span>latest in the art world.</span>
                        </div>
                        
                        <Button
                            variant="primary"
                            size="lg"
                            className="mt-4"
                            as={Link}
                            to={auth?.isLoggedIn ? "/home" : "/login"}
                        >
                            Get Started
                            &nbsp;
                            <Icon icon="arrow-right" color="white" />
                        </Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Welcome;
