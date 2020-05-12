import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import './Welcome.css';



export default class Welcome extends React.Component{
    render() {
        return(
            <div className="viewWelcomeBoard">
                <img 
                className="avatarWelcome"
                src={this.props.currentUserPhoto}
                alt=""
                />
                <span className="textTitleWelcome">Welcome {this.props.currentUserName}</span>
            </div>
        )
    }
}