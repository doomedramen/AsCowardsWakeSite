var express = require('express');
var router = express.Router();

var Controller = require(__dirname + '/controllers/controller.js');

router.get('/', Controller.index);
router.get('/about', Controller.about);
router.get('/shows', Controller.shows);
router.get('/media', Controller.media);
router.get('/contact', Controller.contact);

router.get('/presspack',Controller.pressPack);

module.exports = router;
