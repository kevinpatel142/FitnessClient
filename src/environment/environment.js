//For local setup
const local = {
    apiUrl: "http://knktfitnessapi-env.eba-fter9evi.us-east-2.elasticbeanstalk.com",
    PORT: ""
};

//For staging server
const staging = {
    apiUrl: "http://knktfitnessapi-env.eba-fter9evi.us-east-2.elasticbeanstalk.com",
    PORT: ""
};

//For production server
const production = {
    apiUrl: "http://knktfitnessapi-env.eba-fter9evi.us-east-2.elasticbeanstalk.com",
    PORT: ""
};

if (process.env.REACT_APP_ENV === "local") module.exports = local;
else if (process.env.REACT_APP_ENV === "staging") module.exports = staging;
else if (process.env.REACT_APP_ENV === "production") module.exports = production;
else module.exports = staging;