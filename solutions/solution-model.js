const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Solutions Model
const SolutionSchema = new Schema({
  name: {
    type: String,
    required: true,
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
    type: String,
    default: Date.now,
  },
  votes: [],
  problems: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'problems',
      },
      title: {
        type: String,
      },
      description: {
        type: String,
      },
    },
  ],
});

module.exports = Solutions = mongoose.model('solutions', SolutionSchema);
