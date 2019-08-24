const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize express
const server = express();

// Body Parser Middleware
server.use(bodyParser.json());

module.exports = server;
