const mongoose  = require('mongoose');

const deckSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  kanjis: [{ type: mongoose.Schema.ObjectId, ref: 'Kanji' }],
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Deck', deckSchema);
