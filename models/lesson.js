const mongoose  = require('mongoose');

const lessonSchema = new mongoose.Schema({
  grade: { type: String, trim: true, required: true },
  totalKanji: { type: Number, default: 0 },
  kanjis: [ { type: mongoose.Schema.ObjectId, ref: 'Kanji' } ]
});

lessonSchema.pre('save', function(next) {
  this.totalKanji = this.totalKanji+1;
  next();
});

lessonSchema.statics.findOneByGradeAndNumberOfKanjiAndCreateOrUpdate = function(max, kanji) {
  return new Promise((resolve, reject) => {
    const model  = this;
    const Lesson = this.model('Lesson');

    model
    .findOne({
      grade: kanji.grade,
      totalKanji: { $lte: max }
    }, function(err, lesson) {
      console.log(lesson);

      // If something has gone wrong... fail
      if (err) return reject(err);
      // If there are no lessons... then create one
      if (!lesson) {
        console.log(`Creating lesson with grade: ${kanji.grade}`);
        Lesson.create({
          grade: kanji.grade
        }, function(err, lesson) {
          if (err) return reject(err);
          lesson.kanjis.push(kanji._id);
          lesson.save(function(err, lesson) {
            if (err) return reject(err);
            return resolve(lesson);
          });
        });
      } else {
        // If the is a lesson with that grade and less than 10 kanji
        // then add this kanji and save
        console.log(`Updating lesson ${lesson._id}`);
        lesson.kanjis.addToSet(kanji._id);
        lesson.save(function(err, lesson) {
          if (err) return reject(err);
          console.log(`${lesson.totalKanji} now in lesson`);
          return resolve(lesson);
        });
      }
    });
  });
};

module.exports = mongoose.model('Lesson', lessonSchema);
