const router = require('express').Router();
const mongoose = require('mongoose');

const user = require('../users/users-model');
const problem = require('../problems/problems-model');
const Solution = require('../solutions/solution-model');

const Users = mongoose.model('users');
const Problems = mongoose.model('problems');
const Solutions = mongoose.model('solutions');

// Add a solution to a problem
router.post('/', async (req, res) => {
  try {
    const solution = req.body;

    const user = await Users.findById(solution.userId);
    const problem = await Problems.findById(solution.problemId);

    const problems = await Problems.find();

    const related = problems.filter(problem => {
      return (
        problem.problemSolutions.filter(obj => obj.name === solution.name)
          .length > 0 && true
      );
    });

    const relatedProblems = related
      .reduce((unique, o) => {
        if (!unique.some(obj => obj.id === o.id && obj.title === o.title)) {
          unique.push(o);
        }
        return unique;
      }, [])
      .map(problem => {
        return {
          id: problem._id,
          title: problem.title,
        };
      })
      .filter(obj => obj.title !== problem.title);

    console.log(`Related Problems:`, relatedProblems);

    const newSolution = new Solution({
      name: solution.name,
      user: {
        id: solution.userId,
        username: user.username,
      },
    });

    const savedSolution = await newSolution.save();

    // const solutionProblems = await savedSolution.findById(savedSolution._id);

    // solutionProblems.push({ problemId: problem._id, title: problem.title });

    // savedSolution.save();

    user.solutionsAddedByUser.push({
      id: savedSolution._id,
      name: savedSolution.name,
    });
    problem.problemSolutions.push(savedSolution);
    problem.relatedProblems = relatedProblems;

    user.save();

    const updatedProblem = await problem.save();

    res.status(201).json(updatedProblem);
  } catch (err) {
    res
      .status(500)
      .json({ message: `Their was an error with the server`, err });
  }
});

// Delete request to delete a solution
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { problemId } = req.body;

    const solution = await Solutions.findById(id);
    const problem = await Problems.findById(problemId);

    solution.remove();

    const problemSolutions = problem.problemSolutions;

    problemSolutions.forEach((solution, i) => {
      console.log(solution._id, id);
      if (solution._id.toString() === id) {
        problemSolutions.splice(i, 1);
      }
    });

    problem.save();

    res.status(200).json({ message: `Solution Deleted` });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: `Their was an error with the server`, error });
  }
});

module.exports = router;
