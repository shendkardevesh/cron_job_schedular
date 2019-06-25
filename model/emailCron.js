let mongoose = require('mongoose');

let schema = new mongoose.Schema({
  date: {
    type: Date
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model('emailLog', schema);