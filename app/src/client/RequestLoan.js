import React from "react";
import { withRouter } from 'react-router';
import { Button, Container, Row, Col, Form, Modal,Nav } from "react-bootstrap";
import Logo from "./img/logobcmloantittle.png";
import "./css/base.css";
const BigNumber = require("bignumber.js");
var {
  URL,
  ABI,
  MAINABI,
  PROVIDER,
  ADRESSOWNER,
  CONTRACTADDRESS,
  MAINCONTRACADDRESS,
} = window;

class RequestLoan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accounts: [],
      valueBorrower: "",
      valueLender: "",
      borrowerLoan: "",
      valueLoan: "",
      rateLoan: "",
      valueBorrowerLoan: "",
      rateBorrower: "",
      showAlert: false,
      showAlertLoan: false,
      showAlertSuccessful:false,
    };
    this.clickSubmit = this.clickSubmit.bind(this);
    this.handleChangeSelectLender = this.handleChangeSelectLender.bind(this);
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.clickApprove = this.clickApprove.bind(this);
    this.handleCloseLoan = this.handleCloseLoan.bind(this);
    this.handleCloseSuccessful = this.handleCloseSuccessful.bind(this);
  }

  componentDidMount() {
    window.PROVIDER.eth.getAccounts().then((accounts) => {
      this.setState({ accounts: accounts });
    });
    let contractInstance = new PROVIDER.eth.Contract(ABI, CONTRACTADDRESS);
    console.log("Contract:", contractInstance);
    fetch("http://localhost:8000/rates")
      .then((result) => result.json())
      .then((result) => {
        let valueRate = result.rate * 100;
        contractInstance.methods.setRate(valueRate).send({ from: ADRESSOWNER });
        contractInstance.methods
          .getRate()
          .call()
          .then((val) => {
            this.setState({ rateBorrower: val / 100 });
            //console.log("Get Stock Price:", val);
          });
      });

    //sbVoyriisY6fszmUcehV
  }

  handleCloseSuccessful(evet){
    this.setState({
        showAlertSuccessful: false,
    });
  }
  clickApprove(event) {
    event.preventDefault();
    let contractInstance = new PROVIDER.eth.Contract(
      MAINABI,
      MAINCONTRACADDRESS
    );
    let _addressBorrower = this.state.borrowerLoan;
    let _addressLender = this.state.valueLender;
    let _valueLoan = this.state.valueLoan;

    contractInstance.methods
      .confirmNewLoan(_addressBorrower, new BigNumber(_valueLoan))
      .send({ from: _addressLender, value: new BigNumber(_valueLoan), gas:3000000 })
      .then(
        (val) => {
            this.setState({
                showAlertSuccessful: true,
                borrowerLoan:  "",
                valueLoan: "",
                rateLoan: "",
                valueLender:"",
            });
        }
      )
      .catch((err) => {
        console.error(err);
        console.log(Object.keys(err));
      });
  }

  handleClose(event) {
    this.setState({ showAlert: false });
  }

  handleCloseLoan(event) {
    this.setState({ showAlertLoan: false });
  }
  

  handleChangeSelect(event) {
    this.setState({ valueBorrower: event.target.value });
    let contractInstance = new PROVIDER.eth.Contract(ABI, CONTRACTADDRESS);
    contractInstance.methods.getRate().call().then((val) => {
            this.setState({ rateBorrower: val / 100 });
            //console.log("Get Stock Price:", val);
    });
    this.setState({
        borrowerLoan: "",
        valueLoan: "",
        rateLoan: "",
    });
  }

  handleChangeSelectLender(event) {
    this.setState({ valueLender: event.target.value });
  }

  clickSubmit(event) {
    event.preventDefault();
    let contractInstancemain = new PROVIDER.eth.Contract(
      MAINABI,
      MAINCONTRACADDRESS
    );
    contractInstancemain.methods
      .getLoanOwedAmt(this.state.valueBorrower)
      .call()
      .then(
        (val) => {
          if(val != 0 ){
            this.setState({
                showAlertLoan: true,
            });
          }else{
            this.setState({
                showAlert: true,
                borrowerLoan: this.state.valueBorrower,
                valueLoan: this.state.valueBorrowerLoan,
                rateLoan: this.state.rateBorrower,
                valueBorrowerLoan: "",
                valueBorrower: "",
                rateBorrower: "",
            });
          }
          
        },
        function (reject) {
          console.log(reject); // Error!
        }
      );
  }

  Payment() {
    return <h2>Payment</h2>;
  }

  render() {
    return (
      <Container fluid="md" style={{ marginTop: "25px" }}>
        <Row className="TitleText">
          <Col className="Centertext">BORROWER</Col>
          <Col className="Centertext">LENDER</Col>
        </Row>
        <Row style={{ background: "#FAFAFA" }}>
          <Col>
            <Container>
              <Form>
                <Form.Label className="marginTop15">
                  Account borrower
                </Form.Label>
                <Form.Control
                  as="select"
                  value={this.state.valueBorrower}
                  onChange={this.handleChangeSelect}
                >
                  <option value="">Select an option</option>
                  <option value={this.state.accounts[0]}>
                    {this.state.accounts[0]}
                  </option>
                  <option value={this.state.accounts[1]}>
                    {this.state.accounts[1]}
                  </option>
                  <option value={this.state.accounts[2]}>
                    {this.state.accounts[2]}
                  </option>
                  <option value={this.state.accounts[3]}>
                    {this.state.accounts[3]}
                  </option>
                  <option value={this.state.accounts[4]}>
                    {this.state.accounts[4]}
                  </option>
                </Form.Control>
                <Form.Label className="marginTop15">
                  What is the request loan value?
                </Form.Label>
                <Form.Control
                  type="number"
                  value={this.state.valueBorrowerLoan}
                  onChange={(e) =>
                    this.setState({ valueBorrowerLoan: e.target.value })
                  }
                />
                <Form.Label className="marginTop15">Rate loan</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.rateBorrower}
                  disabled
                />
                <Row className="marginTop15">
                  <Col>
                    <Button variant="primary" size="lg" type="reset">
                      Reset
                    </Button>
                    <Button
                      onClick={this.clickSubmit}
                      variant="primary"
                      size="lg"
                      type="submit"
                      style={{ marginLeft: "0.8rem" }}
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Container>
          </Col>
          <Col>
            <Container>
              <Form>
                <Form.Label className="marginTop15">Account lender</Form.Label>
                <Form.Control
                  as="select"
                  value={this.state.valueLender}
                  onChange={this.handleChangeSelectLender}
                >
                  <option value="">Select an option</option>
                  <option value={this.state.accounts[5]}>
                    {this.state.accounts[5]}
                  </option>
                  <option value={this.state.accounts[6]}>
                    {this.state.accounts[6]}
                  </option>
                  <option value={this.state.accounts[7]}>
                    {this.state.accounts[7]}
                  </option>
                  <option value={this.state.accounts[8]}>
                    {this.state.accounts[8]}
                  </option>
                  <option value={this.state.accounts[9]}>
                    {this.state.accounts[9]}
                  </option>
                </Form.Control>
                <Form.Label className="marginTop15">
                  Account borrower
                </Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.borrowerLoan}
                  disabled
                />
                <Form.Label className="marginTop15">Value loan</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.valueLoan}
                  disabled
                />
                <Form.Label className="marginTop15">Rate loan</Form.Label>
                <Form.Control
                  type="text"
                  value={this.state.rateLoan}
                  disabled
                />
                <Button
                  className="marginTop15"
                  onClick={this.clickApprove}
                  variant="primary"
                  size="lg"
                  type="submit"
                >
                  Approve
                </Button>
              </Form>
            </Container>
          </Col>
        </Row>
        <Modal show={this.state.showAlert} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Transaction successful</Modal.Title>
          </Modal.Header>
          <Modal.Body>Your transaction will be process</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showAlertLoan} onHide={this.handleCloseLoan}>
          <Modal.Header closeButton>
            <Modal.Title>Transaction rejected</Modal.Title>
          </Modal.Header>
          <Modal.Body>Your transaction will not be processed because you have already a loan. </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseLoan}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showAlertSuccessful} onHide={this.handleCloseSuccessful}>
          <Modal.Header closeButton>
            <Modal.Title>Transaction successful</Modal.Title>
          </Modal.Header>
          <Modal.Body>Your transaction was successful</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseSuccessful}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}

export default RequestLoan;
