import React from 'react';

export default {

    storeNotification() {
        firebase.firestore().collection("notifications")
            .doc(this.currentPeerUser.userId)
            .set({
                fromUserName: this.currentUserName,
                fromUserId: this.currentUserId,
                toUserId: this.currentPeerUser.userId,
                createdAt: this.getNow()
            })
    },
    sendNotification(type) {
        if (type == 'privaterooms') {
            this.storeNotification();
        }
    },

}