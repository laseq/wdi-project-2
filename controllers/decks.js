const Deck  = require('../models/deck');

function decksIndex(req, res, next) {
  Deck
    .find()
    .then((decks) => res.render('decks/index', { decks }))
    .catch(next);
}

function decksNew(req, res) {
  res.render('decks/new');
}

function decksCreate(req, res, next) {
  Deck
    .create(req.body)
    .then(() => res.redirect('/decks'))
    .catch(next);
}

function decksShow(req, res, next) {
  Deck
    .findById(req.params.id)
    .exec()
    .then((deck) => {
      if (!deck) return res.status(404).render('statics/404');
      return Deck.populate(deck, { path: 'kanjis'});
    })
    .then(deck => res.render('decks/show', { deck }))
    .catch(next);
}

function decksEdit(req, res) {
  Deck
    .findById(req.params.id)
    .exec()
    .then(deck => {
      if (!deck) return res.render('error', { error: 'No dideo found'});
      return res.render('decks/edit', { deck });
    })
    .catch(err => {
      return res.render('error', { error: err });
    });
}

function decksUpdate(req, res, next) {
  Deck
    .findById(req.params.id)
    .then((deck) => {
      if(!deck) return res.status(404).render('statics/404');

      // for(const field in req.body) {
      //   deck[field] = req.body[field];
      // }
      for(const field in req.body) {
        if (Array.isArray(deck[field])) {
          deck[field].push(req.body[field]);
        } else {
          deck[field] = req.body[field];
        }
      }


      return deck.save();
    })
    .then((deck) => res.redirect(`/decks/${deck.id}`))
    .catch(next);
}

function decksDelete(req, res, next) {
  Deck
    .findById(req.params.id)
    .then((deck) => {
      if(!deck) return res.status(404).render('statics/404');
      return deck.remove();
    })
    .then(() => res.redirect('/decks'))
    .catch(next);
}

function decksAddKanji(req, res, next) {
  Deck
    .findByIdAndUpdate(req.params.id, {
      $addToSet: {
        kanjis: [req.body.kanjiId]
      }
    }, {
      new: true
    })
    .exec()
    .then(deck => {
      if (!deck) return res.status(404).json({ message: 'No deck found' });
      return Deck.populate(deck, { path: 'kanjis'});
    })
    .then(deck => {
      return res.status(200).json(deck);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
}

module.exports = {
  index: decksIndex,
  new: decksNew,
  create: decksCreate,
  show: decksShow,
  edit: decksEdit,
  update: decksUpdate,
  delete: decksDelete,
  addKanji: decksAddKanji
};
