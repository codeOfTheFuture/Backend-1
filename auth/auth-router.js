const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../users/users-model');
const secrets = require('../config/jwtSecret');

// Register a new user
router.post('/register', (req, res) => {
  const user = req.body;

  const hashPassword = bcrypt.hashSync(user.password, 14);

  user.password = hashPassword;

  const newUser = new User({
    username: user.username,
    password: user.password,
  });

  newUser.save().then(user => {
    if (user) {
      const token = generateToken(user);
      res.status(201).json({
        message: `Welcome ${user.username}`,
        user: { id: user.id, username: user.username },
        token,
      });
    } else {
      res.status(401).json({ message: `Please enter a username and password` });
    }
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
