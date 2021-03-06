import React from 'react';
import './Profile.css';
import ReactLoading from 'react-loading';
import 'react-toastify/dist/ReactToastify.css';
import firebase from '../../services/firebase';
import images from '../../projectImages/ProjectImages';
import LoginString from '../login/LoginStrings';
import { passwordReset } from '../../services/passwordReset';
import { checkNotifications } from '../../services/notifications';

export default class Profile extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            id: localStorage.getItem(LoginString.ID),
            nickname: localStorage.getItem(LoginString.NICKNAME),
            photoUrl: localStorage.getItem(LoginString.PHOTO_URL),
            documentKey: localStorage.getItem(LoginString.FIREBASEDOCUMENTID)
        }
        this.newAvatar = null
        this.newPhotoUrl = ''
        this.email = localStorage.getItem(LoginString.EMAIL);
    }

    componentDidMount () {
        checkNotifications(this.state.id)
    }

    onChangeNickname = event => {
        this.setState({nickname: event.target.value})
    }

    onChangeAvatar = event => {
        if (event.target.files && event.target.files[0]) {
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf(LoginString.PREFIX_IMAGE) !== 0) {
                this.props.showToast(0, 'This file is not an image')
                return
            }
            this.newAvatar = event.target.files[0]
            this.setState({photoUrl: URL.createObjectURL(event.target.files[0])})
        } else {
            this.props.showToast(0, 'Something wrong with input file')
        }
    }

    uploadAvatar = () => {
        this.setState({isLoading: true})
        if (this.newAvatar) {
            const uploadTask = firebase.storage()
                .ref()
                .child(this.state.id)
                .put(this.newAvatar)
            uploadTask.on(
                LoginString.UPLOAD_CHANGED,
                null,
                err => {
                    this.props.showToast(0, err.message)
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        this.updateUserInfo(true, downloadURL)
                    })
                }
            )
        } else {
            this.updateUserInfo(false, null)
        }
    }

    updateUserInfo = (isUpdatePhotoUrl, downloadURL) => {
        let newInfo
        if (isUpdatePhotoUrl) {
            newInfo = {
                nickname: this.state.nickname,
                avatar: downloadURL
            }
        } else {
            newInfo = {
                nickname: this.state.nickname
            }
        }
        firebase.firestore()
            .collection('users')
            .doc(this.state.documentKey)
            .update(newInfo)
            .then(data => {
                localStorage.setItem(LoginString.NICKNAME, this.state.nickname)
                if (isUpdatePhotoUrl) {
                    localStorage.setItem(LoginString.PHOTO_URL, downloadURL)
                }
                this.setState({isLoading: false})
                this.props.showToast(1, 'Update info success')
            })
    }

    render() {
        return (
            <div className="root">
                <div className="header">
                    <span>PROFILE</span>
                </div>

                <img className="avatar" alt="Avatar" src={this.state.photoUrl}/>

                <div className="viewWrapInputFile">
                    <img
                        className="imgInputFile"
                        alt="icon gallery"
                        src={images.choosefile}
                        onClick={() => this.refInput.click()}
                    />
                    <input
                        id="photoInput"
                        ref={el => {
                            this.refInput = el
                        }}
                        accept="image/*"
                        className="viewInputFile"
                        type="file"
                        onChange={this.onChangeAvatar}
                    />
                </div>

                <span className="textLabel">Nickname:</span>
                <input
                    id="nicknameInput"
                    className="textInput"
                    value={this.state.nickname ? this.state.nickname : ''}
                    placeholder="Your nickname..."
                    onChange={this.onChangeNickname}
                />

                <div>
                <p id='1' style={{color:'red'}}></p>
                </div>

                <button id="buttonUpdate" className="btnUpdate" onClick={this.uploadAvatar}>
                    UPDATE
                </button>

                <button id="buttonReset" className="btnback" onClick={() => {passwordReset(this.email)}}>
                Reset your password
                </button>

                <button id="buttonBack" className="btnback" onClick={() => this.props.history.goBack()}>
                BACK
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