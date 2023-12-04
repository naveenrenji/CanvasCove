import React from "react";
import { Alert, Container, Row } from "react-bootstrap";
import { useParams } from "react-router";

import { artAPI } from "../api";
import { INTERACTION_TYPES } from "../constants";
import { ArtCard, Loader } from "./common";

const Art = () => {
  const { id } = useParams();
  const [art, setArt] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [alertError, setAlertError] = React.useState(null);

  const getArt = React.useCallback(async () => {
    try {
      setLoading(true);
      await artAPI.interactWithArtApi(id, INTERACTION_TYPES.VIEW);
      const artRes = await artAPI.getArtApi(id);
      setArt(artRes);
    } catch (error) {
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const likeClickHandler = async (art) => {
    try {
      const updatedArt = await artAPI.interactWithArtApi(
        art._id,
        INTERACTION_TYPES.LIKE
      );
      setArt(updatedArt);
    } catch (error) {
      setAlertError(error?.message);
    }
  };

  React.useEffect(() => {
    getArt();
  }, [getArt]);

  return (
    <Container fluid="md" className="d-flex justify-content-center">
      {alertError ? (
        <Row>
          <Alert variant="danger" onClose={() => setAlertError()} dismissible>
            <Alert.Heading>Oops! Can't like this art.</Alert.Heading>
            <hr />
            <p>{alertError}</p>
          </Alert>
        </Row>
      ) : null}
      {error ? (
        <Row>
          <Alert variant="danger">
            <Alert.Heading>Could not load this art!</Alert.Heading>
            <hr />
            <p>{error}</p>
          </Alert>
        </Row>
      ) : loading ? (
        <Loader />
      ) : !!art ? (
        <ArtCard
          art={art}
          onArtChange={setArt}
          onLikeClick={likeClickHandler}
        />
      ) : (
        <></>
      )}
    </Container>
  );
};

export default Art;
