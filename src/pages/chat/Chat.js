import React from 'react';
import LoginString from "../login/LoginStrings";
import firebase from '../../services/firebase';
import './Chat.css';
import ReactDOM from 'react-dom';
import Message from '../message/Message';
import Welcome from '../welcome/Welcome';

export default class Chat extends React.Component {

    constructor(props) {
        super(props)
        this.state ={
            isLoading: true,
            currentPeerUser: null,
        }
        this.currentUserName = localStorage.getItem(LoginString.NICKNAME);
        this.currentUserId = localStorage.getItem(LoginString.ID);
        this.currentUserPhoto = localStorage.getItem(LoginString.PHOTO_URL); 

        this.searchUsers = []
        this.allUsers = []

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

    getListUser = async()=> {
        this.allUsers.length = 0
        this.setState({isLoading: true})
         let newusers = firebase.firestore()
         .collection('users')
         .onSnapshot(
             snapshot => {
                 snapshot.docChanges().forEach(change => {
                     if (change.type === LoginString.DOC) {
                         this.allUsers.push(change.doc.data())
                     }
                 })
                 this.setState({isLoading: false})
             },
             err => {
                 this.props.showToast(0, err.toString())
             }
         )
    }

    renderListUser=()=>{
        if(this.allUsers.length > 0){
            let viewListUser = []
            let classname = ""
            console.log(this.allUsers)
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

    // searchHandler =(event)=>{
    //     let searchQuery = event.target.value.toLowerCase(),
    //     displayedContacts = this.searchUsers.filter((el)=>{
    //         let SearchValue = el.nickname.toLowerCase();
    //         return SearchValue.indexOf(searchQuery) !== -1;
    //     })
    //     console.log(displayedContacts)
    //     this.displayedContacts = displayedContacts
    //     this.displaySearchedContact()
    // }

    // displaySearchedContact=()=>{
    //     if(this.allUsers.length > 0){
    //         let viewListUser = []
    //         let classname = ""
    //         this.displayedContacts.map((item)=>{
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
                    </div>
                    <div className="viewBoard">
                        {this.state.currentPeerUser ? (
                            <Message
                            currentPeerUser ={this.state.currentPeerUser}
                            showToast={this.props.showToast}
                            />):(
                            <Welcome 
                            currentUserName={this.currentUserName}
                            currentUserPhoto={this.currentUserPhoto}/> 
                            )}
                    </div>
                </div>
                
            </div>
        )
    }

}