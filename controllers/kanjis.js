const Kanji = require('../models/kanji');
const Deck  = require('../models/deck');

function kanjisIndex(req, res, next) {
  Kanji
    .find()
    .exec()
    .then((kanjis) => res.render('kanjis/index', { kanjis }))
    .catch(next);
}

function kanjisShow(req, res, next) {
  const deckId  = req.params.deckid;
  Kanji
    .findById(req.params.kanjiid)
    .exec()
    .then((kanjiItem) => {
      console.log('kanjiItem', kanjiItem);
      if(!kanjiItem) return res.status(404).render('statics/404');
      res.render('kanjis/show', { kanjiItem, deckId });
    })
    .catch(next);
}

function kanjisDelete(req, res, next) {
  Deck
  .update({ _id: req.params.deckid },
    { $pull: { 'kanjis': req.params.kanjiid } }
  )
  .then(() => {
    res.redirect(`/decks/${req.params.deckid}`);
  })
  .catch(next);
}

module.exports  = {
  index: kanjisIndex,
  show: kanjisShow,
  delete: kanjisDelete
};
