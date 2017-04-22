const Kanji = require('../models/kanji');

function kanjisIndex(req, res) {
  Kanji
    .find()
    .exec()
    .then(kanjis => {
      res.render('kanjis/index', { kanjis });
    })
    .catch(err => {
      res.status(500).render('error', { error: err });
    });
}

module.exports = {
  index: kanjisIndex
};
