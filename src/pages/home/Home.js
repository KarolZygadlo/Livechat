import React, {Component} from 'react'
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Container from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';


export default class Home extends Component {

    render() {
        return (
                <div>
                <Container className="mt-5 text-center">
                <div>
                    <h1>
                    <Badge variant="secondary">Welcome to Desktop Chat Application</Badge>
                    </h1>
                </div>
                <div className="mt-5">
                <Link to="/login">
                <button type="button" class="btn btn-primary btn-lg btn-block">Login to application</button>
                </Link>
                </div>
                </Container>
                </div>
        )
    }
}