var chapterRepository = require("../persistence/ChapterRepository")
var sectionRepository = require("../persistence/SectionRepository")
var userRepository = require("../persistence/UserRepository")
var lessonRepository = require("../persistence/LessonRepository")
var codeExecutionService = require("../service/CodeExecutionService")
const lti = require('ltijs').Provider

const LessonTypes = Object.freeze({
    INFORMATION: "information",
    CODE: "codingLesson",
    CODEEXTENSION: "codeExtensionLesson",
    FILLTHEBLANK: "fillTheBlankLesson",
    SINGLEMULTIPLECHOICE: "singleMultipleChoiceLesson"
})
exports.getProblemsWithAnswers = async function (req, res, next) {
    let data = {problems: []}
    if (res.locals && res.locals.token && res.locals.token.user && res.locals.token.userInfo.name) {
        let userId = res.locals.token.user;
        let userName = res.locals.token.userInfo.name;
        let problemsWithAnswers = await userRepository.findProblemsAndAnswersByUser(userId, userName)
        data.problems = mapToOutputProblem(problemsWithAnswers)
    }
    res.send(data)
}
exports.healthCheck = function (req, res, next) {
    let body = {valid: false}
    if (res.locals && res.locals.token && res.locals.token.user && res.locals.token.userInfo.name) {
        let userName = res.locals.token.userInfo.name;
        body.userName = userName
        body.valid = true
    }
    res.send(body)
}
exports.getChapterDataWithSectionsAndLessons = async function (req, res, next) {
    let data = {chapters: []}
    let moodleId = null
    if (res.locals && res.locals.token && res.locals.token.user && res.locals.token.userInfo.name) {
        let userId = res.locals.token.user;
        let userName = res.locals.token.userInfo.name;
        let user = await userRepository.findUserByMoodleIdAndMoodleName(userId, userName)
        if (user.length !== 0) {
            moodleId = userId
        }
    }
    let chapters = await chapterRepository.findAll()
    for (let chapter of chapters) {
        let mappedChapter = await mapToOutputChapter(chapter, moodleId)
        data.chapters.push(mappedChapter)
    }
    res.send(data)
}

exports.saveSolvedLesson = async function (req, res, next) {
    let lessonId = req.body.lessonId
    let code = req.body.userCode
    if (lessonId && res.locals && res.locals.token && res.locals.token.user && res.locals.token.userInfo.name) {
        let userId = res.locals.token.user;
        let userName = res.locals.token.userInfo.name;
        let user = await userRepository.findUserByMoodleIdAndMoodleName(userId, userName)
        if (user.length !== 0) {
            userRepository.insertOrUpdateSolvedLessonOnConflict(lessonId, userId, code ? code : null)
                .then(result => {
                    updateGradeForUser(req, res, userId)
                        .then(result => console.log(result))
                        .catch(err => console.log(err))
                    res.status(201).send({message: "Saved"})
                })
                .catch(err => {
                    res.status(500).send({message: "Unknown error please try again later"})
                })
        } else {
            res.status(404).send({message: "user not found"})
        }
    } else {
        res.status(400).send({message: "missing field in body"})
    }
}
exports.deleteSolvedLessons = async function (req, res, next) {
    let user = []
    let moodleId = null
    if (res.locals && res.locals.token && res.locals.token.user && res.locals.token.userInfo.name) {
        moodleId = res.locals.token.user;
        let moodleName = res.locals.token.userInfo.name;
        user = await userRepository.findUserByMoodleIdAndMoodleName(moodleId, moodleName)
    }
    if (user.length !== 0 && moodleId !== null) {
        if (!req.params.chapterId) {
            userRepository.deleteSolvedByMoodleId(moodleId)
                .then(result => res.status(204).send({message: "deleted"})
                )
                .catch(err =>
                    res.status(500).send({message: "Please try again later"})
                )
        } else {
            userRepository.deleteSolvedByMoodleIdAndChapterId(moodleId, req.params.chapterId)
                .then(result => res.status(204).send({message: "deleted"})
                )
                .catch(err =>
                    res.status(500).send({message: "Please try again later"})
                )
        }
    } else {
        res.status(204).send({message: "no User"})
    }
}

