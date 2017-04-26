const mongoose  = require('mongoose');

const kanjiSchema = new mongoose.Schema({
  character: { type: String, required: true },
  onJp: [{ type: String }],
  onEn: [{ type: String }],
  kunJp: [{ type: String }],
  kunEn: [{ type: String }],
  meaning: [{ type: String }],
  grade: {type: String},
  writingUrl: {type: String}
});

module.exports = mongoose.model('Kanji', kanjiSchema);
