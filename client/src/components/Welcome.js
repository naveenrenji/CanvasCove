import React from "react";
import { Container, Row, Col } from 'react-bootstrap';
import { WelcomeImage } from "../assets";

const Welcome = () => {
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
                        <h2>Welcome to <span style={{ fontFamily: "playfair-italic" }}>CanvasCove</span>!</h2>
                        <span>A dynamic hub connecting art enthusiasts with creators,</span><br />
                        <span>offering a vibrant platform to explore art, artist bios,</span><br />
                        <span>portfolios, and stay updated with the</span><br />
                        <span>latest in the art world.</span>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Welcome;
