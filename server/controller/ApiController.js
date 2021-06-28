var chapterRepository = require("../persistence/ChapterRepository")
var sectionRepository = require("../persistence/SectionRepository")
var userRepository = require("../persistence/UserRepository")
var lessonRepository = require("../persistence/LessonRepository")
var codeExecutionService = require("../service/CodeExecutionService")

const LessonTypes = Object.freeze({
    CODE: "codingLesson",
    CODEEXTENSION: "codeExtensionLesson",
    FILLTHEBLANK: "FillTheBlankLesson",
    SINGLEMULTIPLECHOICE: "singleMultipleChoiceLesson"
})
exports.createUserIfNotExist = function (req, res, next) {
    let moodleId = req.query.moodleId
    let moodleName = req.query.moodleName
    if (moodleId && moodleName && moodleId !== -1 && moodleName !== "default") {
        userRepository.findUserByMoodleIdAndMoodleName(moodleId, moodleName)
            .then(result => {
                if (result.length === 0) {
                    userRepository.createPerson(moodleId, moodleName)
                        .then(res => {
                            next()
                        })
                        .catch(err => {
                            res.status(500).send({message: "unknown error"})
                        })
                } else {
                    next()
                }
            })
            .catch(err => {
                res.status(500).send({message: "unknown error"})
            })
    } else {
        req.query.moodleId = -1
        req.query.moodleName = "default"
        next()
    }
}
exports.getProblemsWithAnswers = async function (req, res, next) {
    let moodleId = parseInt(req.params.moodleId)
    let moodleName = req.params.moodleName
    let data = {problems: []}
    if (moodleId !== -1 && moodleName !== "default") {
        let problemsWithAnswers = await userRepository.findProblemsAndAnswersByUser(moodleId, moodleName)
        data.problem = mapToOutputProblem(problemsWithAnswers)
    }
    res.send(data, 200)
}

exports.getChapterDataWithSectionsAndLessons = async function (req, res, next) {
    let data = {chapters: []}
    let chapters = await chapterRepository.findAll()
    for (let chapter of chapters) {
        let mappedChapter = await mapToOutputChapter(chapter)
        data.chapters.push(mappedChapter)
    }
    res.send(data)
}

exports.testCodingLesson = async function (req, res, next) {
    let moodleId = parseInt(req.body.moodleId)
    let moodleName = req.body.moodleName
    let code = req.body.userCode;
    let lessonId = req.body.lessonId;
    if (code && lessonId) {
        let codingLesson = await lessonRepository.findCodingByLessonId(lessonId)
        if (codingLesson) {
            await codeExecutionService.runTestForCodingLesson(codingLesson, code)
                .then(testResult => {
                    if (testResult.errors.length === 0 && moodleId && moodleName && moodleId !== -1 && moodleName !== "default") {
                        userRepository.findUserByMoodleIdAndMoodleName(moodleId, moodleName)
                            .then(userResult => {
                                if (userResult.length !== 0) {
                                    userRepository.insertSolvedLessonForUser(lessonId, moodleId, code)
                                }
                            })
                    }
                    res.send(testResult, 200)
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
    let moodleId = parseInt(req.params.moodleId)
    let moodleName = req.params.moodleName
    let note = req.body.note
    if (moodleId !== -1 && moodleName !== "default" && note) {
        userRepository.findUserByMoodleIdAndMoodleName(moodleId, moodleName)
            .then(result => {
                if (result.length !== 0) {
                    userRepository.insertNotesForUser(moodleId).then(result => {
                        res.send({}, 201)
                    })
                } else {
                    res.status(400).send({message: "could not found user try again later"})
                }
            })
            .catch(err => {
                res.status(500).send({message: "unknown error try again later"})
            })
    } else {
        res.status(400).send({message: "moodle id or name missing or default values are used"})
    }
}
exports.getNotes = async function (req, res, next) {
    let moodleId = parseInt(req.params.moodleId)
    let moodleName = req.params.moodleName
    if (moodleId !== -1 && moodleName !== "default") {
        let notes = await userRepository.findNotesByUser(moodleId, moodleName)

        res.send({data: mapToOutputNotes(notes)}, 200)
    } else {
        res.send({}, 400)
    }
}

async function mapToOutputChapter(chapter) {
    let mappedSections = []
    let sections = await sectionRepository.findByChapterId(chapter.id)
    for (let section of sections) {
        let mappedSection = await mapToOutputSection(section)
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

async function mapToOutputSection(section) {
    let mappedLessons = await getMappedLessonsForSectionId(section.id)
    return {
        sectionId: section.id,
        chapterId: section.chapterId,
        sectionName: section.name,
        sectionNumber: section.sectionnumber,
        information: section.information,
        lessons: mappedLessons,
    }
}

async function getMappedLessonsForSectionId(sectionId) {
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
    let sortedLessons = sortLessonsByNumber(mappedLessons)
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
    }
}

function mapToOutputFillTheBlankLessons(lessons) {
    let mappedLessons = []
    for (let lesson of lessons) {
        let mappedLesson = mapDefaultLesson(lesson)
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
        mappedLesson.type = LessonTypes.CODE
        mappedLesson.exampleSolution = lesson.examplesolution
        mappedLesson.verificationInformation = lesson.verificationinformation
        mappedLessons.push(mappedLesson)
    }
    return mappedLessons
}

function mapToOutputCodeExtensionLessons(lessons) {
    let mappedLessons = []
    for (let lesson of lessons) {
        let mappedLesson = mapDefaultLesson(lesson)
        mappedLesson.type = LessonTypes.CODEEXTENSION
        mappedLesson.unfinishedCode = lesson.unfinishedcode
        mappedLesson.answerOptions = lesson.answers.replaceAll("\n", "").split('\r')
        mappedLessons.push(mappedLesson)
    }
    return mappedLessons
}

function mapToOutputSingleMultipleChoiceLessons(lessons) {
    let mappedLessons = []
    for (let lesson of lessons) {
        let mappedLesson = mapDefaultLesson(lesson)
        mappedLesson.type = LessonTypes.SINGLEMULTIPLECHOICE
        mappedLesson.answerOptions = mapMarkedAnswers(lesson.markedoptions)
        mappedLessons.push(mappedLesson)
    }
    return mappedLessons
}


function mapMarkedAnswers(answers) {
    let mappedAnswers = []
    let possibleAnswers = answers.replaceAll("\n", "").split('\r')
    for (let answer of possibleAnswers) {
        mappedAnswers.push({
            possibleAnswer: answer.replaceAll('[X]', "").replaceAll('[x]', ""),
            isCorrect: answer.includes('[X]') || answer.includes('[x]'),
        })
    }
    return mappedAnswers
}

function mapToOutputProblem(problemsWithAnswers) {
    let mapped = []
    for (let problem of problemsWithAnswers) {
        mapped.push({
            problemMessage: problem.message,
            answer: problem.answer,
            LessonId: problem.lessonid,
            LessonName: problem.name,
            createdAt: problem.createdat,

        })
    }
    return mapped
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