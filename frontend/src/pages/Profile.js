import React from "react";
import PropTypes from "prop-types";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";

import PhoneInput from "react-phone-input-2";
// import 'react-phone-input-2/lib/style.css'
import "react-phone-input-2/lib/bootstrap.css";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      phoneNumber: "",
      username: "",
      firstName: "",
      lastName: "",

      formEditable: false,

      formEmail: "",
      formPhoneNumber: "",
      formFirstName: "",
      formLastName: "",

      error: "",
      success: "",

      csrf: "",
    };
  }

  getUserDetail = async () => {
    await fetch("/api/user_detail/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("GET successful:");
        console.log(data.phone_number);

        let phone_number = data.phone_number;
        if (phone_number == null) {
          phone_number = "1";
        }
        this.setState({
          username: data.username,
          email: data.email,
          phoneNumber: phone_number,
          firstName: data.first_name,
          lastName: data.last_name,

          formEmail: data.email,
          formPhoneNumber: phone_number,
          formFirstName: data.first_name,
          formLastName: data.last_name,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getCSRF = async () => {
    await fetch("/api/csrf/", {
      credentials: "same-origin",
    })
      .then((res) => {
        let csrfToken = res.headers.get("X-CSRFToken");
        this.setState({ csrf: csrfToken });
        console.log("csrfToken " + csrfToken);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  formSubmit = async (event) => {
    event.preventDefault();
    console.log(this.props.csrf);
    // Check for differences
    await this.getCSRF();
    // Post data
    console.log(this.state);
    await fetch("/api/user_detail/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": this.state.csrf,
      },
      credentials: "same-origin",
      body: JSON.stringify({
        username: this.state.username,
        email: this.state.formEmail,
        phone_number: this.state.formPhoneNumber,
        first_name: this.state.formFirstName,
        last_name: this.state.formLastName,
      }),
    })
      .then(this.isResponseOk)
      .then((data) => {
        console.log(data);
        console.log(this.state);
        this.setState({
          email: this.state.formEmail,
          phoneNumber: this.state.formPhoneNumber,
          firstName: this.state.formFirstName,
          lastName: this.state.formLastName,
          success: "Profile update successful",
          error: "",
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: "Error updating profile", success: "" });
      });
  };

  componentDidMount = async () => {
    this.getUserDetail();
  };

  render() {
    return (
      <div>
        <Row>
          <Col></Col>
          <Col md={7}>
            <Container className="bg-light" fluid="xs" style={{ margin: "20px", padding: "10px" }}>
              <h2 className="text-center">Profile</h2>
              <Form onSubmit={this.formSubmit}>
                <Form.Group as={Row} className="mb-3" controlId="formUsername">
                  <Form.Label column sm="2">
                    Ethereum Address:
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control plaintext readOnly defaultValue={this.state.username} />
                    <Form.Text className="text-muted">
                      This value can only be changed by signing in with a different address
                    </Form.Text>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formEmail">
                  <Form.Label column sm="2">
                    Email:
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="email"
                      readOnly={this.state.formEditable}
                      defaultValue={this.state.email}
                      onChange={(e) => this.setState({ formEmail: e.target.value })}
                    />
                    <Form.Text className="text-muted">
                      Your email will be shared with restaurants to facilitate your booking
                    </Form.Text>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formPhoneNumber">
                  <Form.Label column sm="2">
                    Phone number:
                  </Form.Label>
                  <Col sm="10">
                    <PhoneInput
                      // country={"ca"}
                      onlyCountries={["ca"]}
                      // preferredCountries={["ca", "us"]}
                      countryCodeEditable={false}
                      disableSearchIcon={false}
                      value={this.state.phoneNumber}
                      //value={"12"}
                      onChange={(phone) => this.setState({ formPhoneNumber: phone })}
                    />
                    <Form.Text className="text-muted">
                      Your phone number will be shared with restaurants to facilitate your booking
                    </Form.Text>
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formFirstName">
                  <Form.Label column sm="2">
                    First name:
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="text"
                      readOnly={this.state.formEditable}
                      defaultValue={this.state.firstName}
                      onChange={(e) => this.setState({ formFirstName: e.target.value })}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3" controlId="formLastName">
                  <Form.Label column sm="2">
                    Last name:
                  </Form.Label>
                  <Col sm="10">
                    <Form.Control
                      type="text"
                      readOnly={this.state.formEditable}
                      defaultValue={this.state.lastName}
                      onChange={(e) => this.setState({ formLastName: e.target.value })}
                    />
                  </Col>
                </Form.Group>
                <div className="text-center">
                  <Button variant="primary" type="submit">
                    Save Changes
                  </Button>
                  <h6 className="text-success">{this.state.success}</h6>
                  <h6 className="text-danger">{this.state.error}</h6>
                </div>
              </Form>
            </Container>
          </Col>
          <Col></Col>
        </Row>
      </div>
    );
  }
}

Profile.propTypes = {
  csrf: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  handleLogin: PropTypes.func,
};

export default Profile;
