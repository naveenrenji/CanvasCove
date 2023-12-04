import React from "react";
import { Nav, Navbar, Offcanvas } from "react-bootstrap";
import Container from "react-bootstrap/Container";

import { Link, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../useAuth";

const Layout = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut(() => navigate("/"));
  };

  return (
    <div style={{ width: "100vw", height: "100vh", padding: 0 }}>
      <Navbar expand="sm" bg="primary" style={{ width: "100vw" }}>
        <Container fluid="md">
          <Navbar.Brand as={Link} to="/welcome" style={{ color: "#EFEFEF" }}>
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
                {auth.isLoggedIn ? (
                  <>
                    <Nav.Link as={Link} to="/home" style={{ color: "#EFEFEF" }}>
                      Home
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/explore"
                      style={{ color: "#EFEFEF" }}
                    >
                      Explore
                    </Nav.Link>
                    <Nav.Link as={Link} to="/art" style={{ color: "#EFEFEF" }}>
                      Art
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/account"
                      style={{ color: "#EFEFEF" }}
                    >
                      Account
                    </Nav.Link>
                    <Nav.Link onClick={onLogout} style={{ color: "#EFEFEF" }}>
                      Logout
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/login"
                      style={{ color: "#EFEFEF" }}
                    >
                      Login
                    </Nav.Link>
                    <Nav.Link
                      as={Link}
                      to="/sign-up"
                      style={{ color: "#EFEFEF" }}
                    >
                      Sign Up
                    </Nav.Link>
                  </>
                )}
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
