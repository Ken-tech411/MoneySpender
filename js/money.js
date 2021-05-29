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