import Button from "react-bootstrap/Button";
import React from "react";

const IconButton = ({ icon, onClick, className, ...rest }) => {
  return (
    <Button
      className={"btn btn-light rounded-pill " + className || ""}
      onClick={onClick}
      {...rest}
    >
      <i className={"bi bi-" + icon}></i>
    </Button>
  );
};

export default IconButton;
