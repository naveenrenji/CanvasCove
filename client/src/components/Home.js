import React from "react";
import { ArtCard, ArtCardPlaceholder, IconButton } from "./common";

import { artAPI } from "../api";
import { INTERACTION_TYPES } from "../constants";
import { Alert, Button, Container, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  const [loading, setLoading] = React.useState(true);
  const [feed, setFeed] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [alertError, setAlertError] = React.useState(null);
  const [page, setPage] = React.useState(1);

  const getFeed = React.useCallback(async () => {
    try {
      setLoading(true);
      const feedRes = await artAPI.getFeedApi(page);
      setFeed(feedRes);
    } catch (error) {
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  }, [page]);

  React.useEffect(() => {
    getFeed();
  }, [getFeed]);

  const handleLikeClick = async (art) => {
    try {
      const updatedArt = await artAPI.interactWithArtApi(
        art._id,
        INTERACTION_TYPES.LIKE
      );
      setFeed((prevFeed) => {
        const updatedFeed = prevFeed.map((art) => {
          if (art._id === updatedArt._id) {
            return updatedArt;
          }
          return art;
        });
        return updatedFeed;
      });
    } catch (error) {
      setAlertError(error?.message);
    }
  };

  const onPageChange = async (newPage) => {
    try {
      const pageChangePromises = feed
        .map((art) =>
          !art.currentUserInteractions.length
            ? artAPI.interactWithArtApi(art._id, INTERACTION_TYPES.VIEW)
            : null
        )
        .filter((i) => !!i);

      if (pageChangePromises.length) {
        setLoading(true);
        await Promise.all(pageChangePromises);
      }
      setPage(newPage);
    } catch (error) {
      setLoading(false);
      setAlertError(error?.message);
    }
  };

  const handleNextClick = () => onPageChange(page + 1);
  const handlePrevClick = () => onPageChange(page - 1);
  const handleArtChange = (updatedArt) => {
    setFeed((prevFeed) => {
      const updatedFeed = prevFeed.map((art) => {
        if (art._id === updatedArt._id) {
          return updatedArt;
        }
        return art;
      });
      return updatedFeed;
    });
  };

  return (
    <>
      {error ? (
        <Alert variant="danger">
          <Alert.Heading>Could not load your feed!</Alert.Heading>
          <hr />
          <p>{error}</p>
        </Alert>
      ) : (
        <Container fluid="md" className="d-flex justify-content-center">
          {alertError ? (
            <Row>
              <Alert
                variant="danger"
                onClose={() => setAlertError()}
                dismissible
              >
                <Alert.Heading>Oh Snap!</Alert.Heading>
                <hr />
                <p>{alertError}</p>
              </Alert>
            </Row>
          ) : null}
          <Stack gap={2} direction="horizontal">
            <IconButton
              icon="arrow-left"
              onClick={handlePrevClick}
              disabled={loading || page === 1}
              title="Previous Page"
            />
            {loading ? (
              <ArtCardPlaceholder />
            ) : feed.length ? (
              feed.map((art, idx) => (
                <ArtCard
                  key={idx}
                  art={art}
                  onLikeClick={handleLikeClick}
                  onArtChange={handleArtChange}
                />
              ))
            ) : (
              <Alert variant="light">
                <Alert.Heading>That's all folks!</Alert.Heading>
                <hr />
                <p>
                  Looks like your feed dried up. Try following more artists or
                  wait for your favorites to upload more art.
                </p>
                <hr />
                <Stack gap={2} className="flex-xs-col flex-sm-row">
                  <Button variant="outline-dark" onClick={getFeed}>
                    Refresh Feed
                  </Button>

                  <Button variant="outline-dark" as={Link} to="/explore">
                    Explore
                  </Button>

                  <Button variant="outline-dark" onClick={() => setPage(1)}>
                    Go back to top
                  </Button>
                </Stack>
              </Alert>
            )}

            <IconButton
              icon="arrow-right"
              onClick={handleNextClick}
              disabled={loading || !feed.length}
              title="Next Page"
            />
          </Stack>
        </Container>
      )}
    </>
  );
};

export default Home;
