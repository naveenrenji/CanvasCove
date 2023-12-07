import React from "react";
import { OverlayArtCard, ArtCardPlaceholder, IconButton } from "./common";
import {
  Alert,
  Button,
  Col,
  Container,
  Row,
  Spinner,
  Stack,
} from "react-bootstrap";
import { Link } from "react-router-dom";

import { artAPI } from "../api";
import { INTERACTION_TYPES, ART_TYPES } from "../constants";

const PILLS = {
  ALL: "All",
  ...ART_TYPES,
};

const Home = () => {
  const [loading, setLoading] = React.useState(true);
  const [feed, setFeed] = React.useState([]);
  const [selectedPill, setSelectedPill] = React.useState("All");
  const [error, setError] = React.useState(null);
  const [alertError, setAlertError] = React.useState(null);
  const [page, setPage] = React.useState(1);

  const [onFireArt, setOnFireArt] = React.useState([]);
  const [onFireArtError, setOnFireArtError] = React.useState(null);
  const [onFireArtLoading, setOnFireArtLoading] = React.useState(true);
  const [onFireArtPage, setOnFireArtPage] = React.useState(1);

  const getFeed = React.useCallback(async () => {
    try {
      setLoading(true);
      const feedRes = await artAPI.getFeedApi(page, selectedPill);
      setFeed(feedRes);
    } catch (error) {
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  }, [page, selectedPill]);

  const getOnFireArt = React.useCallback(async () => {
    try {
      setOnFireArtLoading(true);
      const response = await artAPI.getOnFireArtApi(onFireArtPage);
      setOnFireArt(response);
    } catch (error) {
      setOnFireArtError(error?.message);
    } finally {
      setOnFireArtLoading(false);
    }
  }, [onFireArtPage]);

  React.useEffect(() => {
    getFeed();
  }, [getFeed]);

  React.useEffect(() => {
    getOnFireArt();
  }, [getOnFireArt]);

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

      setOnFireArt((prevOnFireArt) => {
        const updatedOnFireArt = prevOnFireArt.map((art) => {
          if (art._id === updatedArt._id) {
            return updatedArt;
          }
          return art;
        });
        return updatedOnFireArt;
      });
    } catch (error) {
      setAlertError(error?.message);
    }
  };

  const onPageChange = async (newPage) => {
    setPage(newPage);
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
    setOnFireArt((prevOnFireArt) => {
      const updatedOnFireArt = prevOnFireArt.map((art) => {
        if (art._id === updatedArt._id) {
          return updatedArt;
        }
        return art;
      });
      return updatedOnFireArt;
    });
  };

  const handleOnFireArtNextClick = () =>
    onOnFireArtPageChange(onFireArtPage + 1);
  const handleOnFireArtPrevClick = () =>
    onOnFireArtPageChange(onFireArtPage - 1);
  const onOnFireArtPageChange = async (newPage) => {
    setOnFireArtPage(newPage);
  };

  return (
    <>
      <Container fluid="md">
        <Stack gap={2} direction="horizontal" style={{ margin: "1rem auto" }}>
          {Object.values(PILLS).map((pill) => (
            <Button
              key={pill}
              onClick={() => setSelectedPill(pill)}
              variant={
                pill === selectedPill ? "outline-secondary" : "outline-primary"
              }
              style={{ borderWidth: "2px" }}
            >
              {pill}
            </Button>
          ))}
        </Stack>
      </Container>
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
          <Stack gap={2} direction="horizontal" style={{ width: "100%" }}>
            <IconButton
              icon="arrow-left"
              onClick={handlePrevClick}
              disabled={loading || page === 1}
              title="Previous Page"
              className="bg-primary p-3"
              style={{ color: "white" }}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loading ? (
                <ArtCardPlaceholder fullPage />
              ) : feed.length ? (
                feed.map((art, idx) => (
                  <OverlayArtCard
                    key={idx}
                    art={art}
                    onLikeClick={handleLikeClick}
                    onArtChange={handleArtChange}
                    fullPage
                  />
                ))
              ) : (
                <Alert variant="light" style={{ width: "100%" }}>
                  <Alert.Heading>
                    {page !== 1 ? "That's all folks!" : "No art!"}
                  </Alert.Heading>
                  <hr />
                  <p>
                    {page !== 1
                      ? "Looks like your feed dried up. Try following more artists or wait for your favorites to upload more art."
                      : "Looks like you need to do some more digging. Try exploring some art and following the artists you like."}
                  </p>
                  <hr />
                  <Stack gap={2} className="flex-xs-col flex-sm-row">
                    <Button variant="outline-dark" onClick={getFeed}>
                      Refresh Feed
                    </Button>

                    <Button variant="outline-dark" as={Link} to="/explore">
                      Explore
                    </Button>

                    {page !== 1 ? (
                      <Button variant="outline-dark" onClick={() => setPage(1)}>
                        Go back to top
                      </Button>
                    ) : (
                      <></>
                    )}
                  </Stack>
                </Alert>
              )}
            </div>

            <IconButton
              icon="arrow-right"
              onClick={handleNextClick}
              disabled={loading || !feed.length}
              title="Next Page"
              className="bg-primary p-3"
              style={{ color: "white" }}
            />
          </Stack>
        </Container>
      )}
      {/* <Container fluid="md" className="mt-4">
        <h3>Latest Artwork on 🔥</h3>
        <hr />
      </Container>
      <Container fluid="md" className="d-flex justify-content-center">
        {onFireArtLoading ? (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : onFireArtError ? (
          <Alert variant="danger">
            <Alert.Heading>Could not load latest artwork</Alert.Heading>
            <hr />
            <p>{alertError}</p>
          </Alert>
        ) : (
          <Stack gap={2} direction="horizontal" style={{ width: "100%" }}>
            <IconButton
              icon="arrow-left"
              onClick={handleOnFireArtPrevClick}
              disabled={loading || onFireArtLoading || onFireArtPage === 1}
              title="Previous Page"
              className="bg-primary p-3"
              style={{ color: "white" }}
            />
            {onFireArt.length ? (
              <Row style={{ width: "100%" }}>
                {onFireArt.map((art, idx) => (
                  <Col key={idx} xs={12} md={4} lg={3}>
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <OverlayArtCard
                        key={idx}
                        art={art}
                        onLikeClick={handleLikeClick}
                        onArtChange={handleArtChange}
                      />
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <Alert variant="info" style={{ width: "100%", marginBottom: 0 }}>
                Hmm! Looks like everyone is resting right now. Try again later.
              </Alert>
            )}
            <IconButton
              icon="arrow-right"
              onClick={handleOnFireArtNextClick}
              disabled={loading || onFireArtLoading || !onFireArt.length}
              title="Next Page"
              className="bg-primary p-3"
              style={{ color: "white" }}
            />
          </Stack>
        )}
      </Container> */}
    </>
  );
};

export default Home;
