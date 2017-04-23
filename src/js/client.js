console.log('hello world');

$(function() {
  if ($('#lesson-data').length) {
    console.log($('#lesson-data').text());
    const lessonData = JSON.parse(($('#lesson-data').text()));

    $('body').append(`<p id="character">lessonData[0].character: ${lessonData[0].character}</p>`);
    $('body').append(`<p id="on-jp">lessonData[0].onEn: ${lessonData[0].onJp}</p>`);
    $('body').append(`<p id="on-en">lessonData[0].onJp: ${lessonData[0].onEn}</p>`);
    $('body').append(`<p id="kun-jp">lessonData[0].kunEn: ${lessonData[0].kunJp}</p>`);
    $('body').append(`<p id="kun-en">lessonData[0].kunJp: ${lessonData[0].kunEn}</p>`);
    $('body').append(`<p id="meaning">lessonData[0].meaning: ${lessonData[0].meaning}</p>`);
    $('body').append(`<p id="writing-url">lessonData[0].writingUrl: ${lessonData[0].writingUrl}</p>`);
    $('body').append(`<video width="320" height="240" controls>
                        <source src=${lessonData[0].writingUrl} type="video/mp4">
                        Your browser does not support the video tag.
                      </video>`);

    let currentIndex = 0;
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




// <script type='text/javascript'>$</script>('#btn-next').on('click', function(){%>
//   <% if (currentIndex+1 === kanjisInLesson.length) { %>
//     <% console.log('Time to review'); %>
//   <% } else { %>
//     <script type='text/javascript'>$('#character').text(kanjisInLesson[currentIndex].character);</script>
//     <% currentIndex++; %>
//   <% } %>
// <% }); %>
