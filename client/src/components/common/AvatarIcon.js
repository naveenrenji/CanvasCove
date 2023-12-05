import React from "react";

const AvatarIcon = ({
  displayName,
  size,
  backgroundColor,
  color,
  style,
  onClick,
}) => {
  const avatarStyle = {
    width: size,
    height: size,
    borderRadius: "50%",
    backgroundColor: backgroundColor || "#007bff", // Default to Bootstrap primary color
    color: color || "#ffffff", // Default to white color
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "1em",
    ...style,
  };

  return (
    <div style={avatarStyle} onClick={onClick}>
      {displayName ? displayName.charAt(0).toUpperCase() : "?"}
    </div>
  );
};

export default AvatarIcon;
