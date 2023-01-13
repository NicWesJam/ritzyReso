import React from "react";
import PropTypes from "prop-types";
import ResoCard from "../common/ResoCard.js";
import Row from "react-bootstrap/Row";

class MyResos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resoList: [],
    };
  }

  async componentDidMount() {
    // Calling crypto token will ensure a user is created for the relevant session
    if (this.props.address != null) {
      await this.getMyResos();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.address !== this.props.address) {
      this.getMyResos();
    }
  }

  getMyResos = async () => {
    let url = new URL("https://www.ritzyreso.com/api/uri/v1/");
    // Convert date and time to unix timestamp
    console.log(this.props.address);
    let params = {
      address: this.props.address,
    };
    Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

    await fetch(url.pathname + url.search, {
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

  render() {
    if (this.props.address === null) {
      return (
        <div>
          <h2 className="text-center" style={{ marginTop: "5px" }}>
            My Ritzy Resos
          </h2>
          <Row className="justify-content-center">
            <h6 className="text-center">Loading...</h6>
          </Row>
        </div>
      );
    } else {
      return (
        <div>
          <h2 className="text-center" style={{ marginTop: "5px" }}>
            My Ritzy Resos
          </h2>
          <Row className="justify-content-center">
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
        </div>
      );
    }
  }
}

MyResos.propTypes = {
  address: PropTypes.string,
};

export default MyResos;
