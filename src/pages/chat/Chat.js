import React from 'react';
import LoginString from "../login/LoginStrings";
import firebase from '../../services/firebase';
import './Chat.css';
import ReactDOM from 'react-dom';

export default class Chat extends React.Component {

    constructor(props) {
        super(props)
        this.state ={
            isLoading: true,
            isOpenDialogConfirmLogout: false,
            currentPeerUser: null,
            displayedContactSwitchedNotification:[],
            displayedContacts: []
        }
        this.currentUserName = localStorage.getItem(LoginString.Nickname);
        this.currentUserId = localStorage.getItem(LoginString.ID);
        this.currentUserPhoto = localStorage.getItem(LoginString.PhotoURL); 
        this.currentUserDocumentId = localStorage.getItem(LoginString.FirebaseDocumentId);

        this.currentUserMessages=[]
        this.searchUsers = []
        this.notificationErase = []

        this.onProfileClick = this.onProfileClick.bind(this);
        this.getListUser = this.getListUser.bind(this);
        this.renderListUser = this.renderListUser.bind(this);
        this.updaterenderList = this.updaterenderList.bind(this);
        this.getClassnameforUserandNotification = this.getClassnameforUserandNotification.bind(this);
    }

    logout=()=>{
        firebase.auth().signOut()
        this.props.history.push('/')
        localStorage.clear()
    }

    onProfileClick=()=>{
        this.props.history.push('/profile')
    }

    componentDidMount () {
        firebase.firestore().collection('users').doc(this.currentUserDocumentId).get()
        .then((doc)=>{
            doc.data().messages.map((item)=>{
                this.currentUserMessages.push({
                    notificationId: item.notificationId,
                    number: item.number
                })
            })
            this.setState({
                displayedContactSwitchedNotification: this.currentUserMessages
            })
        })
        this.getListUser()
    }

    getListUser = async()=> {
        const result = await firebase.firestore().collection('users').get();
        if(result.docs.length > 0) {
            let listUsers = []
            listUsers = [...result.docs]
            listUsers.forEach((item, index)=>{
                this.searchUsers.push({
                    key: index,
                    documentKey: item.id,
                    id: item.data().id,
                    nickname: item.data().nickname,
                    messages: item.data().messages,
                    photoUrl: item.data().photoURL,
                })
            })
            this.setState({
                isLoading: false
            })
        }
        this.renderListUser()
    }

    getClassnameforUserandNotification = (itemId)=>{
        let number = 0
        let className = ""
        let check = false;
        if(this.state.currentPeerUser &&
            this.state.currentPeerUser.id === itemId){
                className = 'viewWrapItemFocused'
            }else{
                this.state.displayedContactSwitchedNotification.forEach((item)=>{
                    if(item.notificationId.length > 0){
                        if(item.notificationId === itemId){
                            check = true
                            number = item.number
                        }
                    }
                })
                if(check === true){
                    className = "viewWrapItemNotification"
                }else{
                    className = 'viewWrapItem'
                }
            }
            return className
    }

    notificationErase = (itemId)=>{
        this.state.displayedContactSwitchedNotification.forEach((el)=>{
            if(el.notificationId.length > 0){
                if(el.notificationId != itemId){
                    this.notificationMessagesErase.push(
                        {
                            notificationId: el.notificationId,
                            number: el.number
                        }
                    )
                }
            }
        })
        this.updaterenderList()
    }

    updaterenderList =()=>{
        firebase.firestore().collection('users').doc(this.currentUserDocumentId).update(
            {messages: this.notificationMessagesErase}
        )
        this.setState({
            displayedContactSwitchedNotification: this.notificationMessagesErase
        })
    }

    renderListUser=()=>{
        if(this.searchUsers.length > 0){
            let viewListUser = []
            let classname = ""
            this.searchUsers.map((item)=>{
                if(item.id != this.currentUserId) {
                    classname = this.getClassnameforUserandNotification(item.id)
                    viewListUser.push(
                        <button
                        id={item.key}
                        className = {classname}
                        onClick = {()=>{
                            this.notificationErase(item.id)
                            this.setState({currentPeerUser: item,
                            displayedContactSwitchedNotification: this.notificationMessagesErase})
                            document.getElementById(item.key).style.backgroundColor = "#fff"
                            if (document.getElementById(item.key)){
                                document.getElementById(item.key).style.color = '#fff'
                            }
                        }}
                        >
                            <img
                            className = "viewAvatarItem"
                            src = {item.photoUrl}
                            alt = ""
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItem">
                                    {item.nickname}
                                </span>
                            </div>
                            {classname === 'viewWrapItemNotification' ?
                            <div className="notificationparagraph">
                            <p id={item.key} className="newmessages">New messages</p>
                            </div>:null}
                        </button>
                    ) 
                }
            })
            this.setState({
                displayedContacts: viewListUser
            });
        }else{
            console.log("No users in list")
        }
    }

    searchHandler =(event)=>{
        let searchQuery = event.target.value.toLowerCase(),
        displayedContacts = this.searchUsers.filter((el)=>{
            let SearchValue = el.nickname.toLowerCase();
            return SearchValue.indexOf(searchQuery) !== -1;
        })
        console.log(displayedContacts)
        this.displayedContacts = displayedContacts
        this.displaySearchedContact()
    }

    displaySearchedContact=()=>{
        if(this.searchUsers.length > 0){
            let viewListUser = []
            let classname = ""
            this.displayedContacts.map((item)=>{
                if(item.id != this.currentUserId) {
                    classname = this.getClassnameforUserandNotification(item.id)
                    viewListUser.push(
                        <button
                        id={item.key}
                        className = {classname}
                        onClick = {()=>{
                            this.notificationErase(item.id)
                            this.setState({currentPeerUser: item,
                            displayedContactSwitchedNotification: this.notificationMessagesErase})
                            document.getElementById(item.key).style.backgroundColor = "#fff"
                            if (document.getElementById(item.key)){
                                document.getElementById(item.key).style.color = '#fff'
                            }
                        }}
                        >
                            <img
                            className = "viewAvatarItem"
                            src = {item.photoUrl}
                            alt = ""
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItem">
                                    {item.nickname}
                                </span>
                            </div>
                            {classname === 'viewWrapItemNotification' ?
                            <div className="notificationparagraph">
                            <p id={item.key} className="newmessages">New messages</p>
                            </div>:null}
                        </button>
                    ) 
                }
            })
            this.setState({
                displayedContacts: viewListUser
            });
        }else{
            console.log("No users in list")
        }

    }

    render() {
        return(
            <div className="root">
                <div className="body">
                    <div className="viewListUser">
                        <div className="profileviewleftside">
                            <img
                               className="ProfilePicture"
                               alt=""
                               src={this.currentUserPhoto}
                               onClick={this.onProfileClick}
                            />
                            <span>{this.currentUserName}</span>
                            <button className="Logout" onClick = {this.logout}>Logout</button>
                        </div>
                        <div className="rootsearchbar">
                            <div className="input-container">
                                <i class="fa fa-search icon"></i>
                                <input class="input-field"
                                type="text"
                                onChange={this.searchHandler}
                                placeholder="Search"
                                />
                            </div>
                        </div>
                        {this.state.displayedContacts}
                    </div>
                </div>
                
            </div>
        )
    }

}