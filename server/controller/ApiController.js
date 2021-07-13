var chapterRepository = require("../persistence/ChapterRepository")
var sectionRepository = require("../persistence/SectionRepository")
var userRepository = require("../persistence/UserRepository")
var lessonRepository = require("../persistence/LessonRepository")
var codeExecutionService = require("../service/CodeExecutionService")

const LessonTypes = Object.freeze({
    INFORMATION: "information",
    CODE: "codingLesson",
    CODEEXTENSION: "codeExtensionLesson",
    FILLTHEBLANK: "fillTheBlankLesson",
    SINGLEMULTIPLECHOICE: "singleMultipleChoiceLesson"
})
exports.createUserIfNotExist = function (req, res, next) {
    let moodleId = req.body.moodleId
    let moodleName = req.body.moodleName
    if (moodleId && moodleName && moodleId !== -1 && moodleName !== "default") {
        userRepository.findUserByMoodleIdAndMoodleName(moodleId, moodleName)
            .then(result => {
                if (result.length === 0) {
                    userRepository.createPerson(moodleId, moodleName)
                        .then(result => {
                            res.status(201).send({message: "created"})
                        })
                        .catch(err => {
                            res.status(500).send({message: "unknown error"})
                        })
                } else {
                    res.status(201).send({message: "created"})
                }
            })
            .catch(err => {
                res.status(500).send({message: "unknown error"})
            })
    } else {
        res.status(400).send({message: "default user given or missing field"})
    }
}
exports.getProblemsWithAnswers = async function (req, res, next) {
    let moodleId = parseInt(req.params.moodleId)
    let moodleName = req.params.moodleName
    let data = {problems: []}
    if (moodleId !== -1 && moodleName !== "default") {
        let problemsWithAnswers = await userRepository.findProblemsAndAnswersByUser(moodleId, moodleName)
        data.problems = mapToOutputProblem(problemsWithAnswers)
    }
    res.send(data, 200)
}
exports.getChapterDataWithSectionsAndLessonsForUser = async function (req, res, next) {
    let data = {chapters: []}
    let moodleId = parseInt(req.params.moodleId)
    let moodleName = req.params.moodleName
    if (moodleId && moodleName) {
        let user = await userRepository.findUserByMoodleIdAndMoodleName(moodleId, moodleName)
        if (user.length !== 0) {
            let chapters = await chapterRepository.findAll()
            for (let chapter of chapters) {
                let mappedChapter = await mapToOutputChapter(chapter, moodleId)
                data.chapters.push(mappedChapter)
            }
        }
    }
    res.send(data)
}

exports.getChapterDataWithSectionsAndLessons = async function (req, res, next) {
    let data = {chapters: []}
    let chapters = await chapterRepository.findAll()
    for (let chapter of chapters) {
        let mappedChapter = await mapToOutputChapter(chapter, null)
        data.chapters.push(mappedChapter)
    }
    res.send(data)
}
exports.saveSolvedLesson = async function (req, res, next) {
    let lessonId = parseInt(req.body.lessonId)
    let moodleId = parseInt(req.body.moodleId)
    let moodleName = req.body.moodleName
    if (lessonId && moodleId && moodleName) {
        let user = await userRepository.findUserByMoodleIdAndMoodleName(moodleId, moodleName)
        if (user.length !== 0) {
            userRepository.insertSolvedLessonForUser(lessonId, moodleId, null)
                .then(result => {
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
    let moodleId = parseInt(req.params.moodleId)
    let moodleName = req.params.moodleName
    console.log(moodleId, moodleName)
    let user = await userRepository.findUserByMoodleIdAndMoodleName(moodleId, moodleName)
    if (user.length !== 0) {
        userRepository.deleteSolvedByMoodleId(moodleId)
            .then(result => res.status(204).send({message: "deleted"})
            )
            .catch(err => console.log(err))
    } else {
        res.status(204).send({message: "no User"})
    }
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
        res.send({notes: mapToOutputNotes(notes)}, 200)
    } else {
        res.send({}, 400)
    }
}
exports.saveProblem = async function (req, res, next) {
    let moodleId = parseInt(req.body.moodleId)
    let moodleName = req.body.moodleName
    let lessonId = req.body.lessonId
    let problem = req.body.problem
    if (moodleId !== -1 && moodleName !== "default" && problem && lessonId) {
        let user = await userRepository.findUserByMoodleIdAndMoodleName(moodleId, moodleName)
        let lesson = await lessonRepository.findById(lessonId)
        if (user.length !== 0 && lesson.length !== 0) {
            userRepository.insertProblemForUser(moodleId, lessonId, problem)
                .then(result => {
                    res.status(201).send({message: "Problem created"})

                })
                .catch(err => {
                    res.status(500).send({message: "Unknown error try again later"})

                })
        } else {
            res.status(404).send({message: "User or Lesson not found"})
        }
    } else {
        res.status(400).send({message: "Could not save Problem for default User"})
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
        mappedLesson.answerOptions = lesson.answers.replaceAll("\n", "").split('\r')
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
        mappedLesson.answerOptions = mapMarkedAnswers(lesson.markedoptions)
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