import React from "react";
import {
  Button,
  InputGroup,
  ListGroup,
  Modal,
  Form,
  Alert,
  Stack,
} from "react-bootstrap";

import { artAPI } from "../../api";
import AvatarIcon from "./AvatarIcon";
import IconButton from "./IconButton";
import { Link } from "react-router-dom";

export const CommentsListGroup = ({
  comments,
  onAddNewComment,
  showAddCommentForm = false,
}) => {
  const [newComment, setNewComment] = React.useState("");

  const handleAddComment = async (e) => {
    try {
      e.preventDefault();
      if (onAddNewComment && newComment.trim().length !== 0)
        await onAddNewComment(newComment);
      setNewComment(""); // Clear the input after adding
    } catch (error) {
      console.log(error);
    }
  };

  const submitDisabled = React.useMemo(() => {
    return !newComment.trim().length;
  }, [newComment]);

  return (
    <ListGroup>
      {comments.map((comment, index) => (
        <ListGroup.Item
          key={index}
          className="d-flex align-items-center"
          style={{ padding: 0 }}
        >
          <Stack
            direction="horizontal"
            gap={2}
            style={{
              backgroundColor: "#f8f9fa",
              padding: "8px 16px",
              width: "150px",
            }}
          >
            <AvatarIcon displayName={comment.user.displayName} size="30px" />
            <Button
              variant="link"
              as={Link}
              to={`/users/${comment.user._id}`}
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                width: "80px",
                padding: 0,
                textAlign: "left",
              }}
            >
              {comment.user.displayName}
            </Button>
          </Stack>
          <span style={{ padding: "8px 16px" }}>{comment.comment}</span>
        </ListGroup.Item>
      ))}
      {showAddCommentForm ? (
        <ListGroup.Item style={{ padding: 0 }}>
          <Form onSubmit={handleAddComment} className="w-100">
            <InputGroup>
              <InputGroup.Text
                style={{ border: 0, padding: "8px 16px", width: "150px" }}
              >
                <AvatarIcon
                  // TODO: Replace with current users display name
                  displayName={"A"}
                  size="30px"
                ></AvatarIcon>
                <span
                  style={{
                    width: "80px",
                    textAlign: "left",
                    paddingLeft: "0.75rem",
                  }}
                >
                  You
                </span>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Enter comment"
                value={newComment}
                maxLength={200}
                onChange={(e) => setNewComment(e.target.value)}
                onBlur={(e) => setNewComment(e.target.value.trim())}
                style={{ border: 0, padding: "8px 16px" }}
              />
              <IconButton
                variant="link"
                type="submit"
                icon={submitDisabled ? "send-slash-fill" : "send-fill"}
                disabled={submitDisabled}
              />
            </InputGroup>
          </Form>
        </ListGroup.Item>
      ) : null}
    </ListGroup>
  );
};

const CommentsModal = ({ show, handleClose, art, onCommentsCountChange }) => {
  const [comments, setComments] = React.useState([]);
  const [alertError, setAlertError] = React.useState("");

  React.useEffect(() => {
    (async () => {
      if (show) {
        try {
          const commentsData = await artAPI.getArtCommentsApi(art._id);
          setComments(commentsData);
        } catch (error) {
          console.log(error);
        }
      }
    })();
  }, [art._id, show]);

  const handleAddComment = async (newComment) => {
    try {
      const updatedComments = await artAPI.createCommentApi(art._id, {
        comment: newComment,
      });
      setComments(updatedComments);
      onCommentsCountChange(updatedComments.length);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton style={{ padding: "8px 16px" }}>
        <Modal.Title>Comments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alertError ? (
          <Alert variant="danger" onClose={() => setAlertError()} dismissible>
            <p>Could not add comment!</p>
            <hr />
            <p>{alertError}</p>
          </Alert>
        ) : null}
        <CommentsListGroup
          showAddCommentForm
          comments={comments}
          onAddNewComment={handleAddComment}
        />
      </Modal.Body>
      <Modal.Footer style={{ padding: "8px 16px" }}>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommentsModal;
