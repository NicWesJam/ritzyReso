import PropTypes from "prop-types";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import LoginOrUser from "./LoginOrUser.js";
import { LinkContainer } from "react-router-bootstrap";

function RitzyResoNavBar({ address, isAuthenticated, handleLogin }) {
  return (
    <Navbar bg="dark" variant="dark" fixed="top">
      <LinkContainer to="/">
        <Navbar.Brand>RitzyReso</Navbar.Brand>
      </LinkContainer>
      <Nav activeKey="dummy">
        <LinkContainer to="/marketplace">
          <Nav.Link>Marketplace</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/about">
          <Nav.Link>About</Nav.Link>
        </LinkContainer>
      </Nav>
      <Nav className="ml-auto">
        <LoginOrUser handleLogin={handleLogin} address={address} isAuthenticated={isAuthenticated} />
      </Nav>
    </Navbar>
  );
}

RitzyResoNavBar.propTypes = {
  address: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  handleLogin: PropTypes.func,
};

export default RitzyResoNavBar;
