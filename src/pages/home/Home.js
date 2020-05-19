import React, {Component} from 'react'
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Container from 'react-bootstrap/Container';

export default class Home extends Component {

    render() {
        return (
                <div>
                <Container className="mt-5 text-center">
                <div>
                    <h1>
                    Welcome to Desktop Chat Application
                    </h1>
                </div>
                <div className="mt-5">
                <Link to="/login">
                <button id="login-button" type="button" className="btn btn-primary btn-lg btn-block">Login to application</button>
                </Link>
                </div>
                </Container>
                </div>
        )
    }
}