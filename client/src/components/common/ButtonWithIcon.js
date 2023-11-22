import Button from "react-bootstrap/Button";
import React from "react";

const ButtonWithIcon = ({
  icon,
  onClick,
  className,
  title,
  variant,
  style,
  children,
  ...rest
}) => {
  return (
    <Button
      className={"rounded-pill" + className || ""}
      onClick={onClick}
      title={title}
      variant={variant || "light"}
      style={style}
      {...rest}
    >
      <i className={"bi bi-" + icon + " me-3"}></i>
      {children}
    </Button>
  );
};

export default ButtonWithIcon;
