import React from "react";
import { artAPI } from "../api";
import { useNavigate, useParams } from "react-router";
import { Alert, Container, Row } from "react-bootstrap";
import { ArtForm, Loader } from "./common";

const EditArt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [art, setArt] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const getArt = React.useCallback(async () => {
    try {
      setLoading(true);
      const artRes = await artAPI.getArtApi(id, true);
      setArt(artRes);
    } catch (error) {
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  React.useEffect(() => {
    getArt();
  }, [getArt]);

  return (
    <Container fluid="md">
      {loading ? <Loader /> : null}
      {error ? (
        <Row>
          <Alert variant="danger">
            <Alert.Heading>Could not load this art!</Alert.Heading>
            <hr />
            <p>{error}</p>
          </Alert>
        </Row>
      ) : art ? (
        <ArtForm
          art={art}
          onSuccess={() => {
            navigate(-1);
          }}
        />
      ) : null}
    </Container>
  );
};

export default EditArt;
