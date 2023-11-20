import React from "react";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";

const ArtCardPlaceholder = () => {
  return (
    <Card style={{ maxWidth: "24rem" }} className="text-center">
      <Card.Img
        variant="top"
        src="holder.js/100px180"
        style={{ height: "12rem", maxWidth: "24rem" }}
      />
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={6} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{" "}
          <Placeholder xs={6} /> <Placeholder xs={8} />
        </Placeholder>
        <Card.Footer>
          <div className="row">
            <div className="col">
              <Placeholder.Button variant="primary" xs={6} />
            </div>
            <div className="col">
              <Placeholder.Button variant="primary" xs={6} />
            </div>
            <div className="col">
              <Placeholder.Button variant="primary" xs={6} />
            </div>
          </div>
        </Card.Footer>
      </Card.Body>
    </Card>
  );
};

export default ArtCardPlaceholder;
