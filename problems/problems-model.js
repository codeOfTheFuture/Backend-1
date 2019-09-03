const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Problem Schema
const ProblemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  addedByUser: {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    username: String,
  },
  problemSolutions: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'solutions',
      },
      name: {
        type: String,
      },
      user: {
        id: {
          type: Schema.Types.ObjectId,
          ref: 'users',
        },
        username: {
          type: String,
        },
      },
      date: {
        type: Date,
      },
      votes: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: 'users',
          },
        },
      ],
    },
  ],
  relatedProblems: [],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Problem = mongoose.model('problems', ProblemSchema);
