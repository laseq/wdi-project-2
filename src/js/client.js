console.log('client.js loaded');

$(function() {

  let lessonProgressCount = 0;

  $('.button-collapse').sideNav();

  if ($('.carousel').length > 0) {
    $('.carousel.carousel-slider').carousel({ fullWidth: true });

    $('.prev').on('click', () => {
      if (!$('#lesson-show-page').length){
        $('.carousel.carousel-slider').carousel('prev');
      } else if (lessonProgressCount > 0) {
        $('.carousel.carousel-slider').carousel('prev');
        lessonProgressCount--;
      }
      console.log('lessonProgressCount', lessonProgressCount);
    });

    $('.next').on('click', () => {
      if (!$('#lesson-show-page').length) {
        $('.carousel.carousel-slider').carousel('next');
      } else if (lessonProgressCount < parseInt($('#proxy-data').text())-2) {
        $('.carousel.carousel-slider').carousel('next');
        lessonProgressCount++;
      } else if (lessonProgressCount === parseInt($('#proxy-data').text())-2) {
        $('.carousel.carousel-slider').carousel('next');
        lessonProgressCount++;
        console.log('End of lesson');
        $('.next-lesson').css('visibility', 'visible');
        // At end of lesson, make some transition across the screen
        // Possibly a link to the next lesson
        // Mark this on the user's progress that the lesson has been completed
        // And mark this lesson with a green mark somewhere
        // functionToRunAtEndOfLesson();
      }
      console.log('lessonProgressCount', lessonProgressCount);

    });

    $('#addToDeck form').on('submit', (e) => {
      e.preventDefault();

      const data   = {
        deckId: $('#addToDeck form input[name=deck]:checked').val(),
        kanjiId: $('.active h1').data('id')
      };

      $.post(`/decks/${data.deckId}/add`, data)
      .done(data => {
        console.log('SUCCESS', data);
        $('#addToDeck').modal('close');
      })
      .fail(console.error);
    });


    $('#remove-kanji').on('click', (e) => {
      e.preventDefault();

      const data   = {
        deckId: $('#h3-deck-name').attr('data'),
        kanjiId: $('.active h1').data('id')
      };

      $.ajax({
        url: `/kanjis/${data.kanjiId}/${data.deckId}`,
        type: 'delete'
      }).done(() => {
        console.log('done');
        //$('.carousel.carousel-slider').carousel();
      });
    });

    $('#add-new-deck-lesson').on('click', function(){
      $('#addToDeck').modal('close');
    });

    // Add a new deck in the lesson and add it in the modal '#addToDeck'
    $('#add-deck-form').submit(function(e){
      e.preventDefault();
      $.ajax({
        url: '/decks',
        type: 'post',
        data: $('#add-deck-form').serialize(),
        success: function(){
          console.log('Ajax post worked for #add-deck-form');

          // jQuery AJAX
          $.get('/proxies/deck')
            .done(data => {
              const jsonDecks = JSON.parse($(data).find('#proxy-data').text());
              console.log(jsonDecks);
              const lastDeck = jsonDecks[jsonDecks.length-1];
              console.log(lastDeck);

              $('.deck-name-holder').append(`<p><input type="radio" id="deck-${lastDeck._id}" name="deck" value="${lastDeck._id}"><label for="deck-${lastDeck._id}">${lastDeck.name}</label></p>`);

            })
            .fail(err => {
              console.log(err);
            });
        }
      });
      $('#modal1').modal('close');
    });

    // Get kanji on carousel with button click on displayed kanji
    $('.kanjis-in-deck a').on('click', function(e){
      e.preventDefault();
      const thisIndex = $(this).attr('data');
      console.log('thisIndex', thisIndex);
      $('.carousel.carousel-slider').carousel('set', thisIndex);
      //$('.carousel').carousel('set', 4);
    });

  }

  // The code below is redundant as the lessons page has been changed
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
    // $('#add-deck-form').submit(function(e){
    //   e.preventDefault();
    //   $.ajax({
    //     url: '/decks',
    //     type: 'post',
    //     data: $('#add-deck-form').serialize(),
    //     success: function(){
    //       //whatever you wanna do after the form is successfully submitted
    //       console.log('Ajax post worked for #add-deck-form?');
    //
    //       // jQuery AJAX even shorter syntax
    //       $.get('/proxies/deck')
    //         .done(data => {
    //           // when using .get(), passed data will automatically point to .responseJSON
    //           // e.g. data === data.responseJSON from previous example
    //           const jsonDecks = JSON.parse($(data).find('#proxy-data').text());
    //
    //           // Put this data into the dropdown/select boxes
    //           $('#add-to-deck').empty();
    //           $('#add-to-deck').append('<option selected="selected" disabled="disabled">Select a deck</option>');
    //           $('#add-to-deck').append('<option id="add-new-deck" href="#modal1">Add New Deck</option>');
    //           jsonDecks.forEach(deck => {
    //             console.log(deck);
    //             $('#add-to-deck').append(`<option data-deck-id="${deck._id}" value="${deck.name}">${deck.name}</option>`);
    //           });
    //           // The Materialize select box needs to be reloaded for the new info to be displayed
    //           $('select').material_select();
    //         })
    //         .fail(err => {
    //           console.log(err);
    //         });
    //     }
    //   });
    //   $('#modal1').modal('close');
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
