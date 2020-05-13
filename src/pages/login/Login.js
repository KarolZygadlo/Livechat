import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import firebase from '../../services/firebase';
import LoginString from '../login/LoginStrings';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

export default class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state={
            isLoading : true,
            email: "",
            password: ""
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    componentDidMount() {
        if(localStorage.getItem(LoginString.ID)) {
            this.setState({isLoading: false}, ()=> {
                this.setState({isLoading: false})
                this.props.showToast(1, 'Login success')
                this.props.history.push('./chat')
            })
        }else {
            this.setState({isLoading: false})
        }
    }

    passwordReset =()=> {
        firebase.auth().sendPasswordResetEmail(this.state.email).catch(function(error){
            if(error != null){
                document.getElementById('1').innerHTML=error;
            }
        })
        document.getElementById('1').innerHTML="Check your email, to change the password";
        
        
    }

    async handleSubmit(event) {
        event.preventDefault();

        await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(async result => {
            let user = result.user;
            if(user) {
                await firebase.firestore().collection('users')
                .where('userId' , "==", user.uid)
                .get()
                .then(function(querySnapshot){
                    querySnapshot.forEach(function(doc) {
                        const currentdata = doc.data()
                        localStorage.setItem(LoginString.FIREBASEDOCUMENTID, doc.id);
                        localStorage.setItem(LoginString.ID, currentdata.userId);
                        localStorage.setItem(LoginString.NICKNAME, currentdata.nickname);
                        localStorage.setItem(LoginString.EMAIL, currentdata.email);
                        localStorage.setItem(LoginString.PHOTO_URL, currentdata.avatar);
                    })
                })
            }
            this.props.history.push('./chat')
        }).catch(function(error) {
            document.getElementById('1').innerHTML= error
        })
    }

    render() {

        return(

            <div>
            <Container className="mt-5">
            <Form onSubmit={this.handleSubmit}> 
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control name="email" type="email" placeholder="Enter email" onChange={this.handleChange} value={this.state.email} required/>
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" type="password" placeholder="Password" onChange={this.handleChange} value={this.state.password} required/>
            </Form.Group>
            <Button variant="primary" type="submit">
                Login
            </Button>
            <div className="mt-2">
            <Button variant="primary" onClick={() => {this.passwordReset()}}>
                Password Reset
            </Button>
            </div>
            <div class="mt-5">
            <p style={{color: 'grey'}}>Don't have account?</p>
                <Link to="/signup">
                    Sign Up
                </Link>
            </div>
            <div class="">
                <Link to="/">
                    Go back
                </Link>
            </div>   
            <div>
                <p id='1' style={{color:'red'}}></p>
            </div>

            </Form>
            </Container>
            
            </div>

        )  
    }


}
