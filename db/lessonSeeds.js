const mongoose    = require('mongoose');
mongoose.Promise  = require('bluebird');
const bluebird    = require('bluebird');
const rp          = require('request-promise');
const env         = require('../config/env');
const databaseURL = env.db;
const Kanji       = require('../models/kanji');
const Lesson      = require('../models/lesson');

const lessonSize  = 10;
let tempLessonArray = [];

mongoose.connect(databaseURL);

Lesson.collection.drop();

Kanji
  .find({ grade: '1' })
  .exec()
  .then(kanjis => {

    const lessonKanjis = [];

    while (kanjis.length > 0) {
      lessonKanjis.push(kanjis.splice(0, lessonSize));
    }



    for (let i=0; i<lessonKanjis.length; i++) {
      tempLessonArray[i] = {
        grade: 1,
        lessonNumber: i,
        kanjis: lessonKanjis[i]['character']
      };
    }

    console.log('tempLessonArray[7]', tempLessonArray[7]);

    bluebird.map(tempLessonArray, item =>{
      return Lesson.create({
        grade: item.grade || 'No data',
        lessonNumber: item.lessonNumber|| 'No data',
        kanjis: item.kanjis || ['No data']
      });
    });

  })
  .then(lessons => {
    console.log('lessons', lessons);
  })
  .catch(err => {
    console.log('Error', err);
  })
  .finally(()=>{
    mongoose.connection.close();
  });
