import React from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import { Button, Carousel, Dropdown, Stack } from "react-bootstrap";

import { formatPrice } from "../../helpers";
import { INTERACTION_TYPES } from "../../constants";
import { userApi } from "../../api";

import IconButton from "./IconButton";
import CommentsModal from "./CommentsModal";
import Icon from "./Icon";

const ThreeDotToggle = React.forwardRef(({ children, onClick }, ref) => (
  <IconButton
    icon="three-dots-vertical"
    title={children}
    innerRef={ref}
    as="a"
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

const ArtCard = ({ art, onArtChange, onLikeClick }) => {
  const [showComments, setShowComments] = React.useState(false);
  const [copyBtn, setCopyBtn] = React.useState({
    text: "Copy Link",
    variant: "primary",
  });

  const userLiked = React.useMemo(() => {
    return art.currentUserInteractions?.[0]?.type === INTERACTION_TYPES.LIKE;
  }, [art.currentUserInteractions]);

  const totalViews = React.useMemo(() => {
    return art.likesCount || 0 + art.viewsCount || 0;
  }, [art.likesCount, art.viewsCount]);

  const isFollowedByCurrentUser = React.useMemo(() => {
    return art?.artist?.isFollowedByCurrentUser;
  }, [art]);

  const onToggleShowComments = React.useCallback(() => {
    setShowComments((prev) => !prev);
  }, []);

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

  const onCopyClick = () => {
    navigator.clipboard.writeText(`${window.location.origin}/art/${art._id}`);
    setCopyBtn({
      text: "Copied!",
      variant: "success",
    });

    setTimeout(() => {
      setCopyBtn({
        text: "Copy Link",
        variant: "primary",
      });
    }, 2000);
  };

  return (
    <Card style={{ maxWidth: "50vw" }}>
      <CommentsModal
        show={showComments}
        handleClose={onToggleShowComments}
        art={art}
        onCommentsCountChange={(commentsCount) =>
          onArtChange({ ...art, commentsCount })
        }
      />
      <Card.Header className="d-flex justify-content-between align-items-end w-100">
        <div>
          <Card.Title style={{ margin: "4px 0" }}>{art.title}</Card.Title>
          <Card.Text as="span" className="d-flex align-items-center">
            <span>By</span>
            &nbsp;
            <Button
              variant="link"
              as={Link}
              to={`/users/${art.artist._id}`}
              style={{ padding: 0 }}
            >
              {art.artist.displayName}
            </Button>
          </Card.Text>
        </div>
        <Dropdown>
          <Dropdown.Toggle as={ThreeDotToggle}>Open Menu</Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={onCopyClick}>
              <Icon
                color="black"
                icon="share-fill"
                style={{ marginRight: "0.5rem" }}
              />
              {copyBtn.text}
            </Dropdown.Item>
            <Dropdown.Item onClick={changeFollowStatus}>
              <Icon
                color="black"
                icon={
                  "person-fill-" + (isFollowedByCurrentUser ? "dash" : "add")
                }
                style={{ marginRight: "0.5rem" }}
              />
              {isFollowedByCurrentUser ? "Unfollow" : "Follow"}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Card.Header>
      <Carousel interval={3000}>
        {/* TODO: Update this to art images */}
        {[
          {
            url: "https://cdn.britannica.com/78/43678-050-F4DC8D93/Starry-Night-canvas-Vincent-van-Gogh-New-1889.jpg",
            alt: "Starry Night",
          },
        ].map((image, index) => (
          <Carousel.Item key={index}>
            <img className="d-block w-100" src={image.url} alt={image.alt} />
          </Carousel.Item>
        ))}
      </Carousel>
      <Card.Body>
        <Card.Text>{art.description}</Card.Text>
        <Card.Text>
          <b>Price:</b> {formatPrice(art.priceInCents / 100)}
        </Card.Text>
      </Card.Body>
      <Card.Footer className="d-flex flex-col justify-content-between align-items-end">
        <div>
          <Stack direction="horizontal" gap={3}>
            <IconButton
              icon={"heart" + (userLiked ? "-fill" : "")}
              onClick={() => onLikeClick(art)}
              title={userLiked ? "Unlike" : "Like"}
              className="p-0"
            />
            <IconButton
              icon="chat-left-text"
              onClick={onToggleShowComments}
              title="Show Comments"
              className="p-0"
            />
          </Stack>
          <Stack direction="vertical">
            <span>{totalViews} View(s)</span>
            <span>{art.likesCount || 0} Likes</span>
            <Button
              variant="link"
              onClick={onToggleShowComments}
              className="p-0"
            >
              View all {art.commentsCount || 0} Comments
            </Button>
          </Stack>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default ArtCard;
