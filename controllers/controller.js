var Controller = {};

Controller.index = function (req, res, next) {
  res.render('index');
};
Controller.about = function (req, res, next) {
  res.render('about');
};
Controller.bio = function (req, res, next) {
  res.render('bio');
};
Controller.shows = function (req, res, next) {
  res.render('shows');
};
Controller.media = function (req, res, next) {
  res.render('media');
};
Controller.contact = function (req, res, next) {
  res.render('contact');
};


module.exports = Controller;