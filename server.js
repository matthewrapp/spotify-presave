// Get dependencies
var express = require('express');
var path = require('path');
var cors = require('cors');
// var http = require('http');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

// REQUIRING ENVIRONMENT VARIABLES INTO THE PROJECT
require('dotenv').config();

// ... ADD CODE TO IMPORT YOUR ROUTING FILES HERE ...
const userRoutes = require("./server/routes/user");
const adminRoutes = require("./server/routes/admin");
const songRoutes = require("./server/routes/song");
const artistRoutes = require("./server/routes/artist");
const spotifyRoutes = require("./server/routes/spotify");

var app = express(); // create an instance of express

// Tell express to use the following parsers for POST data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(logger('dev')); // Tell express to use the Morgan logger

// Add support for CORS

app.use((req, res, next) => {
  const whitelist = ['http://localhost:4200', 'http://localhost:3000', 'https://accounts.spotify.com']
  const origin = req.headers.origin;
  if (whitelist.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Credentials', true)
  next();
});


// app.use(cors({
//   origin: (origin, cb) => {
//     if (whitelist.indexOf(origin) !== -1) { return cb(null, true)}
//     else { 
//       const message = 'The CORS policy for this origin doesn\'t allow access from the particular origin.';
//       return cb(new Error(message), false);
//     }
//   },
//   methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
//   credentials: true,
//   allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
// }));

// Tell express to use the specified director as the
// root directory for your web site
app.use(express.static(path.join(__dirname, 'dist/sp')));

// ... ADD YOUR CODE TO MAP YOUR URL'S TO ROUTING FILES HERE ...
app.use(userRoutes);
app.use(adminRoutes);
app.use(songRoutes);
app.use(artistRoutes);
app.use(spotifyRoutes);

// establish a connection to mongodb database
mongoose.connect('mongodb://localhost:27017/spotify-presave', {useNewUrlParser : true}, (err, res) => {
  if (err) {
    console.log("Connection failed: " + err);
  } else {
    console.log("Connected to database!");
  }
});

// Tell express to map all other non-defined routes back to the index page
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/sp/index.html'));
// });

// Define the port address and tell express to use this port
const port = process.env.PORT;
app.set('port', port);

// Create HTTP server.
// const server = http.createServer(app);

// Tell the server to start listening on the provided port
app.listen(port, function() {
  console.log('API running on localhost: ' + port)
});
