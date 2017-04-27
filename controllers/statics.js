function staticsIndex(req, res) {
  return res.render('statics/home', { path: '/' });
}

module.exports = {
  index: staticsIndex
};
