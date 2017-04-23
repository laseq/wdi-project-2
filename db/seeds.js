const mongoose    = require('mongoose');
mongoose.Promise  = require('bluebird');
const bluebird    = require('bluebird');
const rp          = require('request-promise');
const env         = require('../config/env');
const databaseURL = env.db;
const Kanji       = require('../models/kanji');
const Deck        = require('../models/deck');

mongoose.connect(databaseURL);

Kanji.collection.drop();
Deck.collection.drop();

var options = {
  // uri: 'https://kanjialive-api.p.mashape.com/api/public/search/advanced/?grade=1',
  uri: 'https://kanjialive-api.p.mashape.com/api/public/kanji/all',
  // uri: encodeURI('https://kanjialive-api.p.mashape.com/api/public/kanji/飼'),
  headers: {
    'X-Mashape-Key': env.mashapeKey
  },
  json: true // Automatically parses the JSON string in the response
};


rp(options)
.then(function (repos) {

  bluebird.map(repos, item =>{

    return Kanji.create({
      character: item.kanji.character || 'No data',
      onJp: item.kanji.onyomi.katakana || 'No data',
      onEn: item.kanji.onyomi.romaji || 'No data',
      kunJp: item.kanji.kunyomi.hiragana || 'No data',
      kunEn: item.kanji.kunyomi.romaji || 'No data',
      meaning: item.kanji.meaning.english || 'No data',
      grade: item.references.grade || '7',
      writingUrl: item.kanji.video.mp4 || 'No data'
    });

  })
  .then(characters => {
    console.log('Kanji collection has %d characters', characters.length);
    //process.exit();

  //   return Deck
  //     .create([
  //       {
  //         name: 'Favourites',
  //         kanjis: ''
  //       },
  //       {
  //         name: 'Difficult Kanji',
  //         kanjis: ''
  //       }
  //     ]);
  //
  // })
  // .then(decks => {
  //   console.log('Decks collection has %d decks', decks.length);
  })
  .catch(function(err) {
    // Collection creation failed
    console.log('Collection creation failed', err);
  })
  .finally(()=>{
    mongoose.connection.close();
  });
})
.catch(function (err) {
  // API call failed...
  console.log('Api failed', err);
});
