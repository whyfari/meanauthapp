const express = require('express');
const  path = require('path');
const  bodyParser = require('body-parser');
const  cors = require('cors');
const  passport = require('passport');
const  mongoose = require('mongoose');
const  config = require('./config/database');

// Connect  to database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
    console.log('FA Connected to database ' + config.database);
});

// On Error 
mongoose.connection.on('error', (err) => {
    console.log('FA Database error: ' + err);
});

const app = express();

//const port = 3000;
// in order to use Heroku we need to set the port using env variables
const port = process.env.PORT||8080;

const users = require('./routes/users');

// CORS Middleware
app.use(cors());

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')));

// Body Parser Middleware 
app.use(bodyParser.json());
app.use('/users',users);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

// Index Route
app.get('/', (req,res) => {
    res.send('FA Invalid endpoint');
})

// causes crash when provided an undefined path
app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
})

// Start Server
app.listen(port, () => {
    console.log('FA: Server started on port ' + port);
});
