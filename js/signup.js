let name = document.getElementById("name");
let email = document.getElementById("email");
let password = document.getElementById("password");
let signupbtn = document.getElementById("signupbtn");

signupbtn.addEventListener("click", function () {
    auth.createUserWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            let uid = user.uid;
            db.collection('users').doc(uid).set({
                name: name.value,
                email: email.value,
                password: password.value
            }).then(function () {
                console.log("Document successfully written!")
                alert("Successfully sign up")
            })
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
        });
})