const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const authRouter = require('../auth/auth-router');

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

// Routes
server.use('/api/auth', authRouter);

module.exports = server;
