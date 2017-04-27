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






// const Kanji = require('../models/kanji');
// const Deck  = require('../models/deck');
// const lessonLength = 10;
//
// function lessonsShow(req, res) {
//   const gradeId = req.params.id.split('-')[0];
//   const kanjiId = parseInt(req.params.id.split('-')[1]);
//   const kanjisInLesson = [];
//   console.log('gradeId:', gradeId);
//   console.log('kanjiId:', kanjiId);
//   Kanji
//     .find({grade: gradeId})
//     .exec()
//     .then(kanjis => {
//       if (!kanjis) return res.status(404).render('statics/error', { error: 'No kanji characters found.'});
//       if (kanjis.length-kanjiId < lessonLength-1) {
//         for (let i=kanjiId-1; i<kanjis.length; i++) {
//           kanjisInLesson.push(kanjis[i]);
//         }
//       } else {
//         for (let i=kanjiId-1; i < kanjiId+lessonLength-1; i++) {
//           kanjisInLesson.push(kanjis[i]);
//         }
//       }
//       const jsonKanjisInLesson = JSON.stringify(kanjisInLesson);
//
//       return Deck
//         .find()
//         .exec()
//         .then(decks => {
//           console.log('%d decks were found', decks.length);
//
//           res.render('lessons/show', { jsonKanjisInLesson, decks });
//         });
//
//
//     })
//     .catch(err => {
//       res.status(500).render('error', { error: err });
//     });
// }
//
// module.exports = {
//   show: lessonsShow
// };
//
//
// //Backup
//
// // function lessonsShow(req, res) {
// //   const gradeId = req.params.id.split('-')[0];
// //   const kanjiId = parseInt(req.params.id.split('-')[1]);
// //   const kanjisInLesson = [];
// //   console.log('gradeId:', gradeId);
// //   console.log('kanjiId:', kanjiId);
// //   Kanji
// //     .find({grade: gradeId})
// //     .exec()
// //     .then(kanjis => {
// //       if (!kanjis) return res.status(404).render('statics/error', { error: 'No kanji characters found.'});
// //       if (kanjis.length-kanjiId < lessonLength-1) {
// //         for (let i=kanjiId-1; i<kanjis.length; i++) {
// //           kanjisInLesson.push(kanjis[i]);
// //         }
// //       } else {
// //         for (let i=kanjiId-1; i < kanjiId+lessonLength-1; i++) {
// //           kanjisInLesson.push(kanjis[i]);
// //         }
// //       }
// //       const jsonKanjisInLesson = JSON.stringify(kanjisInLesson);
// //       res.render('lessons/show', { jsonKanjisInLesson });
// //     })
// //     .catch(err => {
// //       res.status(500).render('error', { error: err });
// //     });
// // }
