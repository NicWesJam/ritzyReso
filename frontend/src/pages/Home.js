import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import ResoCard from "../common/ResoCard.js";

import background from "../images/background.jpg";
import Datetime from "react-datetime";

import "react-datetime/css/react-datetime.css";
class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      date: this.props.searchBar.date,
      time: this.props.searchBar.time,
      diners: this.props.searchBar.diners,
    };
    this.handleSearchClick = this.handleSearchClick.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleDinersChange = this.handleDinersChange.bind(this);
  }

  handleDateChange(date) {
    console.log(date._d);
    this.setState({ date: date._d });
    this.props.handleChangeSearchBar(date._d, this.state.time, this.state.diners);
  }

  handleTimeChange(time) {
    console.log(time);
    this.setState({ time: time._d });
    this.props.handleChangeSearchBar(this.state.date, time._d, this.state.diners);
  }

  handleDinersChange(e) {
    console.log(e.target.value);
    this.setState({ diners: e.target.value });
    this.props.handleChangeSearchBar(this.state.date, this.state.time, e.target.value);
  }

  handleSearchClick() {
    console.log("test");
    this.props.history.push("/search");
  }

  render() {
    return (
      <Col style={{ padding: "0px" }}>
        <Row
          className="align-items-center bg-light"
          style={{
            height: "350px",
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${background}`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Container style={{ maxWidth: "970px" }}>
            <h2 className="text-center text-white">Find your Ritzy Reso</h2>
            <Row className="justify-content-md-center justify-content-center" xs={1} sm={1} md={3} lg={5}>
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
                <Datetime dateFormat={false} value={this.state.time} onChange={this.handleTimeChange} utc={true} />
              </Col>
              <Col style={{ padding: "0px" }}>
                <Form.Select defaultValue={this.props.searchBar.diners} onChange={this.handleDinersChange}>
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
                <Button style={{ height: "38px", width: "130px" }} onClick={this.handleSearchClick}>
                  Search
                </Button>
              </Col>
            </Row>
          </Container>
        </Row>
        <Row className="justify-content-center">
          <h2 className="text-center" style={{ marginTop: "20px" }}>
            Upcoming Resos near you
          </h2>
          {this.props.resoList.map((reso, index) => (
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

Home.propTypes = {
  resoList: PropTypes.array,
  searchBar: PropTypes.object,
  handleChangeSearchBar: PropTypes.func,
  history: PropTypes.object,
};

export default withRouter(Home);
