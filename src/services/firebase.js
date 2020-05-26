import * as firebase from 'firebase';

var  firebaseConfig = {
  apiKey: '###',
  authDomain: '###',
  databaseURL: '###',
  projectId: '###',
  storageBucket: '###',
  messagingSenderId: '###',
  appId: '###'
}

firebase.initializeApp(firebaseConfig)

export default firebase;
