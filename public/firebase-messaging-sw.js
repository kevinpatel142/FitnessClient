// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
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

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png",
  };

  // eslint-disable-next-line no-restricted-globals
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