exports.testCodingLesson = async function (req, res, next) {
    let code = req.body.userCode;
    let lessonId = req.body.lessonId;
    if (code && lessonId) {
        let codingLesson = await lessonRepository.findCodingByLessonId(lessonId)
        if (codingLesson) {
            await codeExecutionService.runTestForCodingLesson(codingLesson, code)
                .then(testResult => {
                    res.send(testResult)
                })
                .catch(err => {
                    res.status(500).send({message: "unknown error please try again later"})
                })
        } else {
            res.status(400).send({message: "No lesson found with given id"})
        }
    } else {
        res.status(400).send({message: "Missing field lessonId or code"})
    }
}
exports.saveNotes = async function (req, res, next) {
    let note = req.body.note
    if (note && res.locals && res.locals.token && res.locals.token.user && res.locals.token.userInfo.name) {
        let moodleId = res.locals.token.user;
        let moodleName = res.locals.token.userInfo.name;
        userRepository.findUserByMoodleIdAndMoodleName(moodleId, moodleName)
            .then(result => {
                if (result.length !== 0) {
                    if (req.params.noteId) {
                        userRepository.insertOrUpdateNote(moodleId, note, req.params.noteId)
                            .then(result => {
                                res.status(201).send({message: "changed"})
                            }).catch(err => {
                            res.status(500).send({message: "unknown error try again later"})
                        })
                    } else {
                        userRepository.insertNotesForUser(moodleId, note).then(result => {
                            res.status(201).send({message: "success", id: result.rows[0].id})
                        }).catch(err => {
                            res.status(500).send({message: "unknown error try again later"})
                        })
                    }
                } else {
                    res.status(400).send({message: "could not found user try again later"})
                }
            })
            .catch(err => {
                res.status(500).send({message: "unknown error try again later"})
            })
    } else {
        res.status(400).send({message: "no userId or userName in session or note missing in request body"})
    }
}
exports.getNotes = async function (req, res, next) {
    let notes = []
    if (res.locals && res.locals.token && res.locals.token.user && res.locals.token.userInfo.name) {
        let moodleId = res.locals.token.user;
        let moodleName = res.locals.token.userInfo.name;
        notes = await userRepository.findNotesByUser(moodleId, moodleName)
    }
    res.status(200).send({notes: mapToOutputNotes(notes)})
}

exports.deleteNote = async function (req, res, next) {
    let noteId = req.params.noteId
    if (noteId && res.locals && res.locals.token && res.locals.token.user && res.locals.token.userInfo.name) {
        let moodleId = res.locals.token.user;
        let moodleName = res.locals.token.userInfo.name;
        userRepository.deleteNoteForUser(moodleId, moodleName, noteId).then(result => {
            res.status(204).send({message: "deleted"})
        }).catch(err => res.status(500).send({message: "unknown error try again later"}))
    } else {
        res.status(400).send({})
    }
}
exports.saveProblem = async function (req, res, next) {
    let lessonId = req.body.lessonId
    let problem = req.body.problem
    if (problem && lessonId && res.locals && res.locals.token && res.locals.token.user && res.locals.token.userInfo.name) {
        let moodleId = res.locals.token.user;
        let moodleName = res.locals.token.userInfo.name;
        let user = await userRepository.findUserByMoodleIdAndMoodleName(moodleId, moodleName)
        let lesson = await lessonRepository.findById(lessonId)
        if (user.length !== 0 && lesson.length !== 0) {
            userRepository.insertProblemForUser(moodleId, lessonId, problem)
                .then(result => {
                    res.status(201).send({message: "Problem created", problemId: result[0].id})
                })
                .catch(err => {
                    res.status(500).send({message: "Unknown error try again later"})
                })
        } else {
            res.status(404).send({message: "User or Lesson not found"})
        }
    } else {
        res.status(400).send({message: "Could not save Problem for User"})
    }
}
exports.saveAnswerForProblem = async function (req, res, next) {
    let problemId = req.body.problemId
    let answer = req.body.answer
    if (problemId && answer && res.locals && res.locals.token && res.locals.token.user && res.locals.token.userInfo.name) {
        let moodleId = res.locals.token.user;
        let moodleName = res.locals.token.userInfo.name;
        let user = await userRepository.findUserByMoodleIdAndMoodleName(moodleId, moodleName)
        if (user.length !== 0) {
            userRepository.insertAnswerForProblemAndUser(problemId, moodleId, answer)
                .then(result => {
                    res.status(201).send({message: "created"})
                })
                .catch(err => {
                    res.status(500).send({message: "Unknown error try again later"})
                })
        } else {
            res.status(404).send({message: "User not found"})
        }
    } else {
        res.status(400).send({message: "Missing fields"})
    }
}

