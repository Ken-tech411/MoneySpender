let signout = document.getElementById("signout");

signout.addEventListener("click", function () {
    auth.signOut().then(() => {
        window.location.href = ("/login.html")
    }).catch((error) => {
        // An error happened.
    });
})

document.addEventListener("DOMContentLoaded", async function (event) {
    let transactions = [];
    let trans = await db.collection("Transaction").get();
    for (var i in trans.docs) {
        const doc = trans.docs[i]
        category = await doc.data().category.get();
        data = doc.data()
        data.category = category.data();
        transactions.push(data);
    }
    let income = transactions.reduce((pre, cur) => {
        if (!cur.category.spending)
            return pre + cur.money;
        return pre;
    }, 0);
    let outcome = transactions.reduce((pre, cur) => {
        if (cur.category.spending)
            return pre + cur.money;
        return pre;
    }, 0);
    let total = transactions.reduce((pre, cur) => {
        if (cur.category.spending)
            return pre - cur.money;
        return pre + cur.money;
    }, 0);
    document.getElementById("income-value").innerHTML = numberWithCommas(income) + " VND"
    document.getElementById("outcome-value").innerHTML = numberWithCommas(outcome) + "VND"
    document.getElementById("total-value").innerHTML = numberWithCommas(total) + " VND"
});


function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

function renderTrans() {
    auth.onAuthStateChanged(async function (user) {
        console.log(user)
        if (user) {
            let wallet = document.getElementById("wallet");
            let uid = user.uid;
            let doc = await db.collection("users").doc(uid).get();
            wallet.value = doc.data().name;

        } else {
            window.location.href = "/login.html";
        }
    })
}
renderTrans();

let wallet = document.getElementById("wallet");
let amount = document.getElementById("amount");
let date = document.getElementById("date")
let note = document.getElementById("note");
let add_trans = document.getElementById("add_trans");

var dnd = document.querySelector('#category');
var logSelectedID = function () {
    console.log(dnd.options[dnd.selectedIndex].id);
};

logSelectedID();
dnd.addEventListener('change', logSelectedID);

add_trans.addEventListener("click", async function () {
    var dnd = document.querySelector('#category');
    let selectedID = dnd.options[dnd.selectedIndex].id
    let user = await auth.currentUser;
    let email = await user.uid;
    let category = db.collection("category").doc(selectedID)
    db.collection("Transaction").add({
        uid: email,
        category: category,
        money: parseInt(amount.value),
        date: date.value,
        note: note.value
    })
})

