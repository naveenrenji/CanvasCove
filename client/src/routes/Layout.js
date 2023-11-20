import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import Container from "react-bootstrap/Container";

import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", padding: 0 }}>
      <Navbar bg="light" data-bs-theme="light" style={{ width: "100vw" }}>
        <Container fluid="md">
          <Navbar.Brand as={Link} to="/home">
            Canvas Cove
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/explore">
              Explore
            </Nav.Link>
            <Nav.Link as={Link} to="/account">
              Account
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container
        fluid
        style={{ height: "calc(100vh - 56px)", paddingTop: "56px" }}
        // className="d-flex justify-content-center"
      >
        <Outlet />
      </Container>
    </div>
  );
};

export default React.memo(Layout);
