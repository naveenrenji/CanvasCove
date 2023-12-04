import React from "react";
import { Spinner, Stack } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";

const ArtCardPlaceholder = ({ fullPage }) => {
  return (
    <Card style={{ width: "100%", height: fullPage ? "50vh" : "20vh" }}>
      <Spinner animation="border" role="status" style={{ margin: "auto" }}>
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      <Card.ImgOverlay>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            height: "100%",
            fontWeight: "bold",
          }}
        >
          <div style={{ width: "100%" }} direction="horizontal">
            <Stack
              direction="horizontal"
              style={{ justifyContent: "space-between" }}
            >
              <div style={{ width: "50%" }}>
                <Placeholder as={Card.Title} animation="wave">
                  <Placeholder xs={6} />
                </Placeholder>
                <Placeholder as={Card.Text} animation="wave">
                  <Placeholder xs={2} /> <Placeholder xs={8} />
                </Placeholder>
              </div>
              <div style={{ width: "10%" }}>
                <Stack direction="horizontal" gap={1} className="mb-2">
                  <Placeholder xs={4} />
                  {fullPage ? <Placeholder xs={4} /> : <></>}
                </Stack>
                {fullPage ? (
                  <Stack direction="vertical" gap={1}>
                    <Placeholder xs={10} />
                    <Placeholder xs={10} />
                  </Stack>
                ) : (
                  <></>
                )}
              </div>
            </Stack>
          </div>
        </div>
      </Card.ImgOverlay>
    </Card>
  );
};

export default ArtCardPlaceholder;
