var express = require('express');
var router = express.Router();
var userController = require('../controller/UserController')
var ltiController = require('../controller/LTIController')
const isLoggedIn = require('../utils/logIn').loggedIn;
const asyncMiddleware = require('../utils/asyncMiddleware');
//User
router.get('/overview', isLoggedIn, asyncMiddleware(userController.showUserOverview))
router.get('/notifications', isLoggedIn, asyncMiddleware(userController.showUserNotifications))
router.get('/logout', isLoggedIn, userController.logout);
router.get('/manual', isLoggedIn, userController.openManual);

router.post('/test', userController.handleLTILaunch);
router.get('/lti/registration/', (req, res, next) => {
    res.render("LTI/registration")
});
router.post('/lti/registration', ltiController.handleLTIRegistration)

router.post('/login', userController.authenticate);

router.post('/deleteProblem', userController.deleteProblem);
router.post('/markAsRead', userController.markProblemAsSeen);
router.post('/saveAnswerOnProblem', userController.saveAnswerOnProblem);

module.exports = router;