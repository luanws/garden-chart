// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC9qxwieTSrnhST5B9Tb4pWidQaM2b409s",
    authDomain: "tccii-acedd.firebaseapp.com",
    databaseURL: "https://tccii-acedd-default-rtdb.firebaseio.com",
    projectId: "tccii-acedd",
    storageBucket: "tccii-acedd.appspot.com",
    messagingSenderId: "496091910083",
    appId: "1:496091910083:web:f02fef5501e0dadc907776",
    measurementId: "G-9LW3RESHT8"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export const firebase = {
    app,
    database
}