exports.deleteProblem = async function (req, res, next) {
    let problemId = req.params.problemId
    if (problemId && res.locals && res.locals.token && res.locals.token.user && res.locals.token.userInfo.name) {
        let moodleId = res.locals.token.user;
        let moodleName = res.locals.token.userInfo.name;
        let user = await userRepository.findUserByMoodleIdAndMoodleName(moodleId, moodleName)
        if (user.length !== 0) {
            userRepository.deleteProblemById(problemId)
                .then(result => {
                    res.status(204).send({message: "deleted"})

                })
                .catch(err => {
                    res.status(500).send({message: "Unknown error try again later"})
                })
        } else {
            res.status(404).send({message: "User not found"})
        }
    } else {
        res.status(400).send({message: "Missing fields"})
    }
}
async function mapToOutputChapter(chapter, moodleId) {
    let mappedSections = []
    let sections = await sectionRepository.findByChapterId(chapter.id)
    for (let section of sections) {
        let mappedSection = await mapToOutputSection(section, moodleId)
        mappedSections.push(mappedSection)
    }
    return {
        chapterId: chapter.id,
        chapterName: chapter.name,
        overview: chapter.overview,
        chapterNumber: chapter.chapternumber,
        sections: mappedSections
    }
}

async function mapToOutputSection(section, moodleId) {
    let mappedLessons = await getMappedLessonsForSectionId(section.id, moodleId)
    return {
        sectionId: section.id,
        chapterId: section.chapterId,
        sectionName: section.name,
        sectionNumber: section.sectionnumber,
        information: section.information,
        lessons: mappedLessons,
    }
}

async function getMappedLessonsForSectionId(sectionId, moodleId) {
    let informationLessons = await lessonRepository.findInformationsBySectionId(sectionId)
    let mappedInformationLessons = mapToOutputInformationLessons(informationLessons)
    let fillTheBlankLessons = await lessonRepository.findFillTheBlankBySectionId(sectionId)
    let mappedFillTheBlankLessons = mapToOutputFillTheBlankLessons(fillTheBlankLessons)
    let codingLessons = await lessonRepository.findCodingBySectionId(sectionId)
    let mappedCodingLessons = mapToOutputCodingLessons(codingLessons)
    let codeExtensionLessons = await lessonRepository.findCodeExtensionBySectionId(sectionId)
    let mappedCodeExtensionLessons = mapToOutputCodeExtensionLessons(codeExtensionLessons)
    let singleMultipleChoiceLessons = await lessonRepository.findSingleMultipleChoiceBySectionId(sectionId)
    let mappedSingleMultipleChoiceLessons = mapToOutputSingleMultipleChoiceLessons(singleMultipleChoiceLessons)
    let mappedLessons = mappedFillTheBlankLessons
        .concat(mappedCodingLessons)
        .concat(mappedCodeExtensionLessons)
        .concat(mappedSingleMultipleChoiceLessons)
        .concat(mappedInformationLessons)
    let sortedLessons = sortLessonsByNumber(mappedLessons)
    if (moodleId) {
        let solvedLessons = await lessonRepository.findSolvedByMoodleId(moodleId)
        for (let lesson of sortedLessons) {
            for (let solvedLesson of solvedLessons) {
                if (solvedLesson.lessonid === lesson.lessonId) {
                    lesson.done = true
                    if (lesson.type === LessonTypes.CODE) {
                        lesson.userCode = solvedLesson.code
                    }
                }
            }
        }
    }
    return sortedLessons
}

