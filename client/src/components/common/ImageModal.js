import React from "react";
import { Button, Carousel, Form, Image, Modal } from "react-bootstrap";

const ImageModal = ({
  show,
  onClose,
  images: initialImages,
  imageableId,
  imageableType,
  editable,
  onUpdate,
  multiple,
}) => {
  const [index, setIndex] = React.useState(0);
  console.log(initialImages);
  const [images, setImages] = React.useState([...(initialImages || [])]);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const onDeleteClick = (image, index) => {
    setImages((prevImages) => {
      // Add shouldDelete: true to the image object
      const updatedImages = [...prevImages];
      updatedImages[index] = { ...image, shouldDelete: true };
      return updatedImages;
    });
  };

  const handleSave = () => {
    onUpdate(images);
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {imageableType} {(imageableId ? `: ${imageableId} ` : "") + "Images"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Carousel activeIndex={index} onSelect={handleSelect}>
          {images.map((image, idx) => (
            <Carousel.Item
              key={idx}
              className="text-center"
              style={{ background: "#efefef" }}
            >
              <Image
                src={image.url}
                alt={image.name}
                style={{ height: "30vh", objectFit: "contain" }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
        {editable ? (
          <div>
            {images?.length ? (
              <div className="d-grid mb-2 mt-2">
                {images[index]?.shouldDelete ? (
                  <Button
                    variant="success"
                    onClick={() =>
                      setImages((prevImages) => {
                        // Remove shouldDelete: true from the image object
                        const updatedImages = [...prevImages];
                        updatedImages[index] = {
                          ...images[index],
                          shouldDelete: false,
                        };
                        return updatedImages;
                      })
                    }
                  >
                    Undo Delete
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    onClick={() => onDeleteClick(images[index], index)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            ) : (
              <></>
            )}
            {!multiple && images.length === 1 ? (
              <></>
            ) : (
              <Form.Group className="mb-3 form-group" controlId="formImage">
                <Form.Label>Upload New Image</Form.Label>
                <Form.Control
                  type="file"
                  name="image"
                  multiple={multiple}
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setImages((prevImages) => {
                      return multiple
                        ? [
                            ...prevImages,
                            ...files.map((file) => ({
                              file,
                              url: URL.createObjectURL(file),
                              name: file.name,
                            })),
                          ]
                        : [
                            ...prevImages,
                            {
                              file: files[0],
                              name: files[0].name,
                              url: URL.createObjectURL(files[0]),
                            },
                          ];
                    });
                  }}
                />
              </Form.Group>
            )}
          </div>
        ) : null}
      </Modal.Body>
      <Modal.Footer>
        {editable ? (
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        ) : null}
        <Button variant="warning" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageModal;
