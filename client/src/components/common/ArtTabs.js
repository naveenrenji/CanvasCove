import React from "react";
import { Alert, Button, Col, Container, Nav, Row } from "react-bootstrap";
import useAuth from "../../useAuth";
import { artAPI, userApi } from "../../api";
import { INTERACTION_TYPES, USER_ROLES } from "../../constants";
import { Link } from "react-router-dom";
import { ArtCardPlaceholder, OverlayArtCard } from "./index";

const ArtTabs = ({ user }) => {
  const auth = useAuth();
  const isCurrentUser = auth?.user?._id === user._id;
  const isCurrentUserArtist = auth?.user?.role === USER_ROLES.ARTIST;
  const isUserArtist = user?.role === USER_ROLES.ARTIST;

  const prefix = isCurrentUser ? "My" : `${user.displayName}'s`;

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
          currentTab === "created-art"
            ? await userApi.getArtList(user?._id)
            : await userApi.getLikedArt(user?._id);
        setArtList(list);
        setLoading(false);
      } catch (err) {
        setError(err?.response?.data?.error || err?.message);
        setLoading(false);
      }
    })();
  }, [currentTab, user?._id]);

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
    <>
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
            <Nav.Link eventKey="liked-art">{prefix} Liked Art</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="created-art"
              disabled={isCurrentUser ? !isCurrentUserArtist : !isUserArtist}
            >
              {prefix} Art
            </Nav.Link>
          </Nav.Item>
        </Nav>
        {isCurrentUser && isCurrentUserArtist ? (
          <Button as={Link} to="/art/create">
            + Create Art
          </Button>
        ) : null}
      </Container>
      <Container style={{ marginTop: "1.5rem" }}>
        {loading ? (
          <Row>
            {[1, 2, 3].map((art) => (
              <Col key={art._id} xs={12} md={6} lg={4} className="mb-4">
                <ArtCardPlaceholder />
              </Col>
            ))}
          </Row>
        ) : error ? (
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
              No art to show here.{" "}
              {isCurrentUser && isCurrentUserArtist ? (
                <>
                  <Alert.Link as={Link} to="/art/create">
                    Create
                  </Alert.Link>
                  {" or "}
                </>
              ) : null}
              {isCurrentUser ? (
                <Alert.Link as={Link} to="/explore">
                  Explore
                </Alert.Link>
              ) : null}
            </span>
          </Alert>
        )}
      </Container>
    </>
  );
};

export default ArtTabs;