function sortLessonsByNumber(mappedLessons) {
    return mappedLessons.sort((a, b) => (a.lessonNumber < b.lessonNumber) ? -1 : ((a.lessonNumber > b.lessonNumber) ? 1 : 0))
}

function mapDefaultLesson(lesson) {
    return {
        lessonId: lesson.id,
        sectionId: lesson.sectionid,
        lessonNumber: lesson.lessonnumber,
        lessonName: lesson.name,
        information: lesson.information,
        difficultyLevel: lesson.difficultylevel,
        feedback: lesson.feedback,
        done: false,
        hints: lesson.hints
    }
}

function mapToOutputInformationLessons(lessons) {
    let mappedLessons = []
    for (let lesson of lessons) {
        let mappedLesson = {
            lessonId: lesson.id,
            sectionId: lesson.sectionid,
            lessonNumber: lesson.lessonnumber,
            lessonName: lesson.name,
            information: lesson.information,
            type: LessonTypes.INFORMATION
        }
        mappedLessons.push(mappedLesson)
    }
    return mappedLessons
}

function mapToOutputFillTheBlankLessons(lessons) {
    let mappedLessons = []
    for (let lesson of lessons) {
        let mappedLesson = mapDefaultLesson(lesson)
        mappedLesson.lessonId = lesson.lessonid
        mappedLesson.type = LessonTypes.FILLTHEBLANK
        mappedLesson.textWithBlanks = lesson.textwithblanks
        mappedLesson.answerOptions = mapMarkedAnswers(lesson.markedanswers)
        let answerNumber = 0;
        for (let i = 0; i < mappedLesson.answerOptions.length; i++) {
            let isCorrect = mappedLesson.answerOptions[i].isCorrect
            mappedLesson.answerOptions[i].forInputNumber = isCorrect ? answerNumber++ : -1
        }
        mappedLesson.answerOptions = pseudoShuffle(mappedLesson.answerOptions)
        mappedLessons.push(mappedLesson)
    }
    return mappedLessons
}

function mapToOutputCodingLessons(lessons) {
    let mappedLessons = []
    for (let lesson of lessons) {
        let mappedLesson = mapDefaultLesson(lesson)
        mappedLesson.lessonId = lesson.lessonid
        mappedLesson.type = LessonTypes.CODE
        mappedLesson.exampleSolution = lesson.examplesolution
        mappedLesson.verificationInformation = lesson.verificationinformation
        mappedLessons.userCode = ""
        mappedLessons.push(mappedLesson)
    }
    return mappedLessons
}

function mapToOutputCodeExtensionLessons(lessons) {
    let mappedLessons = []
    for (let lesson of lessons) {
        let mappedLesson = mapDefaultLesson(lesson)
        mappedLesson.lessonId = lesson.lessonid
        mappedLesson.type = LessonTypes.CODEEXTENSION
        mappedLesson.unfinishedCode = lesson.unfinishedcode
        mappedLesson.answers = lesson.answers.replaceAll("\n", "").split('\r')
        mappedLessons.push(mappedLesson)
    }
    return mappedLessons
}

