const mongoose  = require('mongoose');
const Kanji     = require('../models/kanji')

const deckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // kanji: { type: String }
  kanjis: [{ type: mongoose.Schema.ObjectId, ref: 'Kanji' }]
});

module.exports = mongoose.model('Deck', deckSchema);
