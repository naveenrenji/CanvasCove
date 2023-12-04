import React from "react";
import { Container } from "react-bootstrap";

import useAuth from "../useAuth";
import { ArtTabs } from "./common";

const ArtList = () => {
  const auth = useAuth();

  return (
    <Container fluid="md">
      <ArtTabs user={auth?.user} />
    </Container>
  );
};

export default ArtList;
