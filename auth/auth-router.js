const router = require('express').Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model');
const secrets = require('../config/jwtSecret');

// Load user model
const User = mongoose.model('users');

// Register a new user
router.post('/register', (req, res) => {
  const user = req.body;

  const hashPassword = bcrypt.hashSync(user.password, 14);

  user.password = hashPassword;

  const newUser = new Users({
    username: user.username,
    password: user.password,
    favoriteFields: [...user.favoriteFields],
  });

  newUser.save().then(user => {
    if (user) {
      const token = generateToken(user);
      res.status(201).json({
        message: `Welcome ${user.username}`,
        user: {
          id: user.id,
          username: user.username,
          favoriteFields: user.favoriteFields,
        },
        token,
      });
    } else {
      res.status(401).json({ message: `Please enter a username and password` });
    }
  });
});

// Login a user
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
          message: `Welcome ${user.username}`,
          user: { id: user.id, username: user.username },
          token,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// Generate JSON Web Token
const generateToken = user => {
  const jwtPayload = {
    subject: user.id,
    username: user.username,
  };

  const jwtSecret = secrets.jwtSecret;

  const jwtOptions = {
    expiresIn: '1d',
  };

  return jwt.sign(jwtPayload, jwtSecret, jwtOptions);
};

module.exports = router;
