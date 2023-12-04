import React from "react";
import { Alert, Button, Col, Container, Nav, Row } from "react-bootstrap";
import useAuth from "../useAuth";
import { artAPI, userApi } from "../api";
import { INTERACTION_TYPES, USER_ROLES } from "../constants";
import { Link } from "react-router-dom";
import { Loader, OverlayArtCard } from "./common";

const ArtList = () => {
  const auth = useAuth();
  const isArtist = auth?.user?.role === USER_ROLES.ARTIST;

  const [artList, setArtList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [alertError, setAlertError] = React.useState(null);
  const [currentTab, setCurrentTab] = React.useState("liked-art");

  const handleSelect = (eventKey) => {
    setCurrentTab(eventKey);
  };

  React.useEffect(() => {
    (async () => {
      try {
        const list =
          currentTab === "my-art"
            ? await userApi.getArtList(auth?.user?._id)
            : await userApi.getLikedArt(auth?.user?._id);
        setArtList(list);
        setLoading(false);
      } catch (err) {
        setError(err?.response?.data?.error || err?.message);
        setLoading(false);
      }
    })();
  }, [currentTab, auth?.user?._id]);

  const handleLikeClick = async (art) => {
    try {
      const updatedArt = await artAPI.interactWithArtApi(
        art._id,
        INTERACTION_TYPES.LIKE
      );
      setArtList((prevList) => {
        const updatedFeed = prevList.map((art) => {
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

  const handleArtChange = (updatedArt) => {
    setArtList((prevList) => {
      const updatedFeed = prevList.map((art) => {
        if (art._id === updatedArt._id) {
          return updatedArt;
        }
        return art;
      });
      return updatedFeed;
    });
  };

  return (
    <Container fluid="md">
      {loading ? <Loader /> : null}
      {alertError ? (
        <Row>
          <Alert variant="danger" onClose={() => setAlertError()} dismissible>
            <Alert.Heading>Oops! Could not like this art</Alert.Heading>
            <hr />
            <p>{alertError}</p>
          </Alert>
        </Row>
      ) : null}
      <Container className="d-flex justify-content-between">
        <Nav variant="underline" activeKey={currentTab} onSelect={handleSelect}>
          <Nav.Item>
            <Nav.Link eventKey="liked-art">My Liked Art</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="my-art" disabled={!isArtist}>
              My Art
            </Nav.Link>
          </Nav.Item>
        </Nav>
        {isArtist ? (
          <Button as={Link} to="/art/create">
            + Create Art
          </Button>
        ) : null}
      </Container>
      <Container style={{ marginTop: "1rem" }}>
        {error ? (
          <Alert>{error}</Alert>
        ) : artList?.length ? (
          <Row>
            {artList.map((art) => (
              <Col key={art._id} xs={12} md={6} lg={4} className="mb-4">
                <OverlayArtCard
                  art={art}
                  onArtChange={handleArtChange}
                  onLikeClick={handleLikeClick}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="light">
            <Alert.Heading>No Art!</Alert.Heading>
            <hr />
            <span>
              You don't have any art to show here.{" "}
              {isArtist ? (
                <>
                  <Alert.Link as={Link} to="/art/create">
                    Create
                  </Alert.Link>
                  {" or "}
                </>
              ) : null}
              <Alert.Link as={Link} to="/explore">
                Explore
              </Alert.Link>
            </span>
          </Alert>
        )}
      </Container>
    </Container>
  );
};

export default ArtList;
