var Controller = {};

Controller.index = function (req, res, next) {
  res.render('index');
};

Controller.bio = function (req, res, next) {
  res.render('bio');
}


module.exports = Controller;