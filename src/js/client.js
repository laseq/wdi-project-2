console.log('hello world');

$(function() {
  // To enable the 'select' dropdown boxes in Materialize
  $('select').material_select();
  //$('.modal-trigger').leanModal();
  $('.modal').modal();

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

    $('#add-to-deck').on('change', function(){
      if ($('#add-to-deck').val('Add New Deck')) {
        $('#modal1').modal('open');
        console.log('Entered #add-new-deck on click');
      } else {
        $('#add-kanji-to-deck').attr('action', `/decks/${$(this).find(':selected').attr('data-deck-id')}`);
      }
    });

    $('#add-kanji-to-deck').submit(function(e){
      e.preventDefault();
      $.ajax({
        url: `/decks/${$('#add-to-deck').find(':selected').attr('data-deck-id')}`,
        type: 'post',
        data: $('#add-kanji-to-deck').serialize(),
        success: function(){
          //whatever you wanna do after the form is successfully submitted
          console.log('Ajax post worked for #add-kanji-to-deck?');
        }
      });
    });

    $('#add-deck-form').submit(function(e){
      e.preventDefault();
      $.ajax({
        url: '/decks',
        type: 'post',
        data: $('#add-deck-form').serialize(),
        success: function(){
          //whatever you wanna do after the form is successfully submitted
          console.log('Ajax post worked for #add-deck-form?');

          // Use the more generic $.ajax to do the same request
          // $.ajax({
          //   url: 'https://api.doughnuts.ga/doughnuts/1',
          //   method: 'GET', // GET by default
          //   dataType: 'json' // Intelligent Guess by default (xml, json, script, or html)
          // }).done((data) => console.log(data));

          // jQuery AJAX even shorter syntax
          $.get('https://ga-doughnuts.herokuapp.com/doughnuts')
            .done(data => {
              // when using .get(), passed data will automatically point to .responseJSON
              // e.g. data === data.responseJSON from previous example
              console.log(data);
            })
            .fail(err => {
              console.log(err);
            });


        }
      });
      $('#modal1').modal('close');
    });

    // $('#add-this-kanji').on('click', function(e){
    //   e.preventDefault;
    // });

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
    $('#kanji-to-add').attr('value', lessonData[currentIndex]._id);
  }



});
