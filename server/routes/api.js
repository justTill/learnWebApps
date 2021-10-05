var express = require('express');
var router = express.Router();
var apiController = require('../controller/ApiController')
const asyncMiddleware = require('../utils/asyncMiddleware');

router.get('/chapters/', asyncMiddleware(apiController.getChapterDataWithSectionsAndLessons));
router.get('/lti/key/healthCheck/', apiController.healthCheck);

router.post('/lessons/lesson/coding/check', asyncMiddleware(apiController.testCodingLesson));
router.post('/lessons/lesson/solved', asyncMiddleware(apiController.saveSolvedLesson));
router.delete('/lessons/lesson/solved/', asyncMiddleware(apiController.deleteSolvedLessons));
router.delete('/lessons/lesson/solved/:chapterId/', asyncMiddleware(apiController.deleteSolvedLessons));

router.post('/users/notes/note/', asyncMiddleware(apiController.saveNotes));
router.get('/users/notes/', asyncMiddleware(apiController.getNotes));
router.post('/users/notes/note/:noteId', asyncMiddleware(apiController.saveNotes));
router.delete('/users/notes/:noteId', asyncMiddleware(apiController.deleteNote));

router.get('/users/problems/', asyncMiddleware(apiController.getProblemsWithAnswers));
router.post('/users/problems/problem', asyncMiddleware(apiController.saveProblem));
router.delete('/users/problems/:problemId', asyncMiddleware(apiController.deleteProblem))
router.post('/users/problems/answer/', asyncMiddleware(apiController.saveAnswerForProblem))

module.exports = router;
