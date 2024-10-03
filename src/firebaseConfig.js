// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsigxAQ232_9KMoUEt7rpypZXSWXpcQvQ",
  authDomain: "breastcancerscreeningapp.firebaseapp.com",
  projectId: "breastcancerscreeningapp",
  storageBucket: "breastcancerscreeningapp.appspot.com",
  messagingSenderId: "766156279941",
  appId: "1:766156279941:web:710d360ecb372b64fad9ec",
  measurementId: "G-TPLTZD6GJ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };