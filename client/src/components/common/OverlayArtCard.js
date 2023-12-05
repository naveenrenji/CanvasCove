import React from "react";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { Button, Stack } from "react-bootstrap";

import { INTERACTION_TYPES } from "../../constants";
import { PlaceholderImage } from "../../assets";
import { userApi } from "../../api";

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

  const changeFollowStatus = async () => {
    try {
      const updatedArtist = await userApi.updateFollowStatusApi(
        art?.artist?._id
      );
      onArtChange({ ...art, artist: updatedArtist });
    } catch (error) {
      console.log(error);
    }
  };

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
          <div style={{ width: "100%" }}>
            <Stack
              direction="horizontal"
              style={{ justifyContent: "space-between" }}
            >
              <div>
                <Card.Title style={{ margin: "4px 0" }}>{art.title}</Card.Title>
                <Card.Text as="span" className="d-flex align-items-center">
                  <span>By</span>
                  &nbsp;
                  {art.artist?.displayName}
                  {art.artist?.isFollowedByCurrentUser ? (
                    <></>
                  ) : (
                    <Button variant="link" onClick={changeFollowStatus}>
                      Follow
                    </Button>
                  )}
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
                    className="p-2 bg-white elevated"
                  />
                  {fullPage ? (
                    <IconButton
                      icon="chat-left-text"
                      onClick={onToggleShowComments}
                      title="Show Comments"
                      className="p-2 bg-white elevated"
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
