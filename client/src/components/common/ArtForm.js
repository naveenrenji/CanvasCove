import React from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  FloatingLabel,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ART_TYPES, ART_VISIBILITY } from "../../constants";
import { artAPI } from "../../api";
import Loader from "./Loader";
import ImageModal from "./ImageModal";

/**
 * TODO: Handle image upload and delete
 * TODO: Handle form validation
 */
const ArtForm = ({ art = {}, onSuccess }) => {
  const isEditing = React.useMemo(() => !!art._id, [art]);
  const navigate = useNavigate();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [progressData, setProgressData] = React.useState({
    progress: 0,
    progressText: "",
  });

  const [title, setTitle] = React.useState({
    value: art.title || "",
    error: "",
  });

  const [description, setDescription] = React.useState({
    value: art.description || "",
    error: "",
  });

  const [artType, setArtType] = React.useState({
    value: art.artType || "",
    error: "",
  });

  const [price, setPrice] = React.useState({
    value: art.priceInCents ? art.priceInCents / 100 : "",
    error: "",
  });

  const [visibility, setVisibility] = React.useState({
    value: art.visibility || ART_VISIBILITY.PUBLIC,
    error: "",
  });

  const [isVisible, setIsVisible] = React.useState({
    value: art.isVisible || false,
    error: "",
  });

  const [images, setImages] = React.useState({
    value: art.images || [],
    error: "",
  });
  const [showImagesModal, setShowImagesModal] = React.useState(false);

  const handleToggleImagesModal = () => setShowImagesModal((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        title: title.value,
        description: description.value,
        artType: artType.value,
        priceInCents: Number((price.value * 100).toFixed(0)),
        visibility: visibility.value,
        isVisible: isVisible.value,
      };
      setProgressData({
        progress: 0,
        progressText: `${isEditing ? "Updating" : "Creating"} art...`,
      });

      const artRes = isEditing
        ? await artAPI.updateArtApi(art._id, data)
        : await artAPI.createArtApi(data);

      const imagesToAdd = images.value
        .filter(({ _id, shouldDelete }) => !_id && !shouldDelete)
        .map((image) => image.file);

      const imagesToAddCount = imagesToAdd.length;

      const imagesToDelete = images.value
        .filter(({ _id, shouldDelete }) => _id && shouldDelete)
        .map((image) => image._id);

      const totalImagesCount = imagesToAddCount + imagesToDelete.length;

      if (totalImagesCount) {
        setProgressData({
          progress: 50,
          progressText: "Updating images...",
        });

        const uploadTotalProgress = Math.round(
          (50 * imagesToAddCount) / totalImagesCount
        );

        for (let i = 0; i < imagesToAddCount; i++) {
          await artAPI.uploadImageApi(artRes._id, imagesToAdd[i], (event) => {
            const progress =
              50 +
              Math.round(
                (uploadTotalProgress / imagesToAddCount) *
                  (event.loaded / event.total)
              );
            setProgressData({
              progress,
              progressText: `Uploading images... (${
                i + 1
              }/${imagesToAddCount})`,
            });
          });
        }

        await artAPI.deleteImagesApi(artRes._id, imagesToDelete);
      }

      setProgressData({
        progress: 100,
        progressText: `Art ${isEditing ? "updated" : "created"} successfully!`,
      });

      setLoading(false);

      if (onSuccess) {
        onSuccess(artRes);
      }
    } catch (error) {
      setLoading(false);
      setError(error?.message);
    }
  };

  const resetForm = () => {
    setTitle({ value: art.title || "", error: "" });
    setDescription({ value: art.description || "", error: "" });
    setArtType({ value: art.artType || "", error: "" });
    setPrice({ value: art.priceInCents ? art.priceInCents / 100 : "", error: "" });
    setVisibility({ value: art.visibility || ART_VISIBILITY.PUBLIC, error: "" });
    setIsVisible({ value: art.isVisible || false, error: "" });
    setImages({ value: art.images || [], error: "" }); 
  };

  return (
    <Container fluid="md">
      {loading ? (
        <Loader
          useProgress
          progress={progressData.progress}
          progressText={progressData.progressText}
        />
      ) : null}

      <Card>
        <Card.Header>{isEditing ? "Update" : "Create"} Art</Card.Header>
        <Form noValidate onSubmit={handleSubmit}>
          <Card.Body>
            <FloatingLabel label="Title" className="mb-3">
              <Form.Control
                name="title"
                placeholder="Title"
                required
                value={title.value}
                onChange={(e) => {
                  setTitle({ value: e.target.value, error: "" });
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  setTitle({
                    value: value.trim(),
                    error: value ? "" : "Title is required!",
                  });
                }}
              />
            </FloatingLabel>

            <FloatingLabel label="Description" className="mb-3">
              <Form.Control
                name="description"
                as="textarea"
                placeholder="Enter description of your art here."
                required
                value={description.value}
                onChange={(e) => {
                  setDescription({ value: e.target.value, error: "" });
                }}
                onBlur={(e) => {
                  const value = e.target.value;
                  setDescription({
                    value: value.trim(),
                    error: value ? "" : "Description is required!",
                  });
                }}
              />
            </FloatingLabel>
            <Row className="mb-3">
              <Col>
                <FloatingLabel label="Art Type">
                  <Form.Select
                    name="artType"
                    aria-label="Select Art type"
                    required
                    value={artType.value}
                    onChange={(event) => {
                      setArtType({ value: event.target.value, error: "" });
                    }}
                  >
                    <option>Choose your art type</option>
                    {Object.values(ART_TYPES).map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col>
                {showImagesModal && (
                  <ImageModal
                    show={showImagesModal}
                    onClose={handleToggleImagesModal}
                    images={images.value}
                    imageableId={art._id}
                    imageableType="Art"
                    onUpdate={(updatedImages) => {
                      setImages({ value: updatedImages, error: "" });
                      handleToggleImagesModal();
                    }}
                    editable
                    multiple
                  />
                )}
                <Button variant="primary" onClick={handleToggleImagesModal}>
                  {images?.value?.length ? "Add/Update" : "Add"} Images
                </Button>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col xs={6}>
                <InputGroup className="mb-3">
                  <InputGroup.Text>$</InputGroup.Text>
                  <FloatingLabel label="Price">
                    <Form.Control
                      name="price"
                      type="number"
                      placeholder="Price"
                      value={price.value}
                      onChange={(event) => {
                        setPrice({
                          value: event.target.value || "",
                          error: "",
                        });
                      }}
                    />
                  </FloatingLabel>
                </InputGroup>
              </Col>
            </Row>

            <div className="mb-3">
              <Form.Check
                name="visibility"
                type="switch"
                id="visibility-switch"
                label={`Visibility - ${visibility.value}`}
                checked={visibility.value === ART_VISIBILITY.PUBLIC}
                onChange={(event) => {
                  setVisibility({
                    value: event.target.checked
                      ? ART_VISIBILITY.PUBLIC
                      : ART_VISIBILITY.PRIVATE,
                    error: "",
                  });
                }}
              />
              <Form.Text muted>
                Choose whether your art is public or private. Private art can be
                viewed when you share the link.
              </Form.Text>
            </div>

            <Form.Check
              name="isVisible"
              type="switch"
              id="draft-switch"
              label={`Draft - ${!isVisible.value ? "Yes" : "No"}`}
              checked={!isVisible.value}
              onChange={(event) => {
                setIsVisible({ value: !event.target.checked, error: "" });
              }}
            />
            <Form.Text muted>Draft art is not visible to anyone.</Form.Text>
          </Card.Body>

          <Card.Footer>
            {error ? (
              <Alert variant="danger" onClose={() => setError()} dismissible>
                {error}
              </Alert>
            ) : null}
            <Button variant="primary" type="submit" className="me-3">
              {isEditing ? "Update" : "Create"}
            </Button>

            <Button
              variant="secondary"
              type="reset"
              className="me-3"
              onClick={resetForm}
            >
              Reset
            </Button>

            <Button
              variant="danger"
              type="cancel"
              className="me-3"
              onClick={() => {
                navigate("/art");
              }}
            >
              Cancel
            </Button>
          </Card.Footer>
        </Form>
      </Card>
    </Container>
  );
};

export default ArtForm;
