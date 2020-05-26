import React from 'react';
import {Card} from 'react-bootstrap';
import ReactLoading from 'react-loading';
import 'react-toastify/dist/ReactToastify.css';
import firebase from '../../services/firebase';
import images from '../../projectImages/ProjectImages';
import './Groupchat.css';
import LoginString from '../login/LoginStrings';
import 'bootstrap/dist/css/bootstrap.min.css';
import { deleteMessage } from '../../services/deleteMessage';
import { getNow } from '../../services/getNow';
import { randomUniqId } from '../../services/randomUniqId';


export default class Groupchat extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            inputValue:""
        }
        this.currentUserName = localStorage.getItem(LoginString.NICKNAME);
        this.currentUserId = localStorage.getItem(LoginString.ID);
        this.currentUserPhoto = localStorage.getItem(LoginString.PHOTO_URL); 
        this.stateChanged = localStorage.getItem(LoginString.UPLOAD_CHANGED);
        this.currentPeerGroup= this.props.currentPeerGroup
        this.groupChatId = null;
        this.listMessage = []
        this.currentPeerUserMessages= [];
        this.removeListener= null;
        this.currentPhotoFile = null;

    }

    componentDidUpdate() {
        this.scrollToBottom()
    }

    componentWillReceiveProps(newProps){
        if(newProps.currentPeerGroup){
            this.currentPeerGroup = newProps.currentPeerGroup
            this.getListHistory()
        }
    }
    componentDidMount(){
        this.getListHistory()
    }

    componentWillUnmount() {
        if (this.removeListener) {
            this.removeListener()
        }
    }

    getListHistory =()=>{
        if (this.removeListener) {
            this.removeListener()
        }
        this.listMessage.length = 0
        this.setState({isLoading: true})

        this.removeListener = firebase.firestore()
         .collection('groupchat')
         .doc(this.currentPeerGroup)
         .collection(this.currentPeerGroup)
         .orderBy('timestamp')
         .onSnapshot(
            querySnapshot => {
                this.listMessage = []
                querySnapshot.forEach(doc => {
                    this.listMessage.push(doc.data())

                 })
                 this.setState({isLoading: false})
             },
             err => {
                 this.props.showToast(0, err.toString())
             }
         )
        
    }

    onSendMessage =(content, type)=>{

        if (content.trim() === '') {
            return
        }

        const itemMessage ={
            messageId: randomUniqId(this.currentUserId),
            userId: this.currentUserId,
            nickname: this.currentUserName,
            message: content.trim(),
            table: this.currentPeerGroup,
            status: type,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }
        firebase.firestore()
        .collection('groupchat')
        .doc(this.currentPeerGroup)
        .collection(this.currentPeerGroup)
        .doc(getNow())
        .set(itemMessage)
        .then(() => {
            this.setState({inputValue: ''})
        })
        .catch(err => {
            this.props.showToast(0, err.toString())
        })

    }

    onChoosePhoto = event => {
        if (event.target.files && event.target.files[0]) {
            this.setState({isLoading: true})
            this.currentPhotoFile = event.target.files[0]
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf(LoginString.PREFIX_IMAGE) === 0) {
                this.uploadPhoto()
            } else {
                this.setState({isLoading: false})
                this.props.showToast(0, 'This file is not an image')
            }
        } else {
            this.setState({isLoading: false})
        }
    }

    uploadPhoto = () => {
        if (this.currentPhotoFile) {

            const uploadTask = firebase.storage()
                .ref(`privaterooms/${randomUniqId(this.currentUserId)}_${this.currentPhotoFile['name']}`)
                .put(this.currentPhotoFile)

            uploadTask.on(
                LoginString.UPLOAD_CHANGED,
                null,
                err => {
                    this.setState({isLoading: false})
                    this.props.showToast(0, err.message)
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        this.setState({isLoading: false})
                        this.onSendMessage(downloadURL, 1)
                    })
                }
            )
        } else {
            this.setState({isLoading: false})
            this.props.showToast(0, 'File is null')
        }
    }

    onKeyboardPress = event => {
        if (event.key === 'Enter') {
            this.onSendMessage(this.state.inputValue, 0)
        }
    }

    scrollToBottom = () => {
        if (this.messagesEnd) {
            this.messagesEnd.scrollIntoView({})
        }
    }

    render() {
        return(
            <Card className="viewChatBoard">
                <div className="headerChatBoard">
                    <span className="textHeaderChatBoard">
                        <p style={{fontSize: '20px'}}>{this.currentPeerGroup}</p>
                    </span>

                </div>
                <div className="viewListContentChat">
                    {this.renderListMessage()}
                    <div 
                    style ={{float: 'left', clear: 'both'}}
                    ref={
                        el => {
                            this.messagesEnd = el
                        }
                    }
                    />
                </div>

                <div className="viewBottom">
                    <img
                        className="icOpenGallery"
                        src={images.sendPicture}
                        alt="icon open gallery"
                        onClick={() => this.refInput.click()}
                    />
                    <input
                        ref={el => {
                            this.refInput = el
                        }}
                        accept="image/*"
                        className="viewInputGallery"
                        type="file"
                        onChange={this.onChoosePhoto}
                    />
                    <input
                        className="viewInput"
                        placeholder="Type a message"
                        value={this.state.inputValue}
                        onChange={event => {
                            this.setState({inputValue: event.target.value})
                        }}
                        onKeyPress={this.onKeyboardPress}
                    />
                    <img
                        className="icSend"
                        src={images.sendMessage}
                        alt="icon send"
                        onClick={()=>{this.onSendMessage(this.state.inputValue, 0)}}
                    />

                    
                </div>
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

            </Card>
        )
    }

    renderListMessage = () => {
        if (this.listMessage.length > 0) {
            let viewListMessage = []
            this.listMessage.forEach((item, index) => {
                if (item.userId === this.currentUserId) {
                    if (item.status === 0 || item.status === 2) {
                        viewListMessage.push(
                            <div className="viewItemRight" key={item.timestamp} onClick={() => {deleteMessage('groupchat',item.messageId, this.currentPeerGroup)}}>
                                <span className="textContentItem">{item.message}</span>
                            </div>
                        )
                    } else {
                        viewListMessage.push(
                            <div className="viewItemRight2" key={item.timestamp} onClick={() => {deleteMessage('groupchat', item.messageId, this.currentPeerGroup)}}>
                                <img
                                    className="imgItemRight"
                                    src={item.message}
                                    alt="content message"
                                />
                            </div>
                        )
                    }
                } else {
                    if (item.status === 0 || item.status === 2) {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    <div className="viewItemLeft">
                                        <span className="textContentItem">{item.message}</span>
                                    </div>
                                </div>
                                    <span className="textTimeLeft">
                                    {item.nickname}   
                                    </span>
                            </div>
                        )
                    } else {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft2" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    <div className="viewItemLeft2">
                                        <img
                                            className="imgItemLeft"
                                            src={item.message}
                                            alt="content message"
                                        />
                                    </div>
                                </div>
                                    <span className="textTimeLeft"> {item.nickname}
                                    </span>
                            </div>
                        )
                    } 
                }
            })
            return viewListMessage
        } else {
            return (
                <div className="viewWrapSayHi">
                    <span className="textSayHi">Say hi to new friends</span>
                </div>
            )
        }
    }

}