import { Modal, ProgressBar } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

import "./Loader.css";

const Loader = ({ useProgress, progress, progressText }) => {
  return (
    <Modal
      show
      centered
      backdrop="static"
      keyboard={false}
      className={"loader-modal" + (useProgress ? " loader-modal-progress" : "")}
    >
      <Modal.Body className="text-center">
        {useProgress ? (
          <ProgressBar
            now={progress}
            label={`${progress}%(${progressText || "Loading..."})`}
            animated
            className="mb-3"
          />
        ) : (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default Loader;
