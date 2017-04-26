const mongoose  = require('mongoose');

const deckSchema = new mongoose.Schema({
  name: { type: String, required: true },
  kanjis: [{ type: mongoose.Schema.ObjectId, ref: 'Kanji' }]
});

module.exports = mongoose.model('Deck', deckSchema);
