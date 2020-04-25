import React, { Component } from 'reacts';
import {
    Route,
    BrowserRouter as Router,
    Switch,
    Redirect
} from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import Chat from './pages/chat/Chat';
import Profile from './pages/profile/Profile';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';
import firebase from './services/firebase';
import {toast , ToastContainer} from 'react-toastify';

class App extends Component {

    showToast = (type, message) => {
        switch (type) {
            case 0:
                toast.warning(message)
                break;
            case 1:
                toast.success(message)
                default:
                    break;    
        }
    }

    constructor() {
        super();
        this.state = {
            authenticated: false,
            loading: true
        };
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user =>{
            if(user){
                this.setState({
                    authenticated : true,
                    loading: false
                });
            }else{
                this.setState({
                    authenticated: false,
                    loading: false
                });
            }
        })
    }

    render() {
        return this.state.loading === true ? (
            <div className="spinner-border text-success" role= 'status'>
                <span className = "sr-only">Loading.....</span>
            </div>
        ): (
            <Router>
                <ToastContainer
                autoClose = {2000}
                hideProgressBar = {true}
                position = {toast.POSITION.BOTTOM_CENTER}
                />
                <Switch>
                    <Route
                    exact
                    path ="/"
                    render = { props => <Home {...props}/>}
                    />

                    <Route
                    path = "/login"
                    render = { props => <Login showToast={this.showToast}{...props} /> }
                    />

                    <Route
                    path = "/signup"
                    render = { props => <Signup showToast={this.showToast}{...props} /> }
                    />

                    <Route
                    path = "/profile"
                    render = { props => <Profile showToast={this.showToast}{...props} /> }
                    />

                    <Route
                    path = "/chat"
                    render = { props => <Chat showToast={this.showToast}{...props} /> }
                    />

                </Switch>

            </Router>
        )
    }
}