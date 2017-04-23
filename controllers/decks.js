const Deck  = require('../models/deck');

function decksIndex(req, res, next) {
  Deck
    .find()
    .then((decks) => res.render('decks/index', { decks }))
    .catch(next);
}

function decksShow(req, res, next) {
  Deck
    .findById(req.params.id)
    .populate('kanjis')
    .then((item) => {
      if(!item) return res.status(404).render('statics/404');
      res.render('decks/show', { item, kanjiArray: item.kanjis });
    })
    .catch(next);
}



module.exports = {
  index: decksIndex,
  show: decksShow
};
