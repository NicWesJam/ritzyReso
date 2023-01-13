import Button from 'react-bootstrap/Button';

function Marketplace() {
  return (
    <div style={{ height: "100vh" }}>
      {/* <div
        dangerouslySetInnerHTML={{
          __html: `<iframe src='` + process.env.REACT_APP_OPENSEA_URL + `' 
          width="100%"
          style="min-height: 95vh; margin-top: 0; padding-top: 0;"
            />`,
        }}
      /> */}
      <Button href={process.env.REACT_APP_OPENSEA_URL} variant="primary" style={{marginTop:30}}>To Marketplace</Button>
    </div>
  );
}

export default Marketplace;