function mapToOutputSingleMultipleChoiceLessons(lessons) {
    let mappedLessons = []
    for (let lesson of lessons) {
        let mappedLesson = mapDefaultLesson(lesson)
        mappedLesson.lessonId = lesson.lessonid
        mappedLesson.type = LessonTypes.SINGLEMULTIPLECHOICE
        mappedLesson.answerOptions = pseudoShuffle(mapMarkedAnswers(lesson.markedoptions))
        mappedLessons.push(mappedLesson)
    }
    return mappedLessons
}

function mapMarkedAnswers(answers) {
    let mappedAnswers = []
    let possibleAnswers = answers.replaceAll("\n", "").split('\r')
    for (let answer of possibleAnswers) {
        if (answer !== "") {
            mappedAnswers.push({
                possibleAnswer: answer.replaceAll('[X]', "").replaceAll('[x]', ""),
                isCorrect: answer.includes('[X]') || answer.includes('[x]'),
            })
        }
    }
    return mappedAnswers
}

function pseudoShuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function mapToOutputProblem(problemsWithAnswers) {
    let mapped = new Map()
    for (let problem of problemsWithAnswers) {
        if (mapped.has(problem.id)) {
            mapped.get(problem.id).answers.push(problem.answer)
        } else {
            mapped.set(problem.id, {
                problemId: problem.id,
                problemMessage: problem.message,
                answers: problem.answer ? [problem.answer] : [],
                lessonId: problem.lessonid,
                lessonName: problem.name,
                createdAt: problem.createdat,
                sender: problem.sender,
            })
        }
    }
    return Array.from(mapped.values())
}

function mapToOutputNotes(notes) {
    let mapped = []
    for (let note of notes) {
        mapped.push({
            notesId: note.id,
            note: note.note,
        })
    }
    return mapped
}

async function calculatePercentageOfLessonsSolvedForUser(moodleId) {
    let solvedLessons = await lessonRepository.findSolvedByMoodleId(moodleId)
    let numberOfSolvedLessons = solvedLessons.length
    let lessons = await lessonRepository.findAllLessonIds()
    let numberOfSolvableLessons = 0
    for (let lesson of lessons) {
        if (lesson.difficultylevel !== null) {
            numberOfSolvableLessons++
        }
    }
    return numberOfSolvedLessons / numberOfSolvableLessons
}
async function updateGradeForUser(req, res, userId) {
    let normedGrade = await calculatePercentageOfLessonsSolvedForUser(userId)
    let shouldUpdateScore = true;
    const idToken = res.locals.token
    const gradeObj = {
        userId: idToken.user,
        scoreGiven: normedGrade * 100,
        scoreMaximum: 100,
        activityProgress: 'Completed',
        gradingProgress: 'FullyGraded'
    }
    let lineItemId = idToken.platformContext.endpoint.lineitem // Attempting to retrieve it from idToken
    if (!lineItemId) {
        const response = await lti.Grade.getLineItems(idToken, {resourceLinkId: true})
        const lineItems = response.lineItems
        if (lineItems.length === 0) {
            // Creating line item if there is none
            console.log('Creating new line item')
            const newLineItem = {
                scoreMaximum: 100,
                label: 'Grade',
                tag: 'grade',
                resourceLinkId: idToken.platformContext.resource.id
            }
            const lineItem = await lti.Grade.createLineItem(idToken, newLineItem)
            lineItemId = lineItem.id
        } else {
            lineItemId = lineItems[0].id
        }
    }
    const gradeResponse = await lti.Grade.getScores(idToken, lineItemId, {userId: idToken.user})
    if (gradeResponse && gradeResponse.scores.length !== 0) {
        for (let score of gradeResponse.scores) {
            if (score.scoreOf === lineItemId) {
                shouldUpdateScore = score.resultScore < normedGrade * 100;
            }
        }
    }
    if (!shouldUpdateScore) {
        return {message: "current score is higher than to be updated score. No grading will take place"}
    }
    const responseGrade = await lti.Grade.submitScore(idToken, lineItemId, gradeObj)
    return responseGrade
}