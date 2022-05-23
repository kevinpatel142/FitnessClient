import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/compat/messaging";
import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } from './environment/environment';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId

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
