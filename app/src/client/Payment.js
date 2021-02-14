import React from 'react';
import { Button, Container, Row, Col, Form, Modal } from 'react-bootstrap';
import Logo from './img/logobcmloantittle.png';
import './css/base.css';
const BigNumber = require("bignumber.js");
var {
    MAINABI,
    PROVIDER,
    MAINCONTRACADDRESS,
  } = window;
let contractInstance = new PROVIDER.eth.Contract(MAINABI,MAINCONTRACADDRESS);

class Payment  extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            accounts: [],
            selectBorrower:"",
            valueLoan: "",
            showAlert: false,
            showPayment0: false,
        }
        this.handleChangeBorrower = this.handleChangeBorrower.bind(this);
        this.handlePayment = this.handlePayment.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleClosePayment = this.handleClosePayment.bind(this);
    }

    handleClose(event) {
        this.setState({ 
            showAlert: false ,
            selectBorrower:"",
            valueLoan: "",
        });
    }

    handleClosePayment(event) {
        this.setState({ 
            showPayment0: false,
            selectBorrower:"",
            valueLoan: "",
        });
    }

    handleChangeBorrower(event){
        event.preventDefault();
        this.setState({valueLoan:0});
        this.setState({selectBorrower: event.target.value});
        contractInstance.methods.getLoanOwedAmt(event.target.value).call().then((val) => {
            if(val != 0 ){
                this.setState({
                    valueLoan: val,
                });
            }},
        ).catch((err) => {
            console.error(err);
            console.log(Object.keys(err));
        });
    }

    handlePayment(event){
        event.preventDefault();
        let _addressBorrower = this.state.selectBorrower;
        let _valueLoan = this.state.valueLoan;
        console.log("Borrower", _addressBorrower)
        console.log("BorroValuewer", _valueLoan)
        if(_valueLoan != 0){
            contractInstance.methods
            .paybackLoan(new BigNumber(_valueLoan))
            .send({ from: _addressBorrower, value: new BigNumber(_valueLoan), gas:3000000 })
            .then(
                (val) => {
                    console.log("Response:", val);
                    this.setState({ showAlert: true });
                }
            )
            .catch((err) => {
                console.error(err);
                console.log(Object.keys(err));
            });
        }else{
            this.setState({ 
                showPayment0: true ,
            });
        }
    }

    componentDidMount(){
        PROVIDER.eth.getAccounts().then((accounts) => {
            this.setState({accounts: accounts});
        });
    }
    render() { 
        return (  
            <Container fluid="md" style={{marginTop: "25px"}}>
                <Row className="TitleText">
                    <Col className="Centertext" >PAYMENT LOAN</Col>
                </Row>
                <Col><Container>
                    <Form>
                        <Form.Label className="marginTop15">Account borrower</Form.Label>
                        <Form.Control as="select" value={this.state.selectBorrower} onChange={this.handleChangeBorrower}>
                            <option value=''>Select an option</option>
                            <option value={this.state.accounts[0]}>{this.state.accounts[0]}</option>
                            <option value={this.state.accounts[1]}>{this.state.accounts[1]}</option>
                            <option value={this.state.accounts[2]}>{this.state.accounts[2]}</option>
                            <option value={this.state.accounts[3]}>{this.state.accounts[3]}</option>
                            <option value={this.state.accounts[4]}>{this.state.accounts[4]}</option>
                        </Form.Control>
                        <Form.Label className="marginTop15">Value Loan</Form.Label>
                        <Form.Control type="text" value={this.state.valueLoan} disabled/>
                        <Button
                            className="marginTop15"
                            onClick={this.handlePayment}
                            variant="primary"
                            size="lg"
                            type="submit">Pay loan
                        </Button>
                    </Form>
                </Container></Col>
                <Modal show={this.state.showAlert} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Transaction successful</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Your payment was successful</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                        Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showPayment0} onHide={this.handleClosePayment}>
                    <Modal.Header closeButton>
                        <Modal.Title>Transaction failed</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>You do not have a loan</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClosePayment}>
                        Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}
 
export default Payment;