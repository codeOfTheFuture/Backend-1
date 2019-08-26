const router = require('express').Router();
const mongoose = require('mongoose');

const Field = require('./fields-model');

// Load field model
const Fields = mongoose.model('fields');

// Get all fields
router.get('/', (req, res) => {
  Fields.find()
    .then(fields => res.status(200).json(fields))
    .catch(err =>
      res
        .status(500)
        .json({ message: `Their was an error with the server`, err }),
    );
});

// Add a field
router.post('/', (req, res) => {
  const field = req.body;

  const newField = new Field({
    name: field.name,
  });

  newField
    .save()
    .then(field => {
      if (field) {
        res.status(201).json(field);
      } else {
        res.status(401).json({ message: `Please enter a field name` });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ message: `Their was an error with the server`, err }),
    );
});

module.exports = router;
