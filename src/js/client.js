console.log('hello world');

$(function() {

  // If we're on the lesson page
  if ($('#lesson-data').length) {

    let currentIndex = 0;
    console.log($('#lesson-data').text());
    const lessonData = JSON.parse(($('#lesson-data').text()));

    // Initate the lesson elements
    updateLessonElements(lessonData, currentIndex);

    $('#btn-next').on('click', function(){
      if (currentIndex+1 === lessonData.length) {
        console.log('Time to review');
      } else {
        currentIndex++;
        updateLessonElements(lessonData, currentIndex);
      }
    });

    $('#btn-previous').on('click', function(){
      if (currentIndex === 0) {
        console.log('Reached the start');
      } else {
        currentIndex--;
        updateLessonElements(lessonData, currentIndex);
      }
    });

  }

  function updateLessonElements(lessonData, currentIndex){
    $('#character').text(lessonData[currentIndex].character);
    $('#on-jp').text(lessonData[currentIndex].onJp);
    $('#on-en').text(lessonData[currentIndex].onEn);
    $('#kun-jp').text(lessonData[currentIndex].kunJp);
    $('#kun-en').text(lessonData[currentIndex].kunEn);
    $('#meaning').text(lessonData[currentIndex].meaning);
    $('#writing-url').text(lessonData[currentIndex].writingUrl);
    $('video source').attr('src', lessonData[currentIndex].writingUrl);
    $('video')[0].load();
  }

});
