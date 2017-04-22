const express = require('express');
const router  = express.Router();
const kanjis  = require('../controllers/kanjis');

router.get('/', (req, res) => res.render('statics/home'));

router.route('/kanjis')
  .get(kanjis.index);

module.exports = router;
