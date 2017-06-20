const mongoose    = require('mongoose');
mongoose.Promise  = require('bluebird');
// const bluebird    = require('bluebird');
// const rp          = require('request-promise');
const env         = require('../config/env');
const databaseURL = env.db;
mongoose.connect(databaseURL);

const Deck        = require('../models/deck');
const Kanji       = require('../models/kanji');

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
