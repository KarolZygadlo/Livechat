import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../blocks/Header';
import "./Signup.css";
import firebase from '../../services/firebase';
import Card from 'react-bootstrap/Card';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LoginString from '../login/LoginStrings';
import md5 from 'md5';

export default class SignUp extends Component {

    constructor() {
        super();
        this.state = {
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
                    id:result.user.uid,
                    email,
                    password: md5(this.state.password),
                    photoURL:'',
                    messages:[{notificationId:"",number: 0}]
                }).then((docRef)=>{
                    localStorage.setItem(LoginString.ID, result.user.uid);
                    localStorage.setItem(LoginString.Nickname, nickname);
                    localStorage.setItem(LoginString.Email, email);
                    localStorage.setItem(LoginString.Password, password);
                    localStorage.setItem(LoginString.PhotoURL, "");
                    localStorage.setItem(LoginString.UPLOAD_CHANGED, 'state_changed');
                    localStorage.setItem(LoginString.FirebaseDocumentId, docRef.id);
                    this.setState({
                        name:'',
                        password:'',
                        photourl:'',
                    });
                    this.props.history.push("/chat")
                })
                .catch((error) => {
                    console.error("Error adding document", error)
                })
            })
        }
        catch(error) {
            document.getElementById('1').innerHTML = "Error in signing up please try again"
        }

    }

    render() {
        const Signinsee = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'White',
            backgroundColor: '#1ebea5',
            width: '100%',
            boxShadow: "0 5px 5px #808888",
            height: "10rem",
            paddingTop: "48px",
            opacity: "0.5",
            borderBottom: '5px solid green',
        }
        return(

            <div>
            <Header/>
            <CssBaseline/>
            <Card style={Signinsee}>
                <div>
                <Typography component="h1" variant="h5">
                    Sign Up
                    To
                </Typography>
                </div>
                <div>
                    <Link to="/">
                        <button class="btn"><i class="fa fa-home">WebChat</i></button>
                    </Link>
                </div>
            </Card>
            <Card className="formacontrooutside">
                <form className="customform" noValidate onSubmit={this.handleSubmit}>

                    <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="E-mail"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange={this.handleChange}
                    value={this.state.email}
                    />

                    <div>
                        <p style={{color: 'grey', fontSize: '15px', marginLeft: '0'}}>Password :length Greater than 6 (alphabet, number, special character)</p>
                    </div>

                    <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    autoFocus
                    onChange={this.handleChange}
                    value={this.state.password}
                    />

                    <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="nickname"
                    label="Nickname"
                    name="nickname"
                    autoComplete="nickname"
                    autoFocus
                    onChange={this.handleChange}
                    value={this.state.nickname}
                    />

                    <div>
                        <p style={{color: 'grey', fontSize: '15px', marginLeft: '0'}}>Please fill all fields</p>
                    </div>
                    <div className="CenterAliningItems">
                        <button class="button1" type="submit">
                            <span>Sign Up</span>
                        </button>
                    </div>
                    <div>
                        <p style={{color: 'grey'}}>Alredy have an account?</p>
                        <Link to="/login">
                            Go to login page
                        </Link>
                    </div>
                    <div className="error">
                        <p id='1' style={{color: 'red'}}></p>
                    </div>






                </form>



            </Card>
            
            
            
            </div>

        ) 

        
    }


}