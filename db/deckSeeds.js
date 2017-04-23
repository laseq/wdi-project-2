const mongoose    = require('mongoose');
mongoose.Promise  = require('bluebird');
const bluebird    = require('bluebird');
const rp          = require('request-promise');
const env         = require('../config/env');
const databaseURL = env.db;
// const Kanji       = require('../models/kanji');
const Deck        = require('../models/deck');
const Kanji       = require('../models/kanji');

mongoose.connect(databaseURL);

Deck.collection.drop();

Deck
  .create([
    {
      name: 'Favourites',
      kanjis: ['58fced85251e985a0b02f582','58fced85251e985a0b02f577']
    },
    {
      name: 'Difficult Kanji',
      kanjis: ['58fced85251e985a0b02f444','58fced85251e985a0b02f431']
    }
  ])
  .then(decks => {
    console.log('Decks collection has %d decks', decks.length);
    console.log('They are', `${decks[0].name} and ${decks[1].name}`);
  })
  .catch(function(err) {
    // Collection creation failed
    console.log('Collection creation failed', err);
  })
  .finally(()=>{
    mongoose.connection.close();
  });
