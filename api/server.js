const express = require('express');
const mongoose = require('mongoose');

const globalMiddleware = require('../config/global-middleware');

const authRouter = require('../auth/auth-router');
const problemsRouter = require('../problems/problems-router');
const fieldsRouter = require('../fields/fields-router');

// Initialize express
const server = express();

// Global Middleware
globalMiddleware(server);

// DB Config
const db = require('../config/keys').mongoURI;

// Connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Routes
server.use('/api/auth', authRouter);
server.use('/api/problems', problemsRouter);
server.use('/api/fields', fieldsRouter);

module.exports = server;
