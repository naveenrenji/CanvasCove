import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { formatPrice } from "../../utils";

const ArtCard = ({ art }) => {
  return (
    <Card style={{ width: "24rem" }} className="text-center">
      <Card.Img
        variant="top"
        src="holder.js/100px180"
        style={{ height: "12rem", width: "24rem" }}
      />
      <Card.Body>
        <Card.Title>{art.title}</Card.Title>
        <Card.Text>{art.description}</Card.Text>
        <Card.Text>
          <b>Price:</b> {formatPrice(art.priceInCents / 100)}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <div className="row">
          <div className="col">
            <Button variant="primary">Prev</Button>
          </div>
          <div className="col">
            <Button variant="primary">Buy</Button>
          </div>
          <div className="col">
            <Button variant="primary">Next</Button>
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default ArtCard;
