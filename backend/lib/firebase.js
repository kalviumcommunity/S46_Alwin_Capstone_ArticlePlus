const { initializeApp, cert } = require("firebase-admin/app")
const { firebaseAccountKey } = require("../config/firebaseAccountKey")

initializeApp({
    credential: cert(firebaseAccountKey),
    storageBucket: "article-plus.appspot.com",
})
