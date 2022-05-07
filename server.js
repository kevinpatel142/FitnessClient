//Install express server
import express from "express";
import http from "http";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 6143;

// Serve only the static files form the build directory
app.use(express.static(__dirname + '/build'));



app.get('/*', function (req, res) {
  return res.sendFile(path.join(__dirname + '/build', 'index.html'));
})

const server = http.createServer(app);
//const server = https.createServer(httpsOptions, app);


// Start the app by listening on the default Heroku port
server.listen(port, (err, succ) => {
  if (err) {
    console.log('Error : ', err);
  } else {
    console.log('Express server listening on port ' + port);
  }
});

