import React from 'react';
import Payment from './client/Payment';
import RequestLoan from './client/RequestLoan';
import { Nav, Container, Row, Col, Form, Modal, Navbar } from 'react-bootstrap';
import Logo from "./client/img/logobcmloantittle.png";
import "./client/css/base.css";

class App  extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
      panel: <RequestLoan/>,
    }
}
  clickmenu(key){
    if(key == 'linkRequest'){
      this.setState({panel: <RequestLoan/>})
    }
    if(key == 'linkPayment'){
      this.setState({panel: <Payment/>})
    }
  }

  render() { 
  return (
    <Container fluid="md" style={{marginTop: "25px"}}>
      <Row style={{background: "#"}} >
          <Col style={{display: "inline-flex"}}>
          </Col><Col style={{
                      display: "contents",
                  }}>
              <img src={Logo} alt="Logo"/>
          </Col>
      </Row>
      <Navbar bg="dark" variant="dark">
        <Nav className="mr-auto">
          <a className="navLink" onClick={this.clickmenu.bind(this, "linkRequest")}>Request</a>
          <a className="navLink"onClick={this.clickmenu.bind(this, "linkPayment")}>Payment</a>
        </Nav>
      </Navbar>
      <div>
        {this.state.panel}
      </div>
    </Container>
    );
  }
}

export default App;
