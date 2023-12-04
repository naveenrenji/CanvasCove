import React from 'react';
import { Button, Card, Container, Row, Col, Image } from 'react-bootstrap';

const UserProfile = ({ user }) => {
    // Artist mock data
    const artist = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        displayName: "John Doe",
        dateOfBirth: "1990-01-01",
        followersCount: 100,
        profilePicture: "https://source.unsplash.com/featured/?portrait,colorful",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies aliquam, quam libero ultricies nunc, vitae ultricies nisl",
    };

    // const sectionStyle = {
    //     padding: '20px',
    //     backgroundColor: '#f8f9fa',
    //     borderRadius: '10px',
    //     margin: '20px 0'
    // };

    // return (
    //     <Container className="mt-5">
    //         <Row>
    //             <Col md={12} className="text-center">
    //                 <Image src={artist.profilePicture} alt={artist.displayName} roundedCircle fluid style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
    //                 <div style={sectionStyle}>
    //                     <h2>{artist.displayName}</h2>
    //                     <p><strong>Name:</strong> {artist.firstName} {artist.lastName}</p>
    //                     <p><strong>Date of Birth:</strong> {artist.dateOfBirth}</p>
    //                     <p><strong>Followers:</strong> {artist.followersCount}</p>
    //                     <p>{artist.bio}</p>
    //                     <Button variant="primary">Follow</Button>
    //                 </div>
    //             </Col>
    //         </Row>
    //     </Container>
    // );

    // STYLE 3
    // return (
    //     <Container className="mt-5">
    //         <Row className="justify-content-center">
    //             <Col md={8}>
    //                 <div className="text-center">
    //                     <Image src={artist.profilePicture} alt={artist.displayName} roundedCircle fluid style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
    //                 </div>
    //                 <div className="text-center mt-4">
    //                     <h2>{artist.displayName}</h2>
    //                     <p><strong>Name:</strong> {artist.firstName} {artist.lastName}</p>
    //                     <p><strong>Date of Birth:</strong> {artist.dateOfBirth}</p>
    //                     <p><strong>Followers:</strong> {artist.followersCount}</p>
    //                     <p>{artist.bio}</p>
    //                     <Button variant="primary">Follow</Button>
    //                 </div>
    //             </Col>
    //         </Row>
    //     </Container>
    // );

    // STYLE 2
    // const backgroundStyle = {
    //     backgroundImage: `url(${artist.profilePicture})`,
    //     backgroundSize: 'cover',
    //     backgroundPosition: 'center',
    //     minHeight: '80vh', // full viewport height
    //     color: 'white'
    // };

    // return (
    //     <div style={backgroundStyle}>
    //         <Container className="h-100">
    //             <Row className="align-items-center h-100">
    //                 <Col md={6} className="mx-auto">
    //                     <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '20px', borderRadius: '15px' }}>
    //                         <h2>{artist.displayName}</h2>
    //                         <p><strong>Name:</strong> {artist.firstName} {artist.lastName}</p>
    //                         <p><strong>Date of Birth:</strong> {artist.dateOfBirth}</p>
    //                         <p><strong>Followers:</strong> {artist.followersCount}</p>
    //                         <p>{artist.bio}</p>
    //                         <Button variant="primary">Follow</Button>
    //                     </div>
    //                 </Col>
    //             </Row>
    //         </Container>
    //     </div>
    // );

    // STYLE 1
    return (
        <Container className="mt-5">
            <Card>
                <Card.Body>
                    <Row>
                        <Col md={4} className="text-center">
                        <Image src={artist.profilePicture} alt={artist.displayName} roundedCircle fluid style={{ width: '250px', height: '250px', objectFit: 'cover' }} />
                        </Col>
                        <Col md={8}>
                            <h2>{artist.displayName}</h2>
                            <p><strong>Name:</strong> {artist.firstName} {artist.lastName}</p>
                            <p><strong>Date of Birth:</strong> {artist.dateOfBirth}</p>
                            <p><strong>Followers:</strong> {artist.followersCount}</p>
                            <p>{artist.bio}</p>
                            <Button variant="primary">Follow</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default UserProfile;
