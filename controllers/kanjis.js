const Kanji = require('../models/kanji');
const Deck  = require('../models/deck');

function kanjisIndex(req, res, next) {
  const p1 = Kanji.find(req.query ).exec();
  // Find decks where you are the owner
  const p2 = Deck.find({ user: res.locals.user._id}).exec();

  // Native Node method, NOT bluebird
  Promise.all([p1, p2])
  .then((values) => res.render('kanjis/index', {
    kanjis: values[0],
    decks: values[1]
  }))
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
  console.log('deck', req.params.deckid);
  console.log('kanji', req.params.kanjiid);
  Deck
  .findByIdAndUpdate({ _id: req.params.deckid }, { $pull: { kanjis: [req.params.kanjiid] } }, { new: true })
  .exec()
  .then(deck => {
    console.log(deck);
    res.sendStatus(200);
  })
  .catch(next);
}

module.exports  = {
  index: kanjisIndex,
  show: kanjisShow,
  delete: kanjisDelete
};
