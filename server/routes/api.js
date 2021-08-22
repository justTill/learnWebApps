var express = require('express');
var router = express.Router();
var apiController = require('../controller/ApiController')
const asyncMiddleware = require('../utils/asyncMiddleware');

router.get('/chapters/', asyncMiddleware(apiController.getChapterDataWithSectionsAndLessons)); //done
router.post('/lessons/lesson/coding/check', asyncMiddleware(apiController.testCodingLesson));
router.post('/lessons/lesson/solved', asyncMiddleware(apiController.saveSolvedLesson))

router.delete('/lessons/lesson/solved/:moodleId/:moodleName', asyncMiddleware(apiController.deleteSolvedLessons))
router.delete('/lessons/lesson/solved/:chapterId/:moodleId/:moodleName', asyncMiddleware(apiController.deleteSolvedLessons))

router.get('/users/problems/', asyncMiddleware(apiController.getProblemsWithAnswers)); //done
router.post('/users/problems/problem', asyncMiddleware(apiController.saveProblem)); //done
router.post('/users/notes/note/', asyncMiddleware(apiController.saveNotes)); //done
router.get('/users/notes/', asyncMiddleware(apiController.getNotes)); //done

router.post('/users/notes/note', asyncMiddleware(apiController.insertOrUpdateNote));
router.delete('/users/notes/:moodleId/:moodleName/:noteId', asyncMiddleware(apiController.deleteNote))
router.delete('/users/problems/:moodleId/:moodleName/:problemId', asyncMiddleware(apiController.deleteProblem))
router.post('/users/problems/answer/', asyncMiddleware(apiController.saveAnswerForProblem))

module.exports = router;
