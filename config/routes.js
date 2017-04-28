const express       = require('express');
const router        = express.Router();
const grades        = require('../controllers/grades');
const lessons       = require('../controllers/lessons');
const registrations = require('../controllers/registrations');
const sessions      = require('../controllers/sessions');
const decks         = require('../controllers/decks');
const proxy         = require('../controllers/proxy');
const kanjis        = require('../controllers/kanjis');
const statics       = require('../controllers/statics');

function secureRoute(req, res, next) {
  if (!req.session.userId) {
    return req.session.regenerate(() => {
      req.flash('danger', 'You must be logged in to see that page.');
      res.redirect('/login');
    });
  }
  return next();
}

// router.route('/_grades')
//   .get(grades.index);
// router.route('/_grades/:id')
//   .get(grades.show);

router.route('/')
.get(statics.index);

router.route('/grades')
  .get(secureRoute, grades.index);
router.route('/grades/:id')
  .get(secureRoute, grades.show);

router.route('/lessons')
  .get(secureRoute, lessons.index);
router.route('/lessons/:id')
  .get(secureRoute, lessons.show);

router.route('/register')
  .get(registrations.new)
  .post(registrations.create);

router.route('/login')
  .get(sessions.new)
  .post(sessions.create);
router.route('/logout')
  .get(sessions.delete);

router.route('/decks')
  .get(secureRoute, decks.index)
  .post(secureRoute, decks.create);
router.route('/decks/new')
  .get(secureRoute, decks.new);
router.route('/decks/:id')
  .get(secureRoute, decks.show)
  .put(secureRoute, decks.update)
  .delete(secureRoute, decks.delete);
router.route('/decks/:id/edit')
  .get(secureRoute, decks.edit);
router.route('/decks/:id/add')
  .post(secureRoute, decks.addKanji);

router.route('/kanjis')
  .get(secureRoute, kanjis.index);
router.route('/kanjis/:kanjiid/:deckid')
  .get(secureRoute, kanjis.show)
  .delete(secureRoute, kanjis.delete);

router.route('/proxies/deck')
  .get(proxy.decksIndex);
//
// router.route('/proxies/onekanji')
//   .get(proxy.getKanji);
//
// router.route('/proxies/onekanjitodeck')
//   .get(proxy.getKanji)
//   .post(proxy.addKanji);

module.exports = router;
