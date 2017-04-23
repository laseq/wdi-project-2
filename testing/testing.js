const mongoose    = require('mongoose');
const bluebird    = require('bluebird');
const rp          = require('request-promise');
const env         = require('../config/env');

var options = {
  uri: 'https://kanjialive-api.p.mashape.com/api/public/search/advanced/?grade=1',
  // uri: 'https://kanjialive-api.p.mashape.com/api/public/kanji/all',
  // uri: encodeURI('https://kanjialive-api.p.mashape.com/api/public/kanji/飼'),

  headers: {
    'X-Mashape-Key': env.mashapeKey
  },
  json: true // Automatically parses the JSON string in the response
};

rp(options)
  .then(function (json) {
    //console.log(json);
    const slicedJson = json.slice(10,20);
    //bluebird.slice(json, )
    bluebird.map(slicedJson, item => {
      console.log(item.kanji.character);
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
