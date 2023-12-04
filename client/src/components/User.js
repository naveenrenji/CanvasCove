import React from "react";
import { ArtTabs, UserProfile } from "./common";
import { Container } from "react-bootstrap";

const User = () => {
  return (
    <Container fluid="md">
      <UserProfile user={{}} />
      <Container>
        <ArtTabs user={{}} />
      </Container>
    </Container>
  );
};

export default User;
