import React from 'react';
import LoginString from "../login/LoginStrings";
import firebase from '../../services/firebase';
import './Chat.css';
import ReactDOM from 'react-dom';
import Message from '../message/Message';
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

        this.searchUsers = []
        this.allUsers = []
        this.allGroups = ['mems', 'star wars']

        this.onProfileClick = this.onProfileClick.bind(this);
        this.getListUser = this.getListUser.bind(this);
        this.renderListUser = this.renderListUser.bind(this);
    }

    componentDidMount () {
        this.checkLogin()
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
         console.log(this.allUsers)
    }

    renderListUser=()=>{
        if(this.allUsers.length > 0){
            let viewListUser = []
            this.allUsers.forEach((item)=>{
                if(item.id != this.currentUserId) {
                    viewListUser.push(
                            <button
                            id={item.key}
                            className = "viewWrapItem"
                            onClick = {()=>{
                                this.setState({currentPeerUser: item})
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
                        </button>
                    ) 
                }
            })
            return viewListUser
        }else{
            console.log("No users in list")
        }
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
                            }}
                            >
                            <img
                            className = "viewAvatarItem"
                            src = {item.photoUrl}
                            alt = ""
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItem">
                                    {item}
                                </span>
                            </div>
                        </button>
                    ) 
            })
            return viewListGroups
        }else{
            console.log("No groups in list")
        }
    }

    // searchHandler =(event)=>{
    //     let searchQuery = event.target.value.toLowerCase(),
    //     displayedContacts = this.allUsers.filter((el)=>{
    //         let SearchValue = el.nickname.toLowerCase();
    //         return SearchValue.indexOf(searchQuery) !== -1;
    //     })
    //     console.log(displayedContacts)
    //     this.displayedContacts = displayedContacts
    //     this.displaySearchedContact()
    // }

    // displaySearchedContact=()=>{
    //     if(this.displayedContacts.length > 0){
    //         let viewListUser = []
    //         let classname = ""
    //         this.displayedContacts.forEach((item)=>{
    //             if(item.id != this.currentUserId) {
    //                 viewListUser.push(
    //                     <button
    //                     id={item.key}
    //                     className = {classname}
    //                     onClick = {()=>{
    //                         this.setState({currentPeerUser: item})
    //                     }}
    //                     >
    //                         <img
    //                         className = "viewAvatarItem"
    //                         src = {item.photoUrl}
    //                         alt = ""
    //                         />
    //                         <div className="viewWrapContentItem">
    //                             <span className="textItem">
    //                                 {item.nickname}
    //                             </span>
    //                         </div>
    //                         {classname === 'viewWrapItemNotification' ?
    //                         <div className="notificationparagraph">
    //                         <p id={item.key} className="newmessages">New messages</p>
    //                         </div>:null}
    //                     </button>
    //                 ) 
    //             }
    //         })
    //         return viewListUser
    //     }else{
    //         console.log("No users in list")
    //     }
    // }
    
    render() {

        var boardView;
        if (this.state.currentPeerUser) {
            boardView = <Message
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
                        {this.renderListGroups()}
                        {this.renderListUser()}
                    </div>
                    <div className="viewBoard">
                        {boardView}
                    </div>
                </div>
                
            </div>
        )
    }

}