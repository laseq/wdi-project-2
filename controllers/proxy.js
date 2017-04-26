// const Deck  = require('../models/deck');
// const Kanji  = require('../models/kanji');
//
// function proxyGetDecks(req, res, next) {
//   //const data = 1;
//   Deck
//     .find()
//     .exec()
//     .then(decks => {
//       const jsonData = JSON.stringify(decks);
//       res.render('proxies/deck', { jsonData });
//     })
//     .catch(err => {
//       console.log('Error in proxyGetDecks: ', err);
//     });
// }
//
// // This is for a POST method
// // function proxyGetOneKanji(req, res, next) {
// //   //const data = 1;
// //   Kanji
// //     .findOne({ character: req.body.character })
// //     .exec()
// //     .then(kanjiItem => {
// //       const jsonData = JSON.stringify(kanjiItem);
// //       res.render('proxies/onekanji', { jsonData });
// //     })
// //     .catch(err => {
// //       console.log('Error in proxyGetOneKanji:', err);
// //     });
// // }
//
// function proxyGetOneKanji(req, res, next) {
//   //const data = 1;
//   Kanji
//     .findOne({ character: req.body.character })
//     .exec()
//     .then(kanjiItem => {
//       const jsonData = JSON.stringify(kanjiItem);
//       res.render('proxies/onekanji', { jsonData });
//     })
//     .catch(err => {
//       console.log('Error in proxyGetOneKanji:', err);
//     });
// }
//
// function proxyAddOneKanji(req, res, next) {
//   Kanji
//     .findOne({ character: req.body.character })
//     .exec()
//     .then(kanjiItem => {
//       //console.log(kanjiItem);
//       // console.log(req.body);
//       //console.log('kanjiItem', kanjiItem);
//       const jsonData = JSON.stringify(kanjiItem);
//       console.log('jsonData', jsonData);
//       res.render('proxies/onekanjitodeck', { jsonData });
//
//       // This is a modified version of the decksUpdate function
//       return Deck.findById(req.body._id)
//         .then(deck => {
//           if(!deck) return res.status(404).render('statics/404');
//           deck.kanjis.push(kanjiItem._id);
//           return deck.save();
//         });
//
//     })
//     .then(deck => {
//       //console.log(deck);
//       //const jsonData = deck;
//       //res.render('proxies/deck', { jsonData });
//     })
//     .catch(err => {
//       console.log('Error in proxyGetOneKanji:', err);
//     });
// }
//
// // function decksUpdate(req, res, next) {
// //   Deck
// //     .findById(req.params.id)
// //     .then((deck) => {
// //       if(!deck) return res.status(404).render('statics/404');
// //
// //       // for(const field in req.body) {
// //       //   deck[field] = req.body[field];
// //       // }
// //       for(const field in req.body) {
// //         if (Array.isArray(deck[field])) {
// //           deck[field].push(req.body[field]);
// //         } else {
// //           deck[field] = req.body[field];
// //         }
// //       }
// //
// //
// //       return deck.save();
// //     })
// //     .then((deck) => res.redirect(`/decks/${deck.id}`))
// //     .catch(next);
// // }
//
//
// module.exports = {
//   decksIndex: proxyGetDecks,
//   getKanji: proxyGetOneKanji,
//   addKanji: proxyAddOneKanji
// };
