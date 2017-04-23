// This is not in use at the moment

const mongoose  = require('mongoose');

const gradeSchema = new mongoose.Schema({




  character: { type: String, required: true },
  grade: {type: String}
});

module.exports = mongoose.model('Grade', gradeSchema);
