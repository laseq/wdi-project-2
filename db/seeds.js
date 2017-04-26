const mongoose    = require('mongoose');
mongoose.Promise  = require('bluebird');
const bluebird    = require('bluebird');
const rp          = require('request-promise');
const env         = require('../config/env');
const databaseURL = env.db;
const Kanji       = require('../models/kanji');
const Deck        = require('../models/deck');
const Lesson      = require('../models/lesson');

mongoose.connect(databaseURL);

Kanji.collection.drop();
Deck.collection.drop();
Lesson.collection.drop();

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
  return bluebird.map(repos, item =>{
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
  .then(kanjis => {
    console.log('Kanji collection has %d kanjis', kanjis.length);

    return bluebird.mapSeries(kanjis, kanji => {
      return Lesson.findOneByGradeAndNumberOfKanjiAndCreateOrUpdate(10, kanji);
    });
  })
  .then(lessons => {
    console.log(lessons)
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
