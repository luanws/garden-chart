// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBoMXuBW1XhX8rpLCiB80WlRDMfhsg1gp0",
    authDomain: "agricola-d5f58.firebaseapp.com",
    databaseURL: "https://agricola-d5f58-default-rtdb.firebaseio.com",
    projectId: "agricola-d5f58",
    storageBucket: "agricola-d5f58.appspot.com",
    messagingSenderId: "813727431914",
    appId: "1:813727431914:web:89fd00d7ec918b82336b93",
    measurementId: "G-KE4ETRMHSQ"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export const firebase = {
    app,
    database
}