import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import React from "react";

const OverlayLink = ({ id, children, title, link }) => (
  <OverlayTrigger overlay={<Tooltip id={id}>{title}</Tooltip>}>
    <Link to={link}>{children}</Link>
  </OverlayTrigger>
);

export default OverlayLink;
