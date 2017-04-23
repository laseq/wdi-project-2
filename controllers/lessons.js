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

// Storing the lessons/show code
// <% kanjisInLesson.forEach(kanji => { %>
//   <p><%= kanji.character %></p>
// <% }); %>

// Storing the lessons/show code
// <p id="character"><%= kanjisInLesson[0].character %></p>
// <p>On</p>
// <p id="on-jp"><%= kanjisInLesson[0].onJp %></p>
// <p id="on-en"><%= kanjisInLesson[0].onEn %></p>
// <p>Kun</p>
// <p id="kun-jp"><%= kanjisInLesson[0].kunJp %></p>
// <p id="kun-en"><%= kanjisInLesson[0].kunEn %></p>
// <p>Meaning</p>
// <p id="meaning"><%= kanjisInLesson[0].meaning %></p>
// <p>How to write</p>
// <video width="320" height="240" controls>
//   <source id="writing-url" src="<%= kanjisInLesson[0].writingUrl %>" type="video/mp4">
//   Your browser does not support the video tag.
// </video>
//
// <button id='btn-previous' type="button" name="button">Previous</button>
// <button id='btn-next' type="button" name="button">Next</button>
//
// <script>$( document ).ready(function() {
//   let currentIndex = 0;
//   document.getElementById('btn-next').addEventListener('click', function(){
//     if (currentIndex+1 === 10) {
//       console.log('Time to review');
//     } else {
//       document.getElementById('#character').html(kanjisInLesson[10].character);
//       currentIndex++;
//     }
//   });
// });</script>
//
//
// <% kanjisInLesson.forEach(kanji => { %>
//   <p><%= kanji.character %></p>
//   <p>On</p>
//   <p><%= kanji.onJp %></p>
//   <p><%= kanji.onEn %></p>
//   <p>Kun</p>
//   <p><%= kanji.kunJp %></p>
//   <p><%= kanji.kunEn %></p>
//   <p>Meaning</p>
//   <p><%= kanji.meaning %></p>
//   <p>How to write</p>
//   <video width="320" height="240" controls>
//     <source src="<%= kanji.writingUrl %>" type="video/mp4">
//     Your browser does not support the video tag.
//   </video>
// <% }); %>
