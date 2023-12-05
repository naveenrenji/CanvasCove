import React from "react";
import { Card, Image } from "react-bootstrap";
import AvatarIcon from "./AvatarIcon";
import Icon from "./Icon";

const UserImage = ({
  user,
  images,
  canUpload,
  onClick,
  size = "250px",
  fontSize = "5rem",
}) => {
  const profilePicture = images?.filter(
    ({ shouldDelete }) => !shouldDelete
  )?.[0];

  return (
    <Card
      onClick={canUpload ? onClick : undefined}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        cursor: canUpload ? "pointer" : "auto",
      }}
      className="text-white card-hover-overlay"
    >
      {profilePicture?.url ? (
        <Image
          src={profilePicture?.url}
          alt={user?.displayName}
          roundedCircle
          fluid
          style={{
            width: size,
            height: size,
            objectFit: "cover",
          }}
        />
      ) : (
        <AvatarIcon
          size={size}
          displayName={user?.displayName}
          style={{ fontSize }}
        />
      )}
      {canUpload && (
        <Card.ImgOverlay
          style={{ width: size, height: size, borderRadius: "50%" }}
          className="d-flex align-items-center justify-content-center"
          title="Click to upload"
        >
          <Card.Text style={{ fontWeight: "bold" }}>
            <Icon icon="camera" size="2x" />
            &nbsp; Click to upload
          </Card.Text>
        </Card.ImgOverlay>
      )}
    </Card>
  );
};

export default UserImage;
