import React from "react";
import { Container } from "react-bootstrap";
import { ArtForm } from "./common";
import { useNavigate } from "react-router";

const CreateArt = () => {
  const navigate = useNavigate();

  return (
    <Container fluid="md">
      <ArtForm
        onSuccess={({ _id }) => {
          navigate(`/art/${_id}`);
        }}
      />
    </Container>
  );
};

export default CreateArt;
