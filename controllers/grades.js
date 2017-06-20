const Lesson = require('../models/lesson');

function gradesIndex(req, res, next) {
  Lesson
  .find()
  .exec()
  .then(lessons => {
    res.render('grades/index', { lessons });
  })
  .catch(next);
}

function gradesShow(req, res, next) {
  Lesson
    .find({ grade: req.params.id })
    .exec()
    .then(lessons => {
      res.render('grades/show', { lessons });
    })
    .catch(next);
}

module.exports = {
  index: gradesIndex,
  show: gradesShow
};
