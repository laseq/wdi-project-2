const Kanji = require('../models/kanji');
const lessonLength = 10;

function lessonsShow(req, res) {
  const gradeId = req.params.id.split('-')[0];
  const kanjiId = parseInt(req.params.id.split('-')[1]);
  const kanjisInLesson = [];
  console.log('gradeId:', gradeId);
  console.log('kanjiId:', kanjiId);
  Kanji
    .find({grade: gradeId})
    .exec()
    .then(kanjis => {
      if (!kanjis) return res.status(404).render('statics/error', { error: 'No kanji characters found.'});
      if (kanjis.length-kanjiId < lessonLength-1) {
        for (let i=kanjiId-1; i<kanjis.length; i++) {
          kanjisInLesson.push(kanjis[i]);
        }
      } else {
        for (let i=kanjiId-1; i < kanjiId+lessonLength-1; i++) {
          kanjisInLesson.push(kanjis[i]);
        }
      }
      const jsonKanjisInLesson = JSON.stringify(kanjisInLesson);
      res.render('lessons/show', { jsonKanjisInLesson });
    })
    .catch(err => {
      res.status(500).render('error', { error: err });
    });
}

module.exports = {
  show: lessonsShow
};