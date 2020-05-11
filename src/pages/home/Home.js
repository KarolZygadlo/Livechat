import React, {Component} from 'react'
import Header from '../blocks/Header';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

export default class Home extends Component {

    render() {
        return (
                <div>
                <Header/>
                <Container className="mt-5">
                <Button variant="primary" type="submit">
                <Link to="/login">
                    Go to login page
                </Link>
                </Button>
                </Container>
                </div>
        )
    }
}