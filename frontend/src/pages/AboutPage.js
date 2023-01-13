import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

function AboutPage() {
  return (
    <div>
      <Row>
        <Col></Col>
        <Col md={7}>
          <Container className="bg-light" fluid="xs" style={{ margin: "20px", padding: "10px" }}>
            <h2 className="text-center">About</h2>
            <p>
              Very fun project!
            </p>
          </Container>
        </Col>
        <Col></Col>
      </Row>
    </div>
  );
}

export default AboutPage;
