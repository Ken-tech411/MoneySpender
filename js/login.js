let email = document.getElementById("login_email");
let password = document.getElementById("login_password");
let loginbtn = document.getElementById("login");

loginbtn.addEventListener("click", function () {
    auth.signInWithEmailAndPassword(email.value, password.value)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            let uid = user.uid;
            db.collection('users').doc(uid).get({
                email: email.value,
                password: password.value
            }).then(function () {
                alert("Welcome Back!");
                window.location.href = ("/transaction.html")
            })
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert(errorMessage)
        });
})