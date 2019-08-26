const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Problem Schema
const ProblemSchema = new Schema({
  problem: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  problemSolutions: [
    {
      user: {
        _id: {
          type: Schema.Types.ObjectId,
          ref: 'users',
        },
        username: {
          type: String,
        },
      },
      date: {
        type: String,
        default: Date.now,
      },
      votes: {
        type: Number,
      },
    },
  ],
  relatedProblems: [
    {
      type: Schema.Types.ObjectId,
      ref: 'problems',
    },
  ],
});

module.exports = Problem = mongoose.model('problems', ProblemSchema);
