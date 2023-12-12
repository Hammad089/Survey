
import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
const firebaseConfig = {
    apiKey: "AIzaSyBWubXOJ8UgSWxCQYER87IU9uCuXkeL_Tg",
  authDomain: "coralreefsurvey.firebaseapp.com",
  projectId: "coralreefsurvey",
  storageBucket: "coralreefsurvey.appspot.com",
  messagingSenderId: "989864362736",
  appId: "1:989864362736:web:e0677771ba7fd04facb835"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app)
export  {db}
export {storage}