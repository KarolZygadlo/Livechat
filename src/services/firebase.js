import React from 'react';
import * as firebase from 'firebase';


var  firebaseConfig = {
  apiKey: 'AIzaSyB3vWU0XV5VuqRBrar-0J8JSAq9cf_kTwo',
  authDomain: 'chatapp-da38a.firebaseapp.com',
  databaseURL: 'https://chatapp-da38a.firebaseio.com',
  projectId: 'chatapp-da38a',
  storageBucket: 'chatapp-da38a.appspot.com',
  messagingSenderId: '845839281342',
  appId: '1:845839281342:web:12979703762298984102ef'
}

firebase.initializeApp(firebaseConfig)
firebase.firestore().settings({
    timestampsInSnapshots: true
})

export default firebase;