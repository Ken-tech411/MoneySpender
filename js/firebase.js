var firebaseConfig = {
    apiKey: "AIzaSyClxaGLWqVxYOIuAQlEwTiVZS_bSQ6pW5Q",
    authDomain: "wi01-quan-ly-chi-tieu.firebaseapp.com",
    projectId: "wi01-quan-ly-chi-tieu",
    storageBucket: "wi01-quan-ly-chi-tieu.appspot.com",
    messagingSenderId: "501169147848",
    appId: "1:501169147848:web:9efba3ef3e32002ecd3afd"
  };

firebase.initializeApp(firebaseConfig);

let auth = firebase.auth();
let db = firebase.firestore();