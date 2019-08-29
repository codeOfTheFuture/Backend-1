const router = require('express').Router();
const mongoose = require('mongoose');

const Problems = require('./problems-model');
const Users = require('../users/users-model');

const restricted = require('../auth/restricted-middleware');

// Load Problems model
const Problem = mongoose.model('problems');

// Load Users model
const User = mongoose.model('users');

// Get all problems
router.get('/', restricted, async (req, res) => {
  try {
    let problems = await Problem.find();

    problems = problems.map(problem => {
      return {
        id: problem._id,
        title: problem.title,
      };
    });

    res.status(200).json(problems);
  } catch (err) {
    res
      .status(500)
      .json({ message: `Their was an error with the server`, err });
  }
});

// Get a problem by id
router.get('/:id', (req, res) => {
  const {
    params: { id },
  } = req;

  Problem.findById(id)
    .then(problem => res.status(200).json(problem))
    .catch(err =>
      res
        .status(500)
        .json({ message: `Their was an error with the server`, err }),
    );
});

// Add a problem
router.post('/', async (req, res) => {
  try {
    const prob = req.body;

    const user = await User.findById(prob.userId);

    const newProblem = new Problems({
      title: prob.title,
      description: prob.description,
      addedByUser: {
        userId: prob.userId,
        username: user.username,
      },
    });

    const problem = await newProblem.save();

    const updateUser = await User.findById(prob.userId);

    console.log(updateUser);
    updateUser.problemsAddedByUser.push({
      id: problem._id,
      title: problem.title,
    });

    updateUser.save();

    res.status(201).json(problem);
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: `Their was an error with the server`, err });
  }
});

module.exports = router;
