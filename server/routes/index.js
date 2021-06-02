var express = require('express');
var router = express.Router();
var controller = require('../controller/exampleWorker')
router.get('/', controller.firstFunc);

module.exports = router;
