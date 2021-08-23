var chapterRepository = require("../persistence/ChapterRepository")
var sectionRepository = require("../persistence/SectionRepository")
var userRepository = require("../persistence/UserRepository")
var lessonRepository = require("../persistence/LessonRepository")
var codeExecutionService = require("../service/CodeExecutionService")
var ltiController = require("../controller/LTIController")
var lti = require("ims-lti")

const LessonTypes = Object.freeze({
    INFORMATION: "information",
    CODE: "codingLesson",
    CODEEXTENSION: "codeExtensionLesson",
    FILLTHEBLANK: "fillTheBlankLesson",
    SINGLEMULTIPLECHOICE: "singleMultipleChoiceLesson"
})
exports.getProblemsWithAnswers = async function (req, res, next) {
    let moodleId = req.session.userId
    let moodleName = req.session.userName
    let data = {problems: []}
    if (moodleId && moodleName) {
        let problemsWithAnswers = await userRepository.findProblemsAndAnswersByUser(moodleId, moodleName)
        data.problems = mapToOutputProblem(problemsWithAnswers)
    }
    res.send(data)
}
exports.getChapterDataWithSectionsAndLessons = async function (req, res, next) {
    let data = {chapters: []}
    let moodleId = null
    if (req.session.userId && req.session.userName) {
        let user = await userRepository.findUserByMoodleIdAndMoodleName(req.session.userId, req.session.userName)
        if (user.length !== 0) {
            moodleId = req.session.userId
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
    let lessonId = parseInt(req.body.lessonId)
    let moodleId = req.session.userId
    let moodleName = req.session.userName
    let code = req.body.userCode
    if (lessonId && moodleId && moodleName) {
        let user = await userRepository.findUserByMoodleIdAndMoodleName(moodleId, moodleName)
        if (user.length !== 0) {
            userRepository.insertOrUpdateSolvedLessonOnConflict(lessonId, moodleId, code ? code : null)
                .then(result => {
                    calculatePercentageOfLessonsSolvedForUser(moodleId)
                        .then(result => ltiController.updateGrade(req, result))
                        .catch(err => console.log(err))
                    res.status(201).send({message: "Saved"})
                })
                .catch(err => {
                    res.status(500).send({message: "Unbekannter Fehler"})
                })
        } else {
            res.status(404).send({message: "user not found"})
        }
    } else {
        res.status(400).send({message: "missing field in body"})
    }
}
exports.deleteSolvedLessons = async function (req, res, next) {
    let moodleId = req.session.userId
    let moodleName = req.session.userName
    let user = await userRepository.findUserByMoodleIdAndMoodleName(moodleId, moodleName)
    if (user.length !== 0) {
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
    if (note && req.session.userId && req.session.userName) {
        let moodleId = req.session.userId
        let moodleName = req.session.userName
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
    let moodleId = req.session.userId
    let moodleName = req.session.userName
    if (moodleId && moodleName) {
        notes = await userRepository.findNotesByUser(moodleId, moodleName)
    }
    res.status(200).send({notes: mapToOutputNotes(notes)})
}

exports.deleteNote = async function (req, res, next) {
    let moodleId = req.session.userId
    let moodleName = req.session.userName
    let noteId = req.params.noteId
    if (moodleId && moodleName && noteId) {
        userRepository.deleteNoteForUser(moodleId, moodleName, noteId).then(result => {
            res.status(204).send({message: "deleted"})
        }).catch(err => res.status(500).send({message: "unknown error try again later"}))
    } else {
        res.status(400).send({})
    }
}
exports.saveProblem = async function (req, res, next) {
    let moodleId = req.session.userId
    let moodleName = req.session.userName
    let lessonId = req.body.lessonId
    let problem = req.body.problem
    if (moodleId && moodleName && problem && lessonId) {
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
    let moodleId = req.session.userId
    let moodleName = req.session.userName
    let answer = req.body.answer
    if (problemId && moodleId && moodleName && answer) {
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
    let moodleId = req.session.userId
    let moodleName = req.session.userName
    if (problemId && moodleId && moodleName) {
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
        console.log(mappedLesson.answers)
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