import React from "react";
import {
  Button,
  InputGroup,
  ListGroup,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";

import { artAPI } from "../../api";
import AvatarIcon from "./AvatarIcon";
import IconButton from "./IconButton";

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
          <span style={{ backgroundColor: "#f8f9fa", padding: "8px 16px" }}>
            <AvatarIcon displayName={comment.user.displayName} size="30px" />
          </span>
          <span style={{ padding: "8px 16px" }}>{comment.comment}</span>
        </ListGroup.Item>
      ))}
      {showAddCommentForm ? (
        <ListGroup.Item style={{ padding: 0 }}>
          <Form onSubmit={handleAddComment} className="w-100">
            <InputGroup>
              <InputGroup.Text style={{ border: 0, padding: "8px 16px" }}>
                <AvatarIcon
                  // TODO: Replace with current users display name
                  displayName={"A"}
                  size="30px"
                ></AvatarIcon>
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
  }, [art, show]);

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
