const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Problem Schema
const ProblemSchema = new Schema({
  description: {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
  field: {
    type: String,
  },
  relatedProblems: Array,
});

module.exports = Problem = mongoose.model('Problem', ProblemSchema);
