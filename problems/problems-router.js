const router = require('express').Router();
const mongoose = require('mongoose');

const Problems = require('./problems-model');

// Load Problems model
const Problem = mongoose.model('Problem');

// Add a problem
router.post('/', (req, res) => {
  const problem = req.body;

  const newProblem = new Problems({
    description: {
      title: problem.description.title,
      body: problem.description.body,
    },
    field: problem.field,
    relatedProblems: problem.relatedProblems,
  });

  newProblem
    .save()
    .then(problem => {
      if (problem) {
        res.status(201).json({ problem: problem });
      } else {
        res.status(401).json({ message: `Please enter all fields` });
      }
    })
    .catch(err =>
      res.status(500).json({ message: `Their was an error with the server` }),
    );
});

module.exports = router;
