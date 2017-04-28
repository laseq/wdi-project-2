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

## Tools used
* Javascript/jQuery
* Express JS
* Node JS
* Mongo DB & Mongoose
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

The code to connect to the API utilised [request-promise](https://github.com/request/request-promise) with the format:

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
      ...and so on
    }); 
```
I chose to use the Japanese school grade convention in my app as the Kanji Alive API had grade properties attached to the Kanji characters.

##End Product

![](https://cloud.githubusercontent.com/assets/15388548/25550629/9f324124-2c72-11e7-9216-61da7935a8c3.png)
**Homepage with Materialize Parallax effect**

![](https://cloud.githubusercontent.com/assets/15388548/25550508/8aea3588-2c71-11e7-8152-66c50d93719d.png)
**Lessons grouped by grades**

![](https://cloud.githubusercontent.com/assets/15388548/25550296/e795407c-2c6f-11e7-8945-3404b8c5e743.png)
**Lesson selection**

![](https://cloud.githubusercontent.com/assets/15388548/25550314/0ba22192-2c70-11e7-9faf-f2805b316d64.png)
**Lesson Experience**

![](https://cloud.githubusercontent.com/assets/15388548/25508731/123d964a-2bac-11e7-91b8-8efef657178e.png)
**Kanji Browsing**

![](https://cloud.githubusercontent.com/assets/15388548/25550337/35b4a1d0-2c70-11e7-9330-06d707c8bae1.png)
**Kanji Browsing**

![](https://cloud.githubusercontent.com/assets/15388548/25550369/5935631a-2c70-11e7-9fa8-8ee99d96f3c7.png)
**Adding Kanji to a deck**

##Final Thoughts
Although I fulfilled the requirements of the project brief, I did not manage to make Kanji Kaigou a full Kanji learning experience due to time constraints. I would therefore like to make the following proposed improvements to the app.

###Proposed Improvements

* Functionality to keep track of a user's progress so that they can view their completed lessons and carry on learning from where they left off.
* Improve the learning experience by having more content within lessons as it's available through the API.
* Reviews after every lesson
* Reviews by different grades, all kanji, decks, user selected lessons and completed lessons
* A search function so that user's can search Kanji by English and Japanese keywords