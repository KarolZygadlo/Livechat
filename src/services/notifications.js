import firebase from 'firebase';

export function checkNotifications (userId) {
    let listenerNotify = firebase.firestore().collection("notifications")
    .where('toUserId', '==', userId)
    .onSnapshot(querySnapshot => {
      let newNotification = [];
      querySnapshot.forEach(doc => {
        newNotification.push(doc.data());
        var notification = new Notification("Nowa wiadomość od "+ newNotification[0].fromUserName);
        deleteNotification(newNotification[0].toUserId);
      });
  });
  
}

function deleteNotification (docId) {
  firebase.firestore().collection("notifications").doc(docId).delete().then(function() {
    console.log("Document successfully deleted!");
}).catch(function(error) {
    console.error("Error removing document: ", error);
});
}