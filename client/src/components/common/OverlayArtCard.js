import React from "react";
import Card from "react-bootstrap/Card";
import { Link, useNavigate } from "react-router-dom";
import { Stack } from "react-bootstrap";

import { INTERACTION_TYPES } from "../../constants";
import { PlaceholderImage } from "../../assets";

import IconButton from "./IconButton";
import CommentsModal from "./CommentsModal";

const OverlayArtCard = ({ art, onArtChange, onLikeClick, fullPage }) => {
  const navigate = useNavigate();
  const [showComments, setShowComments] = React.useState(false);

  const onToggleShowComments = React.useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowComments((prev) => !prev);
  }, []);

  const userLiked = React.useMemo(() => {
    return art.currentUserInteractions?.[0]?.type === INTERACTION_TYPES.LIKE;
  }, [art.currentUserInteractions]);

  const totalViews = React.useMemo(() => {
    return art.likesCount || 0 + art.viewsCount || 0;
  }, [art.likesCount, art.viewsCount]);

  return (
    <Card className="text-white card-hover-overlay">
      <CommentsModal
        show={showComments}
        handleClose={onToggleShowComments}
        art={art}
        onCommentsCountChange={(commentsCount) =>
          onArtChange({ ...art, commentsCount })
        }
      />
      <Card.Img
        className="d-block"
        src={art.images?.[0]?.url || PlaceholderImage}
        alt={art.images?.[0]?.name || "Placeholder"}
        style={{
          objectFit: "cover",
          margin: "auto",
          maxHeight: "100%",
          maxWidth: "100%",
        }}
      />
      <Card.ImgOverlay
        className=""
        onClick={() => {
          navigate(`/art/${art._id}`);
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            height: "100%",
            fontWeight: "bold",
          }}
        >
          <div style={{ width: "100%" }} direction="horizontal">
            <Stack
              direction="horizontal"
              style={{ justifyContent: "space-between" }}
            >
              <div>
                <Card.Title
                  style={{ margin: "4px 0" }}
                  as={Link}
                  to={`/art/${art._id}`}
                >
                  {art.title}
                </Card.Title>
                <Card.Text as="span" className="d-flex align-items-center">
                  <span>By</span>
                  &nbsp;
                  {art.artist.displayName}
                </Card.Text>
              </div>
              <div>
                <Stack direction="horizontal" gap={1}>
                  <IconButton
                    icon={"heart" + (userLiked ? "-fill" : "")}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onLikeClick(art);
                    }}
                    title={userLiked ? "Unlike" : "Like"}
                    className="p-2 bg-white"
                  />
                  {fullPage ? (
                    <IconButton
                      icon="chat-left-text"
                      onClick={onToggleShowComments}
                      title="Show Comments"
                      className="p-2 bg-white"
                    />
                  ) : (
                    <></>
                  )}
                </Stack>
                {fullPage ? (
                  <Stack direction="vertical">
                    <span>{totalViews} View(s)</span>
                    <span>{art.likesCount || 0} Likes</span>
                  </Stack>
                ) : (
                  <></>
                )}
              </div>
            </Stack>
          </div>
        </div>
      </Card.ImgOverlay>
    </Card>
  );
};

export default OverlayArtCard;
