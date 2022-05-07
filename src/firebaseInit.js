import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/compat/messaging";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: "FROM FIREBASE CONSOLE",
  // authDomain: "FROM FIREBASE CONSOLE",
  // databaseURL: "FROM FIREBASE CONSOLE",
  // projectId: "FROM FIREBASE CONSOLE",
  // storageBucket: "FROM FIREBASE CONSOLE",
  // messagingSenderId: "FROM FIREBASE CONSOLE",
  // appId: "FROM FIREBASE CONSOLE",
  // measurementId: "FROM FIREBASE CONSOLE",

  apiKey: "AIzaSyAOmre6mkoJWjDQWTyrNdT-7L7E4mz9B1U",
  authDomain: "knkt-fitness.firebaseapp.com",
  projectId: "knkt-fitness",
  storageBucket: "knkt-fitness.appspot.com",
  messagingSenderId: "393182006473",
  appId: "1:393182006473:web:8ba490cdd1eb733ec19118",
  measurementId: "G-1PN8VFBQB8"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

const publicKey = "BFlMXPt-9sIOOFY7DY-H334C_P662Xo_UzJdmJJufo3XQ8jdw8VpkX7BBAfX2kWbFrRnYmQxe6druG-LUvywaaY";

export const getToken = async (setTokenFound) => {
  let currentToken = "";

  try {
    currentToken = await messaging.getToken({ vapidKey: publicKey });
    if (currentToken) {
      setTokenFound(true);
    } else {
      setTokenFound(false);
    }
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
  }

  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
