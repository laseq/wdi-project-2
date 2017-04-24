const Deck  = require('../models/deck');
const Kanji  = require('../models/kanji');

function proxyGetDecks(req, res, next) {
  //const data = 1;
  Deck
    .find()
    .exec()
    .then(decks => {
      const jsonData = JSON.stringify(decks);
      res.render('proxies/deck', { jsonData });
    })
    .catch(err => {
      console.log('Error in proxyGetDecks: ', err);
    });


}

module.exports = {
  decksIndex: proxyGetDecks
};
