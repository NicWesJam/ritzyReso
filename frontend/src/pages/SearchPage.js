import React from "react";
import PropTypes from "prop-types";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
// import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
//import InputGroup from "react-bootstrap/InputGroup";
//import Dropdown from "react-bootstrap/Dropdown";
//import DropdownButton from "react-bootstrap/DropdownButton";
// import MyResos from "../pages/MyResos.js";
import ResoCard from "../common/ResoCard.js";

import background from "../images/background.jpg";
import Datetime from "react-datetime";

import "react-datetime/css/react-datetime.css";
class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      resoList: [],
      date: this.props.searchBar.date,
      time: this.props.searchBar.time,
      diners: this.props.searchBar.diners,
    };
  }

  componentDidMount = async () => {
    // Calling crypto token will ensure a user is created for the relevant session
    await this.getSearchResos();
  };

  getSearchResos = () => {
    let url = new URL("https://www.ritzyreso.com/api/uri/v1/");
    // Convert date and time to unix timestamp
    let params = {
      date: this.state.date.getTime() / 1000,
      time: this.state.time.getTime() / 1000,
      diners: this.state.diners,
    };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    fetch(url.pathname + url.search, {
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ resoList: data });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleDateChange = (date) => {
    console.log(date._d);
    this.setState({ date: date._d });
  };

  handleTimeChange = (time) => {
    console.log(time);
    this.setState({ time: time._d });
  };

  handleDinersChange = (e) => {
    console.log(e.target.value);
    this.setState({ diners: e.target.value });
  };

  render() {
    return (
      <Col style={{ padding: "0px" }}>
        <Row
          className="align-items-center bg-light"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background}`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            padding: "20px",
          }}
        >
          <Container style={{ maxWidth: "970px" }}>
            <Row
              className="justify-content-md-center justify-content-center"
              xs={1}
              sm={1}
              md={3}
              lg={5}
            >
              <Col style={{ padding: "0px" }}>
                <Datetime
                  dateFormat="ll"
                  timeFormat={false}
                  value={this.state.date}
                  onChange={this.handleDateChange}
                  onClose={this.handleDateChange}
                  utc={true}
                />
              </Col>
              <Col style={{ padding: "0px" }}>
                <Datetime
                  dateFormat={false}
                  value={this.state.time}
                  onChange={this.handleTimeChange}
                  utc={true}
                />
              </Col>
              <Col style={{ padding: "0px" }}>
                <Form.Select
                  defaultValue={this.props.searchBar.diners}
                  onChange={this.handleDinersChange}
                >
                  <option value={1}>1 Diner</option>
                  <option value={2}>2 Diners</option>
                  <option value={3}>3 Diners</option>
                  <option value={4}>4 Diners</option>
                  <option value={5}>5 Diners</option>
                  <option value={6}>6 Diners</option>
                  <option value={7}>7 Diners</option>
                  <option value={8}>8+ Diners</option>
                </Form.Select>
              </Col>
              {/*
              <Col style={{ padding: "0px", minWidth: "300px" }}>
                <FloatingLabel controlId="floatingInputGrid" label="Search">
                  <Form.Control type="text" placeholder="" />
                </FloatingLabel>
              </Col>
              */}
              <Col style={{ padding: "0px", width: "82px" }}>
                <Button
                  style={{ height: "38px", width: "130px" }}
                  onClick={this.getSearchResos}
                >
                  Search
                </Button>
              </Col>
            </Row>
          </Container>
        </Row>
        <Row className="justify-content-center">
          <h5 className="text-center" style={{ marginTop: "5px" }}>
            {this.state.resoList.length} search results
          </h5>
          {this.state.resoList.map((reso, index) => (
            <ResoCard
              key={index}
              title={reso.name}
              image_url={reso.image}
              date={reso.event_date}
              diners={reso.diners.toString()}
              description={reso.description}
              opensea_url={reso.opensea_url}
            />
          ))}
        </Row>
      </Col>
    );
  }
}

SearchPage.propTypes = {
  // resoList: PropTypes.array,
  searchBar: PropTypes.object,
};

export default SearchPage;
