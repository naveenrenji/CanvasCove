import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Card>
      {/* TODO - Add navigation bar */}
      <Container maxWidth="md">
        <Outlet />
      </Container>
    </Card>
  );
};

export default React.memo(Layout);
