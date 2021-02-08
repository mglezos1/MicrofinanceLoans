import React from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import Logo from './img/logobcmloantittle.png';

class Borrower extends React.Component {
    constructor(props) {
        super(props);
        this.state = {  
            valName:"",
            valLastName:"",
            valEmail:"",
        }
        this.clickSubmit = this.clickSubmit.bind(this);
    }

    clickSubmit (event) {
        event.preventDefault(); 
        let url ='http://localhost:8000/save'
        console.log("Name",this.state.valName)
        console.log("Lastname",this.state.valLastName)
        console.log("Email",this.state.valEmail)
        let data = {
            valName: this.state.valName,
            valLastName: this.state.valLastName,
            valEmail: this.state.valEmail
        }
        fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers:{
              'Content-Type': 'application/json'
            }
          }).then(res => res.json())

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
                <Row style={{background: "#FAFAFA"}} >
                <Col>
                        <Form>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text"
                                value={this.state.valName}
                                onChange={e => this.setState({ valName: e.target.value })}
                            />
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text"
                                value={this.state.valLastName}
                                onChange={e => this.setState({ valLastName: e.target.value })}
                            />
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" placeholder="name@example.com" 
                                value={this.state.valEmail}
                                onChange={e => this.setState({ valEmail: e.target.value })}
                            />
                            <Form.Label>What is your average monthly income?</Form.Label>
                            <Form.Control as="select">
                                <option>500 to 1000</option>
                                <option>1000 to 2000</option>
                                <option>2000 to 3000</option>
                                <option>3000 to 4000</option>
                                <option>More than 4000</option>
                            </Form.Control>
                            <Form.Group controlId="formRequestLoan">
                                <Form.Label>What is the request loan value?</Form.Label>
                                <Form.Control type="number"  />
                            </Form.Group>
                            <Row>
                            <Col><Button variant="primary" size="lg" type="reset">
                                Reset
                            </Button>
                            <Button onClick={this.clickSubmit} variant="primary" size="lg" type="submit" style={({ marginLeft: '0.8rem' })}>
                                Submit
                            </Button></Col>
                            <Col></Col></Row>
                        </Form>
                    </Col>
                </Row>
            </Container>  
            
        );
    }
}
 
export default Borrower;