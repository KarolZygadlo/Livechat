import React, { Component } from 'react';
import {
    Route,
    BrowserRouter as Router,
    Switch
} from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import Chat from './pages/chat/Chat';
import Profile from './pages/profile/Profile';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';
import {toast , ToastContainer} from 'react-toastify';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import $ from 'jquery';
import Popper from 'popper.js';

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

    render() {
        return (
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
export default App