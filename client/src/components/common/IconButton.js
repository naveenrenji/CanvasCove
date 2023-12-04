import Button from "react-bootstrap/Button";
import React from "react";
import "./IconButton.css";

const IconButton = ({
  icon,
  onClick,
  className,
  title,
  variant,
  style,
  innerRef,
  ...rest
}) => {
  return (
    <Button
      className={"icon-button " + className || ""}
      onClick={onClick}
      title={title}
      variant={"link"}
      style={style}
      {...(innerRef ? { ref: innerRef } : {})}
      {...rest}
    >
      <i className={"bi bi-" + icon}></i>
    </Button>
  );
};

export default IconButton;
