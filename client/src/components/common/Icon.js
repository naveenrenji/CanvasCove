import React from "react";

const Icon = ({ name, icon, size = "30px", color, style }) => {
  const iconStyle = {
    width: size,
    height: size,
    color: color || "#0a1931", // Default to Bootstrap primary color
    ...style,
  };

  return <i className={`bi bi-${icon || name}`} style={iconStyle} />;
};

export default Icon;
