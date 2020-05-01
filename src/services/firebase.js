import React from 'react';
import * as firebase from 'firebase';


var  firebaseConfig = {
  apiKey: "AIzaSyDosJldyApBaOujAMomDTwXssfeCKFE0EM",
  authDomain: "chatappreact-c3c4e.firebaseapp.com",
  databaseURL: "https://chatappreact-c3c4e.firebaseio.com",
  projectId: "chatappreact-c3c4e",
  storageBucket: "chatappreact-c3c4e.appspot.com",
  messagingSenderId: "936326076471",
  appId: "1:936326076471:web:2bb8cf36ad07ab2b8bc7b2",
  measurementId: "G-SSZVGX5Q50"
}

firebase.initializeApp(firebaseConfig)
firebase.firestore().settings({
    timestampsInSnapshots: true
})

export default firebase;