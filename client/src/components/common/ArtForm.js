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
import { ART_TYPES, ART_VISIBILITY } from "../../constants";
import { artAPI } from "../../api";
import Loader from "./Loader";

/**
 * TODO: Handle image upload and delete
 * TODO: Handle form validation
 */
const ArtForm = ({ art = {}, onSuccess }) => {
  const isEditing = React.useMemo(() => !!art._id, [art]);

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

  const [isDraft, setIsDraft] = React.useState({
    value: art.isDraft || false,
    error: "",
  });

  const [images, setImages] = React.useState({
    value: art.images || [],
    error: "",
  });

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
        isDraft: isDraft.value,
      };
      setProgressData({
        progress: 0,
        progressText: `${isEditing ? "Updating" : "Creating"} art...`,
      });

      const artRes = isEditing
        ? await artAPI.updateArtApi(art._id, data)
        : await artAPI.createArtApi(data);

      if (images.value?.length) {
        setProgressData({
          progress: 50,
          progressText: "Uploading images...",
        });

        const imagesCount = images.value?.length;

        for (let i = 0; i < imagesCount; i++) {
          await artAPI.uploadImageApi(artRes._id, images.value[i], (event) => {
            const progress =
              50 +
              Math.round((50 / imagesCount) * (event.loaded / event.total));
            setProgressData({
              progress,
              progressText: `Uploading images... (${i + 1}/${imagesCount})`,
            });
          });
        }
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
                <FloatingLabel label="Images">
                  <Form.Control
                    name="images"
                    type="file"
                    multiple
                    onChange={(event) => {
                      event.target.files.length &&
                        setImages({ value: event.target.files, error: "" });
                    }}
                  />
                </FloatingLabel>
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
                      onChange={(value) => {
                        setPrice({ value, error: "" });
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
              name="isDraft"
              type="switch"
              id="draft-switch"
              label={`Draft - ${isDraft.value ? "Yes" : "No"}`}
              checked={isDraft.value}
              onChange={(event) => {
                setIsDraft({ value: event.target.checked, error: "" });
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

            <Button variant="secondary" type="reset" className="me-3">
              Reset
            </Button>

            <Button variant="danger" type="cancel" className="me-3">
              Cancel
            </Button>
          </Card.Footer>
        </Form>
      </Card>
    </Container>
  );
};

export default ArtForm;
