const Kanji = require('../models/kanji');

function gradesIndex(req, res) {
  Kanji
    .find()
    .exec()
    .then(kanjis => {
      res.render('grades/index', { kanjis });
    })
    .catch(err => {
      res.status(500).render('error', { error: err });
    });
}

function gradesShow(req, res) {
  Kanji
    .find({grade: req.params.id})
    .exec()
    .then(kanjis => {
      if (!kanjis) return res.status(404).render('statics/error', { error: 'No kanji characters found.'});
      res.render('grades/show', { kanjis, grade: req.params.id });
    })
    .catch(err => {
      res.status(500).render('error', { error: err });
    });
}

module.exports = {
  index: gradesIndex,
  show: gradesShow
};
