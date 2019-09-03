const router = require('express').Router();
const mongoose = require('mongoose');

const Problems = require('./problems-model');
const Users = require('../users/users-model');

// Load Problems model
const Problem = mongoose.model('problems');

// Load Users model
const User = mongoose.model('users');

// Get all problems
router.get('/', async (req, res) => {
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
router.get('/:id', async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const problem = await Problem.findById(id)
      .populate('users', ['id', 'username'])
      .populate('solutions', ['id', 'name', 'user', 'date', 'votes']);

    res.status(200).json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server Error` });
  }
});

// Add a problem
router.post('/', async (req, res) => {
  const { userId, title, description } = req.body;
  const user = await User.findById(userId);

  const newProblemFields = {};
  newProblemFields.addedByUser = {};

  (newProblemFields.addedByUser.userId = user._id),
    (newProblemFields.addedByUser.username = user.username);

  newProblemFields.title = title;
  newProblemFields.description = description;

  try {
    const newProblem = new Problems(newProblemFields);

    await newProblem.save();

    const problemsAddedByUser = {};

    problemsAddedByUser._id = newProblem._id;
    problemsAddedByUser.title = newProblem.title;

    user.problemsAddedByUser.push({
      _id: newProblem._id,
      title: newProblem.title,
    });

    await user.save();

    res.status(201).json(newProblem);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Their was an error with the server`, error });
  }
});

module.exports = router;
