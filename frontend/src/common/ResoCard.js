import React from "react";
import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
// import lobster from "../images/lobster.jpg";

class ResoCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: false,
    };
  }

  convertDate(unixTimestamp) {
    const options = {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    };

    const date = new Date(unixTimestamp * 1000);
    const return_string = date.toLocaleDateString("en-US", options);
    return return_string;
  }

  formatText(text, maxLength) {
    let return_text = text;
    if (text.length > maxLength - 3) {
      return_text = text.slice(0, maxLength - 3) + "...";
    }
    return return_text;
  }

  render() {
    return (
      <Card
        style={{
          height: "450px",
          width: "18rem",
          margin: "10px",
          padding: "0px",
          cursor: "pointer",
        }}
        tag="a"
        onClick={() => {
          console.log(this.props);
          window.open(this.props.opensea_url, "_blank");
        }}
      >
        <Card.Img
          style={{
            height: "40%",
            objectFit: "cover",
          }}
          variant="top"
          src={this.props.image_url}
        />
        <Card.Body>
          <Card.Title>{this.formatText(this.props.title, 42)}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{this.convertDate(this.props.date)}</Card.Subtitle>
          <Card.Subtitle className="mb-2 text-muted">for {this.props.diners} diners</Card.Subtitle>
          <Card.Text>{this.formatText(this.props.description, 171)}</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

ResoCard.propTypes = {
  title: PropTypes.string,
  date: PropTypes.number,
  diners: PropTypes.string,
  description: PropTypes.string,
  image_url: PropTypes.string,
  opensea_url: PropTypes.string,
};

export default ResoCard;
