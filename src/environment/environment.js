//For local setup
// const local = {
//     apiUrl: "http://knktfitapi-env.eba-hdh2fsbk.us-east-2.elasticbeanstalk.com",
//     PORT: "",
//     apiKey: "AIzaSyAOmre6mkoJWjDQWTyrNdT-7L7E4mz9B1U",
//     authDomain: "knkt-fitness.firebaseapp.com",
//     projectId: "knkt-fitness",
//     storageBucket: "knkt-fitness.appspot.com",
//     messagingSenderId: "393182006473",
//     appId: "1:393182006473:web:8ba490cdd1eb733ec19118",
//     measurementId: "G-1PN8VFBQB8"
// };
const local = {
    apiUrl: "https://api.knktfit.com",
    PORT: "",
    apiKey: "AIzaSyAOmre6mkoJWjDQWTyrNdT-7L7E4mz9B1U",
    authDomain: "knkt-fitness.firebaseapp.com",
    projectId: "knkt-fitness",
    storageBucket: "knkt-fitness.appspot.com",
    messagingSenderId: "393182006473",
    appId: "1:393182006473:web:8ba490cdd1eb733ec19118",
    measurementId: "G-1PN8VFBQB8"
};

//For staging server
const staging = {
    apiUrl: "http://knktfitapi-env.eba-hdh2fsbk.us-east-2.elasticbeanstalk.com",
    PORT: "",
    apiKey: "AIzaSyAOmre6mkoJWjDQWTyrNdT-7L7E4mz9B1U",
    authDomain: "knkt-fitness.firebaseapp.com",
    projectId: "knkt-fitness",
    storageBucket: "knkt-fitness.appspot.com",
    messagingSenderId: "393182006473",
    appId: "1:393182006473:web:8ba490cdd1eb733ec19118",
    measurementId: "G-1PN8VFBQB8"
};

//For production server
const production = {
    apiUrl: "http://knktfitapi-env.eba-hdh2fsbk.us-east-2.elasticbeanstalk.com",
    PORT: "",
    apiKey: "AIzaSyAOmre6mkoJWjDQWTyrNdT-7L7E4mz9B1U",
    authDomain: "knkt-fitness.firebaseapp.com",
    projectId: "knkt-fitness",
    storageBucket: "knkt-fitness.appspot.com",
    messagingSenderId: "393182006473",
    appId: "1:393182006473:web:8ba490cdd1eb733ec19118",
    measurementId: "G-1PN8VFBQB8"
};

if (process.env.REACT_APP_ENV === "local") module.exports = local;
else if (process.env.REACT_APP_ENV === "staging") module.exports = staging;
else if (process.env.REACT_APP_ENV === "production") module.exports = production;
else module.exports = staging;


// //For local setup
// const local = {
//     apiUrl: "http://localhost:",
//     PORT: "3155",
//     apiKey: "AIzaSyAOmre6mkoJWjDQWTyrNdT-7L7E4mz9B1U",
//     authDomain: "knkt-fitness.firebaseapp.com",
//     projectId: "knkt-fitness",
//     storageBucket: "knkt-fitness.appspot.com",
//     messagingSenderId: "393182006473",
//     appId: "1:393182006473:web:8ba490cdd1eb733ec19118",
//     measurementId: "G-1PN8VFBQB8"
// };

// //For staging server
// const staging = {
//     apiUrl: "http://54.201.160.69:",
//     //apiUrl: "http://localhost:",
//     PORT: "3155",
//     apiKey: "AIzaSyAOmre6mkoJWjDQWTyrNdT-7L7E4mz9B1U",
//     authDomain: "knkt-fitness.firebaseapp.com",
//     projectId: "knkt-fitness",
//     storageBucket: "knkt-fitness.appspot.com",
//     messagingSenderId: "393182006473",
//     appId: "1:393182006473:web:8ba490cdd1eb733ec19118",
//     measurementId: "G-1PN8VFBQB8"
// };

// //For production server
// const production = {
//     apiUrl: "http://54.201.160.69:",
//     //apiUrl: "http://localhost:",
//     PORT: "3155",
//     apiKey: "AIzaSyAOmre6mkoJWjDQWTyrNdT-7L7E4mz9B1U",
//     authDomain: "knkt-fitness.firebaseapp.com",
//     projectId: "knkt-fitness",
//     storageBucket: "knkt-fitness.appspot.com",
//     messagingSenderId: "393182006473",
//     appId: "1:393182006473:web:8ba490cdd1eb733ec19118",
//     measurementId: "G-1PN8VFBQB8"
// };

// if (process.env.REACT_APP_ENV === "local") module.exports = local;
// else if (process.env.REACT_APP_ENV === "staging") module.exports = staging;
// else if (process.env.REACT_APP_ENV === "production") module.exports = production;
// else module.exports = staging;