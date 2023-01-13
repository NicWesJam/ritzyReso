import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
class LogoutPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logoutOccured: false,
    };
  }

  componentDidMount = async () => {
    // Calling crypto token will ensure a user is created for the relevant session
    await this.logout();
  };

  logout = async () => {
    await fetch("/api/logout", {
      credentials: "same-origin",
    })
      .then(this.isResponseOk)
      .then((data) => {
        console.log(data);
        this.setState({ logoutOccured: true });
        this.props.changeAuthStatus(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    if (this.state.logoutOccured) {
      return (
        <div>
          <Row lg={3}>
            <Col></Col>
            <Col>
              <Container style={{ padding: "10px" }}>
                <h5 className="text-center">Signout complete</h5>
                <div className="text-center">
                  <LinkContainer to="/signout">
                    <Button
                      onClick={() => {
                        window.location = "/";
                      }}
                    >
                      Back to Home Page
                    </Button>
                  </LinkContainer>
                </div>
              </Container>
            </Col>
            <Col></Col>
          </Row>
        </div>
      );
    } else {
      return (
        <div>
          <h5>Signout in process... </h5>
        </div>
      );
    }
  }
}

LogoutPage.propTypes = {
  changeAuthStatus: PropTypes.func,
};

export default LogoutPage;
