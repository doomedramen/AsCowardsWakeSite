var express = require('express');
var router = express.Router();

var Index = require(__dirname + '/controllers/index.js');

router.get('/', Index.index);

module.exports = router;
