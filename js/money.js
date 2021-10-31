let signout = document.getElementById("signout");

signout.addEventListener("click", function () {
    auth.signOut().then(() => {
        window.location.href = ("/html/transaction.html")
    }).catch((error) => {
        // An error happened.
    });
})

document.addEventListener("DOMContentLoaded", async function (event) {
    auth.onAuthStateChanged(async function (user) {
        if (user) {
            let transactions = [];
            let trans = await db.collection("Transaction").where("uid", "==", user.uid).get();
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
        } else {
            window.location.href = "/index.html";
        }
    })

});


function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

function renderWallet() {
    auth.onAuthStateChanged(async function (user) {
        console.log(user)
        if (user) {
            let wallet = document.getElementById("wallet");
            let uid = user.uid;
            let doc = await db.collection("users").doc(uid).get();
            wallet.value = doc.data().name;
        }
    })
}
renderWallet();

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
    }).then((docRef) => {
        if (date == null) {
            alert("Date needed!")
        } else {
            alert("Thêm thành công")
            window.location.reload()
            renderTransaction()
        }

    }).catch((error) => {
        console.log(error);
        renderTransaction()
    })
})

function renderTransaction() {
    auth.onAuthStateChanged(async function (user) {
        let detail = document.getElementById("detail");

        let trans = await db.collection("Transaction").orderBy("money", "asc").where("uid", "==", user.uid).get();
        detail.innerHTML = "";
        for (var i in trans.docs) {
            const doc = trans.docs[i]
            category = await doc.data().category.get();
            data = doc.data()
            data.category = category.data();

            let spending = (data.category.spending);
            let tran = `<div style="border-bottom: 0.1rem solid rgb(150, 150, 150)" class="form-group">
            <div class="d-flex justify-content-between">
            <b style="font-size: 17px;">${doc.data().date}</b>
            <span style="color: ${(spending) ? "red" : "rgb(122, 204, 0)"};">${((spending) ? "-" : "+") + doc.data().money} VND</span>
            </div>
            </div>`
            detail.innerHTML += tran
        }
    })
}
renderTransaction()