import React, {Component} from 'react'
import Header from '../blocks/Header';
import './Home.css';
import { Link } from 'react-router-dom';
import firebase from '../../services/firebase';
import LoginString from '../login/LoginStrings';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactLoading from 'react-loading'
import 'react-toastify/dist/ReactToastify.css'


export default class Home extends Component {
    constructor(props) {
        super(props)
        this.provider = new firebase.auth.GoogleAuthProvider()
        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        this.checkLogin()
    }

    checkLogin = () => {
        if (localStorage.getItem(LoginString.ID)) {
            this.setState({isLoading: false}, () => {
                this.setState({isLoading: false})
                this.props.history.push('./chat')
            })
        } else {
            this.setState({isLoading: false})
        }
    }
    onLoginPress = () => {
        this.setState({isLoading: true})
        firebase
            .auth()
            .signInWithPopup(this.provider)
            .then(async result => {
                let user = result.user
                if (user) {
                    const result = await firebase.firestore()
                        .collection('users')
                        .where(LoginString.ID, '==', user.uid)
                        .get()

                    if (result.docs.length === 0) {
                        firebase.firestore()
                            .collection('users')
                            .doc(user.uid)
                            .set({
                                id: user.uid,
                                nickname: user.displayName,
                                photoUrl: user.photoURL
                            })
                            .then(data => {
                                // Write user info to local
                                localStorage.setItem(LoginString.ID, user.uid)
                                localStorage.setItem(LoginString.NICKNAME, user.displayName)
                                localStorage.setItem(LoginString.PHOTO_URL, user.photoURL)
                                this.setState({isLoading: false}, () => {
                                    this.props.history.push('./chat')
                                })
                            })
                    } else {
                        localStorage.setItem(LoginString.ID, result.docs[0].data().id)
                        localStorage.setItem(
                            LoginString.NICKNAME,
                            result.docs[0].data().nickname
                        )
                        localStorage.setItem(
                            LoginString.PHOTO_URL,
                            result.docs[0].data().photoUrl
                        )
                        this.setState({isLoading: false}, () => {
                            this.props.history.push('./chat')
                        })
                    }
                } else {
                    this.props.showToast(0, 'User info not available')
                }
            })
            .catch(err => {
                this.props.showToast(0, err.message)
                this.setState({isLoading: false})
            })
    }

    render() {
        return (
            <div className="viewRoot">
                <div className="header">CHAT APP DESKTOP</div>
                <button className="btnLogin" type="submit" onClick={this.onLoginPress}>
                    SIGN IN WITH GOOGLE
                </button>

                {this.state.isLoading ? (
                    <div className="viewLoading">
                        <ReactLoading
                            type={'spin'}
                            color={'#203152'}
                            height={'3%'}
                            width={'3%'}
                        />
                    </div>
                ) : null}
            </div>
        )
    }
}
