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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    username: String,
  },
  problemSolutions: [],
  relatedProblems: [],
});

module.exports = Problem = mongoose.model('problems', ProblemSchema);
