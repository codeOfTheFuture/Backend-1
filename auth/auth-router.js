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
  });

  newUser.save().then(user => {
    if (user) {
      const token = generateToken(user);
      res.status(201).json({
        message: `Welcome ${user.username}`,
        user: {
          id: user._id,
          username: user.username,
          problemsAddedByUser: user.problemsAddedByUser,
          solutionsAddedByUser: user.solutionsAddedByUser,
          problemsOfInterest: user.problemsOfInterest,
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

// Get a user info
router.get('/user/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Their was an error with the server`, error });
  }
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
