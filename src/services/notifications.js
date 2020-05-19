import firebase from 'firebase';

export function checkNotifications (userId) {
    let listenerNotify = firebase.firestore().collection("notifications")
    .where('toUserId', '==', userId)
    .onSnapshot(querySnapshot => {
      let newNotification = [];
      querySnapshot.forEach(doc => {
        newNotification.push(doc.data());
        var notification = new Notification("Nowa wiadomość od "+ newNotification[0].fromUserName);
      });
  });
}

export function checkNotificationsGrant () {
    if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function(permission) { 
            console.log('udzielono zgody');
        });
    }
}