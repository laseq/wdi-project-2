const express       = require('express');
const router        = express.Router();
const grades        = require('../controllers/grades');
const lessons       = require('../controllers/lessons');
const registrations = require('../controllers/registrations');
const sessions      = require('../controllers/sessions');
const decks         = require('../controllers/decks');
const proxy         = require('../controllers/proxy');
const kanjis        = require('../controllers/kanjis');

function secureRoute(req, res, next) {
  if (!req.session.userId) {
    return req.session.regenerate(() => {
      req.flash('danger', 'You must be logged in.');
      res.redirect('/login');
    });
  }

  return next();
}

router.get('/', (req, res) => res.render('statics/home'));

router.route('/grades')
  .get(grades.index);
router.route('/grades/:id')
  .get(grades.show);

router.route('/lessons/:id')
  .get(lessons.show);

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);
router.route('/logout')
  .get(sessions.delete);

router.route('/decks')
  .get(decks.index)
  .post(decks.create);
router.route('/decks/new')
  .get(decks.new);
router.route('/decks/:id')
  .get(decks.show)
  .put(decks.update)
  .delete(decks.delete);
router.route('/decks/:id/edit')
  .get(decks.edit);

router.route('/kanjis/:kanjiid/:deckid')
  .get(kanjis.show)
  .delete(kanjis.delete);

router.route('/proxies/deck')
  .get(proxy.decksIndex);

router.route('/proxies/onekanji')
  .get(proxy.getKanji);

router.route('/proxies/onekanjitodeck')
  .get(proxy.getKanji)
  .post(proxy.addKanji);

module.exports = router;
