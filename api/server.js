const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize express
const server = express();

// Body Parser Middleware
server.use(bodyParser.json());

// DB Config
const db = require('../config/keys').mongoURI;

// Connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

module.exports = server;
