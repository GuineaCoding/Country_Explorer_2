  import { initializeApp } from "firebase/app";
  import { getAnalytics } from "firebase/analytics";
  import { getAuth } from "firebase/auth";
  import { getDatabase } from "firebase/database";  
  import { getStorage } from 'firebase/storage';

  const firebaseConfig = {
    apiKey: "AIzaSyABaoCUcAwC1WyrTe5S0B7m-6sPzNXwnQk",
    authDomain: "countryexplorer2-setu.firebaseapp.com",
    projectId: "countryexplorer2-setu",
    storageBucket: "countryexplorer2-setu.appspot.com",
    messagingSenderId: "360272714517",
    appId: "1:360272714517:web:c5ac81c04d803d7a22a71c",
    measurementId: "G-PL40DR62C9"
  };
const API_KEY = 'c6ec41cd80cccf0939d09e798f73b5bd';   
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);  
export {API_KEY};
export const storage = getStorage(app);
export { db, auth, analytics };
 