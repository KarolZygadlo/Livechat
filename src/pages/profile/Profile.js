import React from 'react';
import './Profile.css';
import ReactLoading from 'react-loading';
import 'react-toastify/dist/ReactToastify.css';
import firebase from '../../services/firebase';
import images from '../../projectImages/ProjectImages';
import LoginString from '../login/LoginStrings';

export default class Profile extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            id: localStorage.getItem(LoginString.ID),
            nickname: localStorage.getItem(LoginString.NICKNAME),
            photoUrl: localStorage.getItem(LoginString.PHOTO_URL)
        }
        this.newAvatar = null
        this.newPhotoUrl = ''
    }

    componentDidMount() {
        this.checkLogin()
    }

    checkLogin = () => {
        if (!localStorage.getItem(LoginString.ID)) {
            this.props.history.push('/')
        }
    }

    onChangeNickname = event => {
        this.setState({nickname: event.target.value})
    }

    onChangeAvatar = event => {
        if (event.target.files && event.target.files[0]) {
            // Check this file is an image?
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
            .doc(this.state.id)
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
                    className="textInput"
                    value={this.state.nickname ? this.state.nickname : ''}
                    placeholder="Your nickname..."
                    onChange={this.onChangeNickname}
                />

                <button className="btnUpdate" onClick={this.uploadAvatar}>
                    UPDATE
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