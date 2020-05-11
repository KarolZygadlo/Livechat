import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import firebase from '../../services/firebase';
import LoginString from '../login/LoginStrings';
import md5 from 'md5';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

export default class SignUp extends Component {

    constructor() {
        super();
        this.state = {
            isLoading: false,
            email:"",
            password:"",
            nickname:"",
            error:null
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    async handleSubmit(event) {

        const{nickname,password,email} = this.state;
        event.preventDefault();
        try{
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(async result => {
                firebase.firestore().collection('users')
                .add({
                    nickname,
                    userId:result.user.uid,
                    email,
                    pwd: md5(this.state.password),
                    avatar:'',
                }).then((docRef)=>{
                    localStorage.setItem(LoginString.ID, result.user.uid);
                    localStorage.setItem(LoginString.NICKNAME, nickname);
                    localStorage.setItem(LoginString.EMAIL, email);
                    localStorage.setItem(LoginString.PWD, password);
                    localStorage.setItem(LoginString.PHOTO_URL, "");
                    localStorage.setItem(LoginString.FIREBASEDOCUMENTID, docRef.id);
                    this.setState({
                        name:'',
                        password:'',
                        photourl:'',
                    });
                    this.setState({isLoading: false})
                    this.props.history.push("/chat")
                }).catch(function(error) {
                    document.getElementById('1').innerHTML=error
                })
            }).catch(function(error) {
                document.getElementById('1').innerHTML = error
            })
        }catch(error) {
            console.log(error)
        }

    }

    render() {
        return(

            <div>
            <Container className="mt-5">
            <Form onSubmit={this.handleSubmit}> 
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control name="email" type="email" placeholder="Enter email" onChange={this.handleChange} value={this.state.email} required/>
                <Form.Text className="text-muted">
                We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" type="password" placeholder="Password" onChange={this.handleChange} value={this.state.password} required/>
            </Form.Group>
            <Form.Group controlId="formBasicNickname">
                <Form.Label>Nickname</Form.Label>
                <Form.Control name="nickname" type="text" placeholder="Nikcname" onChange={this.handleChange} value={this.state.nickname} required/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
            <div class="mt-5">
            <p style={{color: 'grey'}}>Alredy have an account?</p>
            <Link to="/login">
                Go to login page
            </Link>
            </div>
            <div>
                <p id='1' style={{color: 'red'}}></p>
            </div>
            </Form>
            </Container>
            
            </div>

        ) 

        
    }


}