import React from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

import { formatPrice } from "../../helpers";
import { INTERACTION_TYPES } from "../../constants";

import IconButton from "./IconButton";
import CommentsModal from "./CommentsModal";

const ArtCard = ({ art, onCommentsCountChange, onLikeClick }) => {
  const [showComments, setShowComments] = React.useState(false);

  const userLiked = React.useMemo(() => {
    return art.currentUserInteractions?.[0]?.type === INTERACTION_TYPES.LIKE;
  }, [art.currentUserInteractions]);

  const totalViews = React.useMemo(() => {
    return art.likesCount || 0 + art.viewsCount || 0;
  }, [art.likesCount, art.viewsCount]);

  const onToggleShowComments = React.useCallback(() => {
    setShowComments((prev) => !prev);
  }, []);

  return (
    <Card>
      <CommentsModal
        show={showComments}
        handleClose={onToggleShowComments}
        art={art}
        onCommentsCountChange={(newCount) =>
          onCommentsCountChange(art, newCount)
        }
      />
      <Card.Header className="d-flex justify-content-between align-items-center w-100">
        <div>
          <Card.Title style={{ margin: "4px 0" }}>{art.title}</Card.Title>
          <Card.Text as="span" className="d-flex align-items-center">
            <span>By</span>
            &nbsp;
            <Button
              variant="link"
              as={Link}
              to={`/artist/${art.artist._id}`}
              style={{ padding: 0 }}
            >
              {art.artist.displayName}
            </Button>
          </Card.Text>
        </div>
        <div>
          <i className="bi bi-eye-fill"></i> {totalViews} View(s)
        </div>
      </Card.Header>
      <Card.Img
        variant="top"
        src="	https://cdn.britannica.com/78/43678-050-F4DC8D93/Starry-Night-canvas-Vincent-van-Gogh-New-1889.jpg"
        className="img-fluid"
      />
      <Card.Body>
        <Card.Text>{art.description}</Card.Text>
        <Card.Text>
          <b>Price:</b> {formatPrice(art.priceInCents / 100)}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <div>
          <IconButton
            icon={"heart" + (userLiked ? "-fill" : "")}
            onClick={() => onLikeClick(art)}
            title={userLiked ? "Unlike" : "Like"}
          />
          <span>{art.likesCount || 0} Likes</span>
        </div>
        <div>
          <IconButton
            icon="chat-left-text"
            onClick={onToggleShowComments}
            title="Show Comments"
          />
          <Button variant="link" onClick={onToggleShowComments} className="p-0">
            {art.commentsCount || 0} Comments
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default ArtCard;
