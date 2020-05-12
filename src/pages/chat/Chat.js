import React from 'react';
import LoginString from "../login/LoginStrings";
import firebase from '../../services/firebase';
import './Chat.css';
import ReactDOM from 'react-dom';
import Privaterooms from '../privaterooms/Privaterooms';
import Welcome from '../welcome/Welcome';
import Groupchat from '../groupchat/Groupchat'

export default class Chat extends React.Component {

    constructor(props) {
        super(props)
        this.state ={
            isLoading: true,
            currentPeerUser: null,
            currentPeerGroup: null,
            displayedContacts: []
        }
        this.currentUserName = localStorage.getItem(LoginString.NICKNAME);
        this.currentUserId = localStorage.getItem(LoginString.ID);
        this.currentUserPhoto = localStorage.getItem(LoginString.PHOTO_URL); 
        this.lastUser = localStorage.getItem(LoginString.LASTUSER);

        this.searchUsers = []
        this.allUsers = []
        this.allGroups = ['mems', 'star wars']

        this.onProfileClick = this.onProfileClick.bind(this);
        this.getListUser = this.getListUser.bind(this);
        this.renderListUser = this.renderListUser.bind(this);
        this.renderListGroups = this.renderListGroups.bind(this);
    }

    componentDidMount () {
        this.checkNotificationsGrant()
        this.checkNotifications()
        this.checkLogin()
    }

    checkNotifications =() =>{
        this.listenerNotify = firebase.firestore().collection("notifications")
        .where('toUserId', '==', this.currentUserId)
        .onSnapshot(querySnapshot => {
          let newNotification = [];
          querySnapshot.forEach(doc => {
            newNotification.push(doc.data());
            if (newNotification[0].fromUserId !=  this.lastUser) {
            var notification = new Notification("Nowa wiadomość od "+ newNotification[0].fromUserName);
            }
          });
      });
    }

    checkNotificationsGrant =() =>{
        if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function(permission) { 
                console.log('udzielono zgody');
            });
        }
    }
  

    checkLogin = () => {
        if (!localStorage.getItem(LoginString.ID)) {
            this.setState({isLoading: false}, () => {
                this.props.history.push('/')
            })
        } else {
            this.getListUser()
        }
    }

    logout=()=>{
        firebase.auth().signOut()
        this.props.history.push('/')
        localStorage.clear()
    }

    onProfileClick=()=>{
        this.props.history.push('/profile')
    }

    getListUser =async()=> {
        this.setState({isLoading: true})
         let newusers = firebase.firestore()
         .collection('users')
         .onSnapshot(
            querySnapshot => {
                this.allUsers = []
                querySnapshot.forEach(doc => {
                         this.allUsers.push(doc.data())
                 })
                 this.setState({isLoading: false})
             },
             err => {
                 this.props.showToast(0, err.toString())
             }
         )
    }

    renderListUser=()=>{
            let viewListUser = []
            this.allUsers.forEach((item)=>{
                if(item.userId != this.currentUserId) {
                    viewListUser.push(
                            <button
                            id={item.key}
                            className = "viewWrapItem"
                            onClick = {()=>{
                                this.setState({currentPeerUser: item})
                                this.setState({currentPeerGroup: null})
                            }}
                            >
                            <img
                            className = "viewAvatarItem"
                            src = {item.avatar}
                            alt = ""
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItem">
                                    {item.nickname}
                                </span>
                            </div>
                        </button>
                    ) 
                }
            })
            return viewListUser
    }

    renderListGroups=()=>{
        if(this.allGroups.length > 0){
            let viewListGroups = []
            this.allGroups.forEach((item)=>{
                    viewListGroups.push(
                            <button
                            id={item.key}
                            className = "viewWrapItem"
                            onClick = {()=>{
                                this.setState({currentPeerGroup: item})                            
                                this.setState({currentPeerUser: null})
                            }}
                            >
                            <img
                            className = "viewAvatarItem"
                            src = ""
                            alt = ""
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItem">
                                    {item}
                                </span>
                            </div>
                        </button>
                    ) 
            });
            return viewListGroups
        }else{
            console.log("No groups in list")
        }
    }

    searchHandler =(event)=>{
        let searchQuery = event.target.value.toLowerCase(),
        displayedContacts = this.allUsers.filter((el)=>{
            let SearchValue = el.nickname.toLowerCase();
            return SearchValue.indexOf(searchQuery) !== -1;
        })
        console.log(displayedContacts)
        this.displayedContacts = displayedContacts
    }

    render() {

        var boardView;
        if (this.state.currentPeerUser) {
            boardView = <Privaterooms
            currentPeerUser ={this.state.currentPeerUser}
            showToast={this.props.showToast}
            />;
        } else if (this.state.currentPeerGroup) {
            boardView = <Groupchat
            currentPeerGroup ={this.state.currentPeerGroup}
            showToast={this.props.showToast}
            />
        } else {
            boardView = <Welcome 
            currentUserName={this.currentUserName}
            currentUserPhoto={this.currentUserPhoto}/> 
        }

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
                        {this.renderListUser()}
                        {this.renderListGroups()}
                        
                    </div>
                    <div className="viewBoard">
                        {boardView}
                    </div>
                </div>
                
            </div>
        )
    }

}