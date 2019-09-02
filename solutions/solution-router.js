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
  const { userId, problemId, name } = req.body;
  const user = await Users.findById(userId);
  const problem = await Problems.findById(problemId);

  const newSolutionFields = {};
  newSolutionFields.user = {};

  newSolutionFields.name = name;
  newSolutionFields.user.id = user._id;
  newSolutionFields.user.username = user.username;

  try {
    const newSolution = new Solution(newSolutionFields);

    const solution = await newSolution.save();

    problem.problemSolutions.unshift({
      _id: solution._id,
      name: solution.name,
      user: user,
      date: solution.date,
      votes: solution.votes,
    });

    const updatedProblem = await problem.save();

    res.status(201).json(updatedProblem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Server error`, error });
  }
});

// Update a solution if a user votes for a solution
router.put('/vote/:id', async (req, res) => {
  const { id } = req.params;
  const { userId, problemId } = req.body;

  const solution = await Solutions.findById(id);
  const problem = await Problems.findById(problemId);

  try {
    solution.votes.forEach(vote => {
      if (vote.user.toString() === userId.toString()) {
        return res
          .status(400)
          .json({ message: `You have already voted for this solution` });
      }
    });

    solution.votes.unshift({
      user: userId,
    });

    const updatedSolution = await solution.save();

    problem.problemSolutions.forEach(solution => {
      if (solution.id.toString() === updatedSolution._id.toString()) {
        solution.votes.unshift({ user: userId });
      }
    });

    const updatedProblem = await problem.save();

    res.status(200).json(updatedProblem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Their was an error with the server` });
  }
});

// Update a solution if a user un-votes for a solution
router.put('/unvote/:id', async (req, res) => {
  const { id } = req.params;
  const { userId, problemId } = req.body;

  const solution = await Solutions.findById(id);
  const problem = await Problems.findById(problemId);

  try {
    solution.votes.forEach((vote, index) => {
      if (vote.user.toString() === userId.toString()) {
        solution.votes.splice(index, 1);
      } else {
        return res
          .status(400)
          .json({ message: `You have not voted for this solution` });
      }
    });

    const updatedSolution = await solution.save();

    problem.problemSolutions.forEach(solution => {
      if (solution._id.toString() === updatedSolution._id.toString()) {
        if (
          !solution.votes.some(
            vote => vote.user.toString() === userId.toString(),
          )
        ) {
          return res
            .status(400)
            .json({ message: `You have not voted for this solution` });
        } else {
          solution.votes.forEach((vote, index) => {
            if (vote.user.toString() === userId.toString()) {
              solution.votes.splice(index, 1);
            }
          });
        }
      }
    });

    const updatedProblem = await problem.save();

    res.status(200).json(updatedProblem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Their was an error with the server` });
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

// if (solution.votes.filter(vote => vote.userId === userId).length > 0) {
//   return res.status(400).json({ message: `Post already liked` });
// } else if (
//   problem.problemSolutions.filter(solution => {
//     return (
//       solution.votes.filter(vote => vote.userId === userId).length > 0 &&
//       true
//     );
//   }).length > 0
// ) {
//   return res.status(400).json({ message: `Post already liked` });
// }

// solution.votes.unshift({ userId: userId });
// problem.problemSolutions.forEach(solution => {
//   if (solution._id === id) {
//     solution.votes.unshift({ userId: userId });
//   }
// });

// const solution = new Solution(newSolution);

//     const savedSolution = await solution.save();

//     const solutionProblems = await savedSolution.findById(savedSolution._id);

//     solutionProblems.push({ problemId: problem._id, title: problem.title });

//     savedSolution.save();

//     const related = problems.filter(problem => {
//       return (
//         problem.problemSolutions.filter(obj => obj.name === solution.name)
//           .length > 0 && true
//       );
//     });

//     const relatedProblems = related
//       .reduce((unique, o) => {
//         if (!unique.some(obj => obj.id === o.id && obj.title === o.title)) {
//           unique.push(o);
//         }
//         return unique;
//       }, [])
//       .map(problem => {
//         return {
//           id: problem._id,
//           title: problem.title,
//         };
//       })
//       .filter(obj => obj.title !== problem.title);

//     user.solutionsAddedByUser.push({
//       _id: savedSolution._id,
//       name: savedSolution.name,
//     });
//     problem.problemSolutions.push(savedSolution);
//     problem.relatedProblems = relatedProblems;

//     user.save();

//     const updatedProblem = await problem.save();

//     res.status(201).json(updatedProblem);

//     // const solutionProblems = await savedSolution.findById(savedSolution._id);

//     // solutionProblems.push({ problemId: problem._id, title: problem.title });

//     // savedSolution.save();
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: `Server error`, error });
//   }

//   // const solution = req.body;

//   // try {
//   //   const user = await Users.findById(solution.userId);
//   //   const problem = await Problems.findById(solution.problemId);

//   //   const problems = await Problems.find();

//   //   const related = problems.filter(problem => {
//   //     return (
//   //       problem.problemSolutions.filter(obj => obj.name === solution.name)
//   //         .length > 0 && true
//   //     );
//   //   });

//   //   const relatedProblems = related
//   //     .reduce((unique, o) => {
//   //       if (!unique.some(obj => obj.id === o.id && obj.title === o.title)) {
//   //         unique.push(o);
//   //       }
//   //       return unique;
//   //     }, [])
//   //     .map(problem => {
//   //       return {
//   //         id: problem._id,
//   //         title: problem.title,
//   //       };
//   //     })
//   //     .filter(obj => obj.title !== problem.title);

//   //   console.log(`Related Problems:`, relatedProblems);

//   //   const newSolution = new Solution({
//   //     name: solution.name,
//   //     user: {
//   //       id: solution.userId,
//   //       username: user.username,
//   //     },
//   //   });

//   //   const savedSolution = await newSolution.save();

//   //   // const solutionProblems = await savedSolution.findById(savedSolution._id);

//   //   // solutionProblems.push({ problemId: problem._id, title: problem.title });

//   //   // savedSolution.save();

//   //   user.solutionsAddedByUser.push({
//   //     _id: savedSolution._id,
//   //     name: savedSolution.name,
//   //   });
//   //   problem.problemSolutions.push(savedSolution);
//   //   problem.relatedProblems = relatedProblems;

//   //   user.save();

//   //   const updatedProblem = await problem.save();

//   //   res.status(201).json(updatedProblem);
//   // } catch (error) {
//   //   console.error(error);
//   //   res
//   //     .status(500)
//   //     .json({ message: `Their was an error with the server`, error });
//   // }
