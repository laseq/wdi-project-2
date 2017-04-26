// This is not in use at the moment

const mongoose  = require('mongoose');

const gradeSchema = new mongoose.Schema({
  character: { type: String, trim: true, required: true },
  grade: {type: String, trim: true}
});

module.exports = mongoose.model('Grade', gradeSchema);
