import React from "react";
import { Nav, Navbar, Offcanvas } from "react-bootstrap";
import Container from "react-bootstrap/Container";

import { Link, Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", padding: 0 }}>
      <Navbar
        expand="sm"
        bg="light"
        data-bs-theme="light"
        style={{ width: "100vw" }}
      >
        <Container fluid="md">
          <Navbar.Brand as={Link} to="/home">
            Canvas Cove
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar-expand-sm" />
          <Navbar.Offcanvas
            id="offcanvasNavbar-expand-sm"
            aria-labelledby="offcanvasNavbarLabel-expand-sm"
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel-expand-sm">
                Canvas Cove
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
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
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <Container
        fluid
        style={{
          height: "calc(100vh - 56px)",
          paddingTop: "56px",
          paddingBottom: "56px",
          overflow: "auto",
        }}
        // className="d-flex justify-content-center"
      >
        <Outlet />
      </Container>
    </div>
  );
};

export default React.memo(Layout);
