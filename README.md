# WDI Project #2: A Full-stack Application

## Project Brief

**Build a full-stack RESTful application in six days** that includes **authentication**.

**Build an Express application** that has a **Mongo** database using the **Mongoose ORM**.

### Technical Requirements

* Have at _least_ 2 models
* Incude relationships between models
* Authentication with encrypted passwords
* Have complete RESTful routes with all CRUD actions.
* Use SCSS
* Include wireframes
* Semantically clean HTML
* Be deployed online

#### Bonus Requirements
* Include data from an API
* Add automated tests


## Project Summary

![](https://cloud.githubusercontent.com/assets/15388548/25550629/9f324124-2c72-11e7-9216-61da7935a8c3.png)

My project of choice was a web app to enable learners of Japanese to improve their Kanji (Japanese symbol) competence. As a learner of the Japanese language I felt that it would be an exciting project to embark on. Such an app would fulfil the project requirements with RESTful routes and include some logic for lesson reviews.

### Link to project
[https://whispering-harbor-84338.herokuapp.com](https://whispering-harbor-84338.herokuapp.com).

## Tools used
* JavaScript/jQuery
* Express.js
* Node.js
* MongoDB & Mongoose
* HTML/CSS/SCSS
* Materialize CSS Framework
* BCrypt
* Bluebird
* Nodemon
* Gulp
* Babel

## Initial Planning
#### Functionality that I wanted out of the app:
* Enable a user to sign in to have a personalised experience.
* Enable a user to learn Kanji characters in small lessons and have a reviewing session after the lesson to recap the material that they have learnt.
* Kanji characters should follow either the JLPT or the Japanese school grade structure
* A user should be able to review all Kanji characters, characters by JLPT level/grade and kanji characters in completed lessons.
* Enable users to build Kanji decks for reference or for personalised reviewing sessions, and to fulfil the RESTful requirements of the project.

#### Wireframing

![wireframes](https://cloud.githubusercontent.com/assets/15388548/25550146/a4818b84-2c6e-11e7-8cdc-6ed08f378d9e.png)
**Authentication, Dashboard, Lesson Index and Lesson Experience**

### Models
I identified the following schemas that needed to be created in order to provide the app functionality.

* Kanji - To hold data acquired from the Kanji Alive API
* User - For the user to have a personalised experience
* Deck - A User would be able to create decks to store Kanji characters.
* Lesson - To create and store lesson information. A User would be able to keep a record of completed lessons.

This required relationships between the Kanji, User and Deck models. The User could have many Decks, and a Deck could have many Kanji characters.

Users would be able to keep track of many completed lessons, and lessons would hold a number of Kanji characters.

I opted to work with Referenced sub-documents as they would fit the requirements.

```
const deckSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  kanjis: [{ type: mongoose.Schema.ObjectId, ref: 'Kanji' }],
  user: { type: mongoose.Schema.ObjectId, ref: 'User' }
});
```
**A Deck can have many Kanji characters, and one User**
### Japanese Language API
I needed a Japanese Kanji API that provided data in JSON format in order to work on my project. I came across a great API by a project known as Kanji Alive.

You can visit the project [here](https://app.kanjialive.com/search) and the project's GitHub page [here](https://github.com/kanjialive/data-media).

### Using the API

I downloaded the Kanji details from the API and inserted the data into my Kanji schema in the database using a 'seeds' file. After the initial API call, I intended to use just the data in my database for the app functions to get the most practice with learning Mongo DB.

The API call gets the entire database of Kanji characters and I stored them in my Kanji model. The code to connect to the API utilised [request-promise](https://github.com/request/request-promise) with the format:

```
var options = {
  uri: 'https://kanjialive-api.p.mashape.com/api/public/kanji/all',
  headers: {
    'X-Mashape-Key': env.mashapeKey
  },
  json: true
};

requestPromise(options)
.then(function (repos) {
  return bluebird.map(repos, item =>{
    return Kanji.create({
      character: item.kanji.character || 'No data',
      onJp: item.kanji.onyomi.katakana || 'No data',
      onEn: item.kanji.onyomi.romaji || 'No data',
      kunJp: item.kanji.kunyomi.hiragana || 'No data',
      kunEn: item.kanji.kunyomi.romaji || 'No data',
      meaning: item.kanji.meaning.english || 'No data',
      grade: item.references.grade || '7',
      writingUrl: item.kanji.video.mp4 || 'No data'
    });
   })
   .then(kanjis => {
    console.log('Kanji collection has %d kanjis', kanjis.length);

    return bluebird.mapSeries(kanjis, kanji => {
      return Lesson.findOneByGradeAndNumberOfKanjiAndCreateOrUpdate(10, kanji);
    });
  })
  ... and so on
```
I chose to use the Japanese school grade convention in my app as the Kanji Alive API had grade properties attached to the Kanji characters.

The piece of code `Lesson.findOneByGradeAndNumberOfKanjiAndCreateOrUpdate(10, kanji);` in the seeds file calls a function in the Lesson model that sorts all Kanji characters by grade in lessons of 10.

### Displaying the Kanji deck page

The user can create a deck and add Kanji characters to the deck and view them. In order to view a selection of Kanji characters to add to the deck you are currently in, I needed to find a way of sorting all Kanji characters  by grade on the server side so that it could easily be presented on the client side. The code to sort it on the server side in the decks controller is as follows:

```
function decksShow(req, res, next) {
  const p1 = Deck
  .findById(req.params.id)
  .exec()
  .then((deck) => {
    if (!deck) return res.status(404).render('statics/404');
    return Deck.populate(deck, { path: 'kanjis'});
  });

  const p2  = Kanji.find({ grade: '1' }).exec();
  const p3  = Kanji.find({ grade: '2' }).exec();
  const p4  = Kanji.find({ grade: '3' }).exec();
  const p5  = Kanji.find({ grade: '4' }).exec();
  const p6  = Kanji.find({ grade: '5' }).exec();
  const p7  = Kanji.find({ grade: '6' }).exec();
  const p8  = Kanji.find({ grade: '7' }).exec();

  // Native Node method, NOT bluebird
  Promise.all([p1, p2, p3, p4, p5, p6, p7, p8])
  .then((values) => {
    const kanjiGradeArray = [values[1], values[2], values[3], values[4], values[5], values[6], values[7]];

    res.render('decks/show', {
      deck: values[0],
      allKanjis: kanjiGradeArray
    });
  })
  .catch(next);
}
``` 
Because of the asynchronous behaviour of querying the database, I needed to use promises to ensure that all queries were done prior to rendering the information to the destination page. The first promise `p1` finds the deck that the user specifies and populates the Kanji in that deck (if any). The rest of the promises query the database to find Kanji characters within the relevant grades.

When all the queries have finished returning their data, the promises are fulfilled and the code within `Promise.all()` gets initiated. The deck data is assigned to a variable called `deck` while the Kanji characters sorted by grade are placed in an array called `kanjiGradeArray` which gets stored in a variable called `allKanjis`. These two variables are then sent to the `decks/show` page where `deck` is used to show all information pertaining to the current deck while `allKanjis` is used to display the selection of Kanji  characters to choose from to add to your deck.

![](https://cloud.githubusercontent.com/assets/15388548/25550369/5935631a-2c70-11e7-9fa8-8ee99d96f3c7.png)
**Adding Kanji to a deck**

### Displaying Kanji characters in the carousel

Displaying Kanji characters on the carousel is straightforward. It involves querying the database to find all Kanji characters, or if a query is provided, for example querying by grade, the Kanji characters from that grade will by displayed.

```
function kanjisIndex(req, res, next) {
  const p1 = Kanji.find(req.query).exec();
  // Find decks where you are the owner
  const p2 = Deck.find({ user: res.locals.user._id}).exec();

  // Native Node method, NOT bluebird
  Promise.all([p1, p2])
  .then((values) => res.render('kanjis/index', {
    kanjis: values[0],
    decks: values[1]
  }))
  .catch(next);
}
```

The information can then be used on the kanjis/index.ejs page. The code below shows how the kanji details are shown on the carousel. The classes such as `kanji-main` and `text-group onyomi` have css properties that position them on the carousel.

```
<div class="carousel carousel-slider center">
  <% kanjis.forEach(kanji => { %>
    <div class="carousel-item white black-text">

        <div class="kanji-main">
          <h1 data-id="<%= kanji._id %>"><%= kanji.character %></h1>
        </div>

        <div class="text-group onyomi">
          <h5 class="black-text jp-text"><%= kanji.onJp %></h5>
          <h5 class="black-text en-text"><%= kanji.onEn %></h5>
        </div>

        <div class="text-group kunyomi">
          <h5 class="black-text jp-text"><%= kanji.kunJp %></h5>
          <h5 class="black-text en-text"><%= kanji.kunEn %></h5>
        </div>

        <div class="text-group meaning">
          <h5 class="black-text meaning-text"><%= kanji.meaning %></h5>
        </div>

    </div>
  <% }); %>
</div>
```


![](https://cloud.githubusercontent.com/assets/15388548/25508731/123d964a-2bac-11e7-91b8-8efef657178e.png)
**Kanji Browsing**

The characters can be displayed by grade using the code below. When a grade button is clicked, the `kanjisIndex` function is run with `?grade=<%= i %>` being used as the query.

```
<h4>Browse by grade</h4>

<ul class="grade-ul">
	<a class="grade-sort" href="/kanjis"><li>All</li></a>
	<% for (let i=1; i< 8; i++) { %>
	  <a class="grade-sort" href="/kanjis?grade=<%= i %>"><li><%= i %></li></a>
	<% } %>
</ul>
```


##End Product

![](https://cloud.githubusercontent.com/assets/15388548/25550508/8aea3588-2c71-11e7-8152-66c50d93719d.png)
**Lessons grouped by grades**

![](https://cloud.githubusercontent.com/assets/15388548/25550296/e795407c-2c6f-11e7-8945-3404b8c5e743.png)
**Lesson selection**

![](https://cloud.githubusercontent.com/assets/15388548/25550314/0ba22192-2c70-11e7-9faf-f2805b316d64.png)
**Lesson Experience**

![](https://cloud.githubusercontent.com/assets/15388548/25550337/35b4a1d0-2c70-11e7-9330-06d707c8bae1.png)
**Kanji Browsing on the Kanji Index page**

##Final Thoughts
Although I fulfilled the requirements of the project brief, I did not manage to make Kanji Kaigou a full Kanji learning experience due to time constraints. I would therefore like to make the following proposed improvements to the app.

###Proposed Improvements

* Functionality to keep track of a user's progress so that they can view their completed lessons and carry on learning from where they left off.
* Improve the learning experience by having more content within lessons as it's available through the API.
* Reviews after every lesson
* Reviews by different grades, all kanji, decks, user selected lessons and completed lessons
* A search function so that user's can search Kanji by English and Japanese keywords

### Link to project
[https://whispering-harbor-84338.herokuapp.com](https://whispering-harbor-84338.herokuapp.com).