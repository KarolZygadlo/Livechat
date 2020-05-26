import firebase from 'firebase';
import md5 from 'md5';

export function randomUniqId (userId) {
    let uniqId = md5((Math.random().toString(36).substring(2, 8)) + userId + firebase.firestore.FieldValue.serverTimestamp());
    return uniqId;
}