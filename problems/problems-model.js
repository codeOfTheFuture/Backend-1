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
  user: {
    type: Schema.Types.ObjectId,
  },
  problemSolutions: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'solutions',
      },
      name: {
        type: String,
      },
    },
  ],
  relatedProblems: [],
});

module.exports = Problem = mongoose.model('problems', ProblemSchema);
