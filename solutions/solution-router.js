const router = require('express').Router();
const mongoose = require('mongoose');

const user = require('../users/users-model');
const problem = require('../problems/problems-model');
const Solution = require('../solutions/solution-model');

const Users = mongoose.model('users');
const Problems = mongoose.model('problems');
const solutions = mongoose.model('solutions');

// Add a solution to a problem
router.post('/', async (req, res) => {
  try {
    const solution = req.body;

    const user = await Users.findById(solution.userId);
    const problem = await Problems.findById(solution.problemId);

    const newSolution = new Solution({
      name: solution.name,
      user: {
        id: solution.userId,
        username: user.username,
      },
    });

    const savedSolution = await newSolution.save();
    user.solutionsAddedByUser.push({
      id: savedSolution._id,
      name: savedSolution.name,
    });
    problem.problemSolutions.push({
      id: savedSolution._id,
      name: savedSolution.name,
    });

    user.save();

    const updatedProblem = await problem.save();

    res.status(201).json(updatedProblem.problemSolutions);
  } catch (err) {
    res
      .status(500)
      .json({ message: `Their was an error with the server`, err });
  }
});

module.exports = router;
