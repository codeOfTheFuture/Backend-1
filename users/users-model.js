const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create User Schema
const UsersSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  problemsAddedByUser: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'problems',
      },
    },
  ],
  solutionsAddedByUser: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'solutions',
      },
    },
  ],
  problemsOfInterest: [
    {
      _id: {
        type: Schema.Types.ObjectId,
        ref: 'problems',
      },
    },
  ],
});

module.exports = User = mongoose.model('users', UsersSchema);
