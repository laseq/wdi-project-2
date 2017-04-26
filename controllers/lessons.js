const Lesson = require('../models/lesson');

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
  Lesson
  .findById(req.params.id)
  .populate('kanjis')
  .exec()
  .then(lesson => {
    res.render('lessons/show', { lesson });
  })
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
