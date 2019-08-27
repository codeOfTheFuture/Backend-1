const router = require('express').Router();
const mongoose = require('mongoose');

const Problems = require('./problems-model');
const Fields = require('../fields/fields-model');
const Users = require('../users/users-model');

// Load Problems model
const Problem = mongoose.model('problems');

// Load Fields model
const Field = mongoose.model('fields');

// Load Users model
const User = mongoose.model('users');

// Get all problems
router.get('/', (req, res) => {
  Problem.find()
    .then(problems => res.status(200).json(problems))
    .catch(err =>
      res
        .status(500)
        .json({ message: `Their was an error with the server`, err }),
    );
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

    // const field = await Field.findOne({ name: prob.field });

    const newProblem = new Problems({
      title: prob.title,
      description: prob.description,
      user: prob.userId,
    });

    const problem = await newProblem.save();

    const updateUser = await User.findById(prob.userId);

    console.log(updateUser);
    updateUser.problemsAddedByUser.push(problem._id);

    updateUser.save();

    // field.problems.push(problem.id);
    // await field.save();

    res.status(201).json(problem);
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ message: `Their was an error with the server`, err });
  }
});

module.exports = router;
