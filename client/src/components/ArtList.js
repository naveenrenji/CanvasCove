import React from "react";
import {
  Alert,
  Card,
  Col,
  Container,
  Nav,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import useAuth from "../useAuth";
import { userApi } from "../api";
import { USER_ROLES } from "../constants";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "./common";

const ArtList = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const isArtist = auth?.user?.role === USER_ROLES.ARTIST;

  const [artList, setArtList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
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

  return (
    <Container fluid="md">
      {loading ? <Loader /> : null}
      <Container>
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
      </Container>
      <Container style={{ marginTop: "1rem" }}>
        {error ? (
          <Alert>{error}</Alert>
        ) : artList?.length ? (
          <Row>
            {artList.map((art) => (
              <Col key={art._id} xs={12} md={6} lg={4} className="mb-4">
                <OverlayTrigger
                  placement="bottom"
                  overlay={
                    <Tooltip id={`art-${art._id}`}>
                      {art.title}, By <strong>{art.artist.displayName}</strong>
                    </Tooltip>
                  }
                >
                  <Card
                    onClick={() => {
                      navigate(`/art/${art._id}`);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Card.Body>
                      <Card.Img src={art.images?.[0]?.url} alt={art.title} />
                    </Card.Body>
                  </Card>
                </OverlayTrigger>
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
