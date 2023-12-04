import React from "react";
import UserProfile from "./common/UserProfile";
import useAuth from "../useAuth";
import { Alert, Col, Container, Nav, Row, Spinner } from "react-bootstrap";
import { userApi } from "../api";
import { UserItem } from "./common";

const Account = () => {
  const auth = useAuth();
  const [currentTab, setCurrentTab] = React.useState("following");

  const [userList, setUserList] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const handleSelect = (eventKey) => {
    setCurrentTab(eventKey);
  };

  React.useEffect(() => {
    (async () => {
      try {
        const list =
          currentTab === "following"
            ? await userApi.getFollowing(auth?.user?._id)
            : await userApi.getFollowers(auth?.user?._id);
        setUserList(list);
        setLoading(false);
      } catch (err) {
        setError(err?.response?.data?.error || err?.message);
        setLoading(false);
      }
    })();
  }, [currentTab, auth?.user?._id]);

  const updateList = (user) => {
    setUserList((prevList) => {
      const updatedList = prevList.map((u) => {
        if (u._id === user._id) {
          return user;
        }
        return u;
      });
      return updatedList;
    });
  };

  return (
    <Container fluid="md">
      <UserProfile user={auth.user} />

      <Container className="mb-4 mt-4">
        <Nav variant="underline" activeKey={currentTab} onSelect={handleSelect}>
          <Nav.Item>
            <Nav.Link eventKey="following">Following</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="followers">Followers</Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>

      <Container>
        <Row>
          {loading ? (
            <Alert
              variant="light"
              className="d-flex align-items-center justify-content-center"
              style={{ width: "100%", marginBottom: 0, height: "10rem" }}
            >
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </Alert>
          ) : error ? (
            <Alert variant="danger" style={{ width: "100%", marginBottom: 0 }}>
              {error}
            </Alert>
          ) : userList.length ? (
            userList.map((user) => (
              <Col key={user._id} xs={12} md={6} xl={4} className="mb-4">
                <UserItem user={user} onUserChange={updateList} />
              </Col>
            ))
          ) : (
            <Alert variant="info" style={{ width: "100%", marginBottom: 0 }}>
              {currentTab === "following"
                ? "Go explore some art and follow some artists!"
                : "Create some presence on the platform. Some way!"}
            </Alert>
          )}
        </Row>
      </Container>
    </Container>
  );
};

export default Account;
