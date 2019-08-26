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
