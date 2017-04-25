const mongoose  = require('mongoose');
const Kanji     = require('../models/kanji')

const lessonSchema = new mongoose.Schema({
  grade: { type: String, required: true },
  lessonNumber: { type: Number, required: true },
  kanjis: [ { type: mongoose.Schema.ObjectId, ref: 'Kanji' } ]
});

module.exports = mongoose.model('Lesson', lessonSchema);
