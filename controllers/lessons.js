const Lesson  = require('../models/lesson');
const User    = require('../models/user');
const Deck    = require('../models/deck');

function lessonsIndex(req, res, next) {
  Lesson
  .find()
  .exec()
  .then(lessons => {
    res.render('lessons/index', { lessons });
  })
  .catch(next);
}

function lessonsShow(req, res, next) {

  const p1 = Lesson
  .findById(req.params.id)
  .populate('kanjis')
  .exec();

  let p2;
  // Find decks where you are the owner
  if (res.locals.user._id){
    p2 = Deck.find({ user: res.locals.user._id}).exec();
  }

  const p3 = Lesson
              .findById(req.params.id)
              .exec()
              .then(lesson => {
                return lesson.grade;
              })
              .then(grade => {
                return Lesson
                        .find({_id: {$gt: req.params.id}, grade: grade})
                        .sort({_id: 1 })
                        .limit(1);
              });

  // const p3 = Lesson.find({_id: {$gt: req.params.id}}).sort({_id: 1 }).limit(1);

  Promise.all([p1, p2, p3])
  .then((values) => res.render('lessons/show', {
    lesson: values[0],
    decks: values[1],
    nextLesson: values[2]
  }))
  .catch(next);
}

module.exports = {
  index: lessonsIndex,
  show: lessonsShow
};
