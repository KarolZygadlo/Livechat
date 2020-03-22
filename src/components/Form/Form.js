import React, { Component } from 'react';
import './Form.css';
import Message from '../Message/Message';
import firebase from 'firebase';
import {myFirebase, myFirestore} from '../../config'
var db = firebase.firestore();
export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'Karol',
      message: '',
      list: [],
    };
    this.messageRef = firebase.firestore().collection('messages')
    this.listenMessages();
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.user) {
      this.setState({'username': nextProps.user.displayName});
    }
  }
  handleChange(event) {
    this.setState({message: event.target.value});
  }
  handleSend() {
    if (this.state.message) {
      var newItem = {
        username: this.state.username,
        message: this.state.message,
      }
      this.messageRef.add(newItem);
      this.setState({ message: '' });
    }
  }
  handleKeyPress(event) {
    if (event.key !== 'Enter') return;
    this.handleSend();
  }
  listenMessages() {
    this.messageRef
    .onSnapshot((querySnapshot)=>{
      let allMessages=[];
      querySnapshot.forEach(doc=>{
        allMessages.push(doc.data())
      })
      this.setState({
        list: allMessages
      });
    })

  }
  render() {
    return (
      <div className="form">
        <div className="form__message">
          { this.state.list.map((item, index) =>
            <Message key={index} message={item} />
          )}
        </div>
        <div className="form__row">
          <input
            className="form__input"
            type="text"
            placeholder="Aa"
            value={this.state.message}
            onChange={this.handleChange.bind(this)}
            onKeyPress={this.handleKeyPress.bind(this)}
          />
          <button
            className="form__button"
            onClick={this.handleSend.bind(this)}
          >
            Wyślij
          </button>
        </div>
      </div>
    );
  }
}