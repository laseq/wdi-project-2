console.log('hello world');

$(function() {
  if ($('.carousel').length > 0) {
    $('.carousel.carousel-slider').carousel({fullWidth: true});
    $('.prev').on('click', () => {
      $('.carousel.carousel-slider').carousel('prev');
    });

    $('.next').on('click', () => {
      $('.carousel.carousel-slider').carousel('next');
    });
  }

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

    // Retrieve the next kanji's details and display them. Stop at the last kanji.
    $('#btn-next').on('click', function(){
      if (currentIndex+1 === lessonData.length) {
        console.log('Time to review');
      } else {
        currentIndex++;
        updateLessonElements(lessonData, currentIndex);
      }
    });

    // Retrieve the previous kanji's details and display them. Stop at the first kanji.
    $('#btn-previous').on('click', function(){
      if (currentIndex === 0) {
        console.log('Reached the start');
      } else {
        currentIndex--;
        updateLessonElements(lessonData, currentIndex);
      }
    });

    // Open up a modal form when 'Add New Deck' is selected from the dropdown/select box
    $('#add-to-deck').on('change', function(){
      if ($('#add-to-deck').find(':selected').attr('id') === 'add-new-deck') {
        $('#modal1').modal('open');
        console.log('Entered #add-new-deck on click');
      } else {
        $('#add-kanji-to-deck').attr('action', `/decks/${$(this).find(':selected').attr('data-deck-id')}`);
      }
    });

    // Add the kanji to the selected deck by making an AJAX post to /decks/:id
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
      }); // End of Ajax call
    }); // End of $('#add-kanji-to-deck').submit

    // Add a new deck in the lesson and add it in the dropdown/select box
    $('#add-deck-form').submit(function(e){
      e.preventDefault();
      $.ajax({
        url: '/decks',
        type: 'post',
        data: $('#add-deck-form').serialize(),
        success: function(){
          //whatever you wanna do after the form is successfully submitted
          console.log('Ajax post worked for #add-deck-form?');

          // jQuery AJAX even shorter syntax
          $.get('/proxies/deck')
            .done(data => {
              // when using .get(), passed data will automatically point to .responseJSON
              // e.g. data === data.responseJSON from previous example
              const jsonDecks = JSON.parse($(data).find('#proxy-data').text());

              // Put this data into the dropdown/select boxes
              $('#add-to-deck').empty();
              $('#add-to-deck').append('<option selected="selected" disabled="disabled">Select a deck</option>');
              $('#add-to-deck').append('<option id="add-new-deck" href="#modal1">Add New Deck</option>');
              jsonDecks.forEach(deck => {
                console.log(deck);
                $('#add-to-deck').append(`<option data-deck-id="${deck._id}" value="${deck.name}">${deck.name}</option>`);
              });
              // The Materialize select box needs to be reloaded for the new info to be displayed
              $('select').material_select();
            })
            .fail(err => {
              console.log(err);
            });
        }
      });
      $('#modal1').modal('close');
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
    $('#kanji-to-add').attr('value', lessonData[currentIndex]._id);
  }

  // Add kanjis to the deck from the deck show page
  $('#add-kanji-to-deck-show').submit(function(e){
    e.preventDefault();
    $.ajax({
      url: '/proxies/onekanjitodeck',
      type: 'post',
      data: $('#add-kanji-to-deck-show').serialize(),
      success: function(result){
        console.log('Ajax post worked for #btn-kanji-add-deck-show');
        //console.log(result);
        const jsonKanji = JSON.parse($(result).find('#proxy-data').text());
        console.log(jsonKanji);

        // Add the data in the deck
        if ($('.no-kanji-in-deck').length) {
          $('.no-kanji-in-deck').remove();
          $('main').append('<ul>');
        }
        $('ul').last().append(`<a href="/kanjis/${jsonKanji._id}/${$('#deck-show-id').val()}">
        <li class="deck-kanji-li" data="${jsonKanji._id}"></li></a>`);
        $('.deck-kanji-li').last().append(`<p>${jsonKanji.character}</p>`);
        $('.deck-kanji-li').last().append(`<p>${jsonKanji.onJp}</p>`);
        $('.deck-kanji-li').last().append(`<p>${jsonKanji.kunJp}</p>`);
        $('.deck-kanji-li').last().append(`<p>${jsonKanji.meaning}</p>`);
      } // End of Ajax success function
    }); // End of Ajax call
  }); // End of $('#add-kanji-to-deck').submit


}); // End of document.ready function
