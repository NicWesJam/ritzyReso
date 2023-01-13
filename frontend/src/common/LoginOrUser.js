import React from "react";
import PropTypes from "prop-types";

import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { LinkContainer } from "react-router-bootstrap";

class LoginOrUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shortenAddress(str) {
    if (str != null) {
      return str.substring(0, 6) + "..." + str.substring(38);
    } else {
      return "";
    }
  }

  render() {
    if (this.props.isAuthenticated) {
      return (
        <NavDropdown
          title={this.shortenAddress(this.props.address)}
          id="collasible-nav-dropdown"
        >
          <LinkContainer to="/my_resos">
            <NavDropdown.Item>My Ritzy Resos</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/profile">
            <NavDropdown.Item>Profile</NavDropdown.Item>
          </LinkContainer>
          <LinkContainer to="/logout">
            <NavDropdown.Item>Logout</NavDropdown.Item>
          </LinkContainer>
        </NavDropdown>
      );
    } else {
      return <Nav.Link onClick={this.props.handleLogin}>Login</Nav.Link>;
    }
  }
}

LoginOrUser.propTypes = {
  address: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  handleLogin: PropTypes.func,
};

export default LoginOrUser;
