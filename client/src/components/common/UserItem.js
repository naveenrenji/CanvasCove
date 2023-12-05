import React from "react";
import { Card, OverlayTrigger, Stack, Tooltip } from "react-bootstrap";
import { useNavigate } from "react-router";
import UserImage from "./UserImage";

const UserItem = ({ user }) => {
  const navigate = useNavigate();

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip id={`/users/${user?._id}`}>
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
          <UserImage
            images={user?.images || []}
            user={user}
            size="3rem"
            fontSize="1em"
          />
          {/* Show displayName, firstName, and LastName */}
          <div>
            <Card.Title>{user?.displayName}</Card.Title>
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
