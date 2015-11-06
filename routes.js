var express = require('express');
var router = express.Router();

var Controller = require(__dirname + '/controllers/controller.js');

router.get('/', Controller.index);

router.get('/bio', Controller.bio);

module.exports = router;
