import React, { Component } from 'react';
import {
    Route,
    BrowserRouter as Router,
    Switch,
    HashRouter
} from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import Chat from './pages/chat/Chat';
import Profile from './pages/profile/Profile';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';
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

    render() {
        return (
            <HashRouter>
                <div>
                <ToastContainer
                autoClose={2000}
                hideProgressBar={true}
                position={toast.POSITION.BOTTOM_RIGHT}
                />
                <Switch>
                    <Route
                    exact
                    path ="/"
                    render = { props => <Home {...props}/>}
                    />

                    <Route
                    exact
                    path = "/login"
                    render = { props => <Login showToast={this.showToast}{...props} /> }
                    />

                    <Route
                    exact
                    path = "/signup"
                    render = { props => <Signup showToast={this.showToast}{...props} /> }
                    />

                    <Route
                    exact
                    path = "/profile"
                    render = { props => <Profile showToast={this.showToast}{...props} /> }
                    />

                    <Route
                    exact
                    path = "/chat"
                    render = { props => <Chat showToast={this.showToast}{...props} /> }
                    />

                </Switch>
                </div>
            </HashRouter>
        )
    }
}
export default App