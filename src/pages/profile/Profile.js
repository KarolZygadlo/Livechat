import React from 'react';
import './Profile.css';
import ReactLoading from 'react-loading';
import 'react-toastify/dist/ReactToastify.css';
import firebase from '../../services/firebase';
import images from '../../projectImages/ProjectImages';
import LoginString from '../login/LoginStrings';

export default class Profile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            documentKey: localStorage.getItem(LoginString.FirebaseDocumentId),
            id: localStorage.getItem(LoginString.ID),
            nickname: localStorage.getItem(LoginString.Nickname),
            photoURL: localStorage.getItem(LoginString.PhotoURL),
        }
        this.newPhoto = null
        this.newPhotoUrl = ""
    }

    componentDidMount(){
        if(!localStorage.getItem(LoginString.ID)){
            this.props.history.push("/")
        }
    }

    onChangeNickname =(event)=>{
        this.setState({
            nickname: event.target.value
        })
    }

    onChangeAvatar =(event)=>{
        if(event.target.files && event.target.files[0]){
            const prefixFiletype = event.target.files[0].type.toString()
            if(prefixFiletype.indexOf(LoginString.PREFIX_IMAGE) !== 0){
                this.props.showToast(0, "This file is not an image")
                return
            }
            this.newPhoto = event.target.files[0]
            this.setState({photoURL: URL.createObjectURL(event.target.files[0])})
        }else{
            this.props.showToast(0, "Something went wrong")
        }
    }

    uploadAvatar =()=>{
        this.setState({isLoading: true})
        if(this.newPhoto){
            const uploadTask = firebase.storage()
            .ref()
            .child(this.state.id)
            .put(this.newPhoto)
            uploadTask.on(
                LoginString.UPLOAD_CHANGED,
                null,
                err =>{
                    console.log('fail')
                },
                ()=>{
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL =>{
                        this.updateUserInfo(true, downloadURL)
                        
                    })
                }
            )
        }else{
            this.updateUserInfo(false, null)
        }
    }

    updateUserInfo =(isUpdatedPhotoURL, downloadURL)=>{
        let newinfo
        if(isUpdatedPhotoURL){
            newinfo={
                nickname: this.state.nickname,
                photoURL: downloadURL
            }
        }else{
            newinfo={
                nickname: this.state.nickname
            }
        }
        firebase.firestore().collection('users')
        .doc(this.state.documentKey)
        .update(newinfo)
        .then(() =>{
            localStorage.setItem(LoginString.Nickname, this.state.nickname)
            if(isUpdatedPhotoURL){
            localStorage.setItem(LoginString.PhotoUrl, downloadURL)
            }
            this.setState({isLoading: false})
            this.props.showToast(1, 'Update info success')
        })
    }

    render() {
        return(
            <div className="profileroot">
                <div className="headerprofile">
                    <span>PROFILE</span>
                </div>
                <img className="avatar" alt="" src={this.state.photoURL}/>
                <div className="viewWrapInputFile">
                    <img
                        className="imgInputFile"
                        alt=""
                        src={images.choosefile}
                        onClick = {()=>{this.refInput.click()}}
                    />
                    <input
                    ref = {el =>{
                        this.refInput = el
                    }}
                    accept = "image/*"
                    className="viewInputFile"
                    type="file"
                    onChange={this.onChangeAvatar}
                    />
                </div>
                <span className="textLabel">Name</span>
                <input
                    className="textInput"
                    value={this.state.nickname ? this.state.nickname : ""}
                    placeholder="Your nickname..."
                    onChange={this.onChangeNickname}
                />
                <div>
                    <button className="btnUpdate" onClick={this.uploadAvatar}>
                        SAVE
                    </button>
                    <button className="btnback" onClick={()=>{this.props.history.push('/chat')}}>
                        BACK
                    </button>
                </div>
                {this.state.isLoading ?(
                    <div>
                        <ReactLoading
                        type={'spin'}
                        color={'#203152'}
                        height={'3%'}
                        width={'3%'}
                        />
                    </div>
                ): null}
            </div>
        )
    }
}