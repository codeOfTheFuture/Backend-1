const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// // Create Problem schema
// const ProblemSchema = new Schema({
//   description: {
//     title: {
//       type: String,
//       required: true,
//     },
//     body: {
//       type: String,
//       required: true,
//     },
//   },
//   field: {
//     type: String,
//   },
//   relatedProblems: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: 'problems',
//     },
//   ],
// });

// Create field schema
const FieldSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  problems: [{ type: Schema.Types.ObjectId, ref: 'problems' }],
});

module.exports = Field = mongoose.model('fields', FieldSchema);
