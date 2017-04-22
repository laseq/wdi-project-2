const mongoose    = require('mongoose');
const bluebird    = require('bluebird');
const rp          = require('request-promise');
const env         = require('../config/env');

const databaseURL = env.db;
mongoose.connect(databaseURL);

const Kanji = require('../models/kanji');

Kanji.collection.drop();

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
  .then(function (json) {
    bluebird.map(json, item => {
      return Kanji.create({
        character: item.kanji.character || 'No data',
        onJp: item.kanji.onyomi.katakana || 'No data',
        onEn: item.kanji.onyomi.romaji || 'No data',
        kunJp: item.kanji.kunyomi.hiragana || 'No data',
        kunEn: item.kanji.kunyomi.romaji || 'No data',
        meaning: item.kanji.meaning.english || 'No data',
        grade: item.references.grade || 'No data',
        writingUrl: item.kanji.video.mp4 || 'No data'
      });
    })
    .then(characters => {
      console.log(`${characters.length} were saved.`);
      process.exit();
    })
    .catch(function (err) {
      // JSON failed...
      console.log('Error in JSON', err);
    });
  })
  .catch(function (err) {
    // API call failed...
    console.log('Error in .then(json)', err);
  });
