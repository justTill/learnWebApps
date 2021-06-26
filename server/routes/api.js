var express = require('express');
var router = express.Router();
var apiController = require('../controller/ApiController')
const asyncMiddleware = require('../utils/asyncMiddleware');

router.get('/chapters/', apiController.createUserIfNotExist, asyncMiddleware(apiController.getChapterDataWithSectionsAndLessons));

module.exports = router;
