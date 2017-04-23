const mongoose    = require('mongoose');
mongoose.Promise  = require('bluebird');
// const bluebird    = require('bluebird');
// const rp          = require('request-promise');
const env         = require('../config/env');
const databaseURL = env.db;
mongoose.connect(databaseURL);

const Deck        = require('../models/deck');
const Kanji       = require('../models/kanji');

// Deck
//   .findOne({ name: 'Favourites'}, function(err, deck) {
//     if(err){
//       console.log('err', err);
//     } else {
//       console.log('deck.name', deck.name);
//     }
//   });

// Deck
//   .find()
//   .then((decks) => {
//     console.log('decks', decks);
//   })
//   .catch(err =>{
//     console.log('Error:', err);
//   })
//   .finally(function(){
//     mongoose.connection.close();
//   });

Deck
  .findOne({ 'name': 'Favourites'})
  .populate('kanjis')
  .exec((err, items) => {
    if (err) return console.log(err);
    console.log('kanjis:', items.kanji[0].meaning);
    // kanjis
    //   .findOne({ grade: '1' })
    //   .then(item => {
    //     console.log('item.meaning:', item.meaning);
    //   });
  })
  .finally(()=>{
    mongoose.connection.close();
  });

// var options = {
//   uri: 'https://kanjialive-api.p.mashape.com/api/public/search/advanced/?grade=1',
//   // uri: 'https://kanjialive-api.p.mashape.com/api/public/kanji/all',
//   // uri: encodeURI('https://kanjialive-api.p.mashape.com/api/public/kanji/飼'),
//
//   headers: {
//     'X-Mashape-Key': env.mashapeKey
//   },
//   json: true // Automatically parses the JSON string in the response
// };
//
// rp(options)
//   .then(function (json) {
//     //console.log(json);
//     const slicedJson = json.slice(10,20);
//     //bluebird.slice(json, )
//     bluebird.map(slicedJson, item => {
//       console.log(item.kanji.character);
//     })
//     .then(characters => {
//       console.log(`${characters.length} were saved.`);
//       process.exit();
//     })
//     .catch(function (err) {
//       // JSON failed...
//       console.log('Error in JSON', err);
//     });
//   })
//   .catch(function (err) {
//     // API call failed...
//     console.log('Error in .then(json)', err);
//   });
