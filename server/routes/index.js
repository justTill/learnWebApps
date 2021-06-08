var express = require('express');
var router = express.Router();
var controller = require('../controller/exampleWorker')
var UserRepository = require("../persistence/UserRepository")
const asyncMiddleware = require('../utils/asyncMiddleware');

router.get('/', asyncMiddleware(async (req, res, next) => {
    let result = await UserRepository.findByEmail("email")
    res.send(result)
}));

//router.post('/login',);

module.exports = router;
