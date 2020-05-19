import firebase from 'firebase';

export function deleteMessage (chatType, id, chatId) {
    firebase.firestore()
        .collection(chatType)
        .doc(chatId)
        .collection(chatId)
        .where("messageId", "==", id)
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                const docId = doc.id;
                firebase.firestore()
                    .collection(chatType)
                    .doc(chatId)
                    .collection(chatId)
                    .doc(docId)
                    .update({
                        status: 2,
                        message: "Wiadomość usunięta"

                    });

            });
        });
}