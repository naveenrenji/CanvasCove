import React from "react";
import { Card, Image, OverlayTrigger, Stack, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router";
import AvatarIcon from "./AvatarIcon";

const UserItem = ({ user }) => {
  const navigate = useNavigate();

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip id={`/users/${user._id}`}>
          View more about {user?.firstName} {user?.lastName}
        </Tooltip>
      }
    >
      <Card
        onClick={() => {
          navigate(`/users/${user?._id}`);
        }}
        style={{ cursor: "pointer" }}
      >
        <Card.Body className="d-flex" as={Stack} gap={4} direction="horizontal">
          {user?.images?.[0]?.url ? (
            <Card.Img
              as={Image}
              src={user?.images?.[0]?.url}
              alt={user.displayName}
              roundedCircle
              fluid
              style={{ width: "3rem", height: "3rem", objectFit: "cover" }}
            />
          ) : (
            <AvatarIcon
              style={{ width: "3rem", height: "3rem" }}
              displayName={user?.displayName}
            />
          )}
          {/* Show displayName, firstName, and LastName */}
          <div>
            <Card.Title>{user.displayName}</Card.Title>
            <Card.Text>
              {user?.firstName} {user?.lastName}
            </Card.Text>
          </div>
        </Card.Body>
      </Card>
    </OverlayTrigger>
  );
};

export default UserItem;
