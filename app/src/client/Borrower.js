import React from 'react';
import { Button, Container, Row, Col, Form, Modal } from 'react-bootstrap';
import Logo from './img/logobcmloantittle.png';
import './css/base.css';
import Web3 from 'web3';


var url = "http://127.0.0.1:7545";
var abi = [
    {
          "inputs": [
              {
                  "internalType": "bytes4",
                  "name": "symbol",
                  "type": "bytes4"
              },
              {
                  "internalType": "uint256",
                  "name": "price",
                  "type": "uint256"
              },
              {
                  "internalType": "uint256",
                  "name": "volume",
                  "type": "uint256"
              }
          ],
          "name": "setStock",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
      },
      {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
      },
      {
          "inputs": [
              {
                  "internalType": "bytes4",
                  "name": "symbol",
                  "type": "bytes4"
              }
          ],
          "name": "getStockPrice",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      },
      {
          "inputs": [
              {
                  "internalType": "bytes4",
                  "name": "symbol",
                  "type": "bytes4"
              }
          ],
          "name": "getStockVolume",
          "outputs": [
              {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
              }
          ],
          "stateMutability": "view",
          "type": "function"
      }
  ];
class Borrower extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            accounts: [],
            valueBorrower:'',
            valueLender:'',
            borrowerLoan:'',
            valueLoan:'',
            rateLoan:'',
            valueBorrowerLoan:'',
            rateBorrower:'',
            showAlert: false,
        }
        this.clickSubmit = this.clickSubmit.bind(this);
        this.handleChangeSelectLender = this.handleChangeSelectLender.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount(){
        let provider = new Web3(new Web3.providers.HttpProvider(url));
        provider.eth.getAccounts().then((accounts) => {
            this.setState({accounts: accounts});
        })
        /*
        let AddressOwner = "0x940AabB2f41bd20Ab7048e04EFB3638af3497b8d"
        let contractAddress = "0x6D5d0392c5E7330bC947D1Cd72460B5Ba2661005";
        let contractInstance = new Web3.eth.Contract(abi, contractAddress);*/
        fetch("http://localhost:8000/rates").then(result=>result.json()).then(result => {
            console.log(`Rate: ${result.rate}`);
            console.log(`Date: ${result.date}`);
            this.setState({rateBorrower: result.rate});
        });
        
        //sbVoyriisY6fszmUcehV
    }

    handleClose (event){
        this.setState({showAlert: false});
    } 

    handleChangeSelect(event) {
        this.setState({valueBorrower: event.target.value});
    }

    handleChangeSelectLender(event) {
        this.setState({valueLender: event.target.value});
    }

    clickSubmit (event) {
        event.preventDefault(); 
        this.setState({
            showAlert:true,
            borrowerLoan: this.state.valueBorrower, 
            valueLoan: this.state.valueBorrowerLoan, 
            rateLoan: this.state.rateBorrower,
            valueBorrowerLoan: "",
            valueBorrower:"",
            rateBorrower: "",
        });
    }


    render() { 
        return (
            <Container fluid="md" style={{marginTop: "25px"}}>
                <Row style={{background: "#"}} >
                    <Col style={{display: "inline-flex"}}>
                        <h2 style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "#1261A0"
                            }}>REQUEST LOAN</h2>
                    </Col><Col style={{
                                display: "contents",
                            }}>
                        <img src={Logo} alt="Logo"/>
                    </Col>
                </Row>
                <Row className="TitleText">
                    <Col className="Centertext" >BORROWER</Col>
                    <Col className="Centertext">LENDER</Col>
                </Row>
                <Row style={{background: "#FAFAFA"}} >
                    <Col><Container>
                        <Form>
                            <Form.Label className="marginTop15">Account borrower</Form.Label>
                            <Form.Control as="select" value={this.state.valueBorrower} onChange={this.handleChangeSelect}>
                                <option value=''>Select an option</option>
                                <option value={this.state.accounts[0]}>{this.state.accounts[0]}</option>
                                <option value={this.state.accounts[1]}>{this.state.accounts[1]}</option>
                                <option value={this.state.accounts[2]}>{this.state.accounts[2]}</option>
                                <option value={this.state.accounts[3]}>{this.state.accounts[3]}</option>
                                <option value={this.state.accounts[4]}>{this.state.accounts[4]}</option>
                            </Form.Control>
                            <Form.Label className="marginTop15">What is the request loan value?</Form.Label>
                            <Form.Control type="number" value={this.state.valueBorrowerLoan} onChange={e=>this.setState({valueBorrowerLoan: e.target.value})} />
                            <Form.Label className="marginTop15">Rate loan</Form.Label>
                            <Form.Control type="text" value={this.state.rateBorrower} disabled />
                            <Row className="marginTop15"><Col>
                                <Button variant="primary" size="lg" type="reset">Reset</Button>
                                <Button onClick={this.clickSubmit} variant="primary" size="lg" type="submit" style={({ marginLeft: '0.8rem' })}>
                                Submit
                            </Button>
                            </Col></Row>
                        </Form>
                    </Container></Col>
                <Col><Container>
                    <Form>
                        <Form.Label className="marginTop15">Account lender</Form.Label>
                        <Form.Control as="select" value={this.state.valueLender} onChange={this.handleChangeSelectLender}>
                            <option value=''>Select an option</option>
                            <option value={this.state.accounts[5]}>{this.state.accounts[5]}</option>
                            <option value={this.state.accounts[6]}>{this.state.accounts[6]}</option>
                            <option value={this.state.accounts[7]}>{this.state.accounts[7]}</option>
                            <option value={this.state.accounts[8]}>{this.state.accounts[8]}</option>
                            <option value={this.state.accounts[9]}>{this.state.accounts[9]}</option>
                        </Form.Control>
                        <Form.Label className="marginTop15">Account borrower</Form.Label>
                        <Form.Control type="text" value={this.state.borrowerLoan} disabled />
                        <Form.Label className="marginTop15">Value loan</Form.Label>
                        <Form.Control type="text" value={this.state.valueLoan} disabled />
                        <Form.Label className="marginTop15">Rate loan</Form.Label>
                        <Form.Control type="text" value={this.state.rateLoan} disabled />
                        <Button className="marginTop15" onClick={this.clickApprove} variant="primary" size="lg" type="submit">
                            Approve 
                        </Button>
                    </Form>
                </Container></Col>
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
            </Container>   
        );
    }
}
 
export default Borrower;