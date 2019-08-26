const jwt = require('jsonwebtoken');
const secrets = require('../config/jwtSecret');

module.exports = (res, res, next) => {
  const token = req.headers.authorization;

  if(token) {
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if(err) {
        res.status(401).json({ message: 'The token you provided was Invalid' });
      } else {
        req.jwtToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'There was no token provided' })
  }
};