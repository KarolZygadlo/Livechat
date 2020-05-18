import firebase from 'firebase';

export function passwordReset (email) {
    firebase.auth().sendPasswordResetEmail(email).catch(function(error){
        if(error != null){
            document.getElementById('1').innerHTML=error;
        }
    })
    document.getElementById('1').innerHTML="Check your email, to change the password";
    
}