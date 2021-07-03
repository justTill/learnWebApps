var lessonsRepository = require("../persistence/LessonRepository")
var fileRepository = require("../persistence/FileRepository")
var sectionRepository = require("../persistence/SectionRepository")
var isLessonNumberOccupied = require("../utils/lessons").isLessonNumberOccupied
var getEditSectionData = require("../utils/sectionData").getEditSectionData

function correctNumberOfBlanksAndAnswers(unfinishedCode, answers) {
    let numberOfAnswers = answers.replaceAll("\n", "").split('\r').length
    let numberOfInputs = (unfinishedCode.match(/\[input]/g) || []).length
    return numberOfAnswers === numberOfInputs

}

exports.editCodeExtensionLesson = async function (req, res, next) {
    let files = await fileRepository.findByChapterId(req.params.chapterId)
    let codeExtensionLesson = await lessonsRepository.findCodeExtensionByLessonId(req.params.lessonId)
    let sections = await sectionRepository.findByChapterId(req.params.chapterId)
    res.render('lessons/editCodeExtensionLesson', {
        chapterId: req.params.chapterId,
        sectionId: req.params.sectionId,
        updatedSectionId: req.params.sectionId,
        lessonId: req.params.lessonId,
        files: files,
        sections: sections,
        lesson: codeExtensionLesson
    })
}

exports.saveCreateCodeExtensionLesson = async function (req, res, next) {
    let chapterId = req.body.chapterId
    let sectionId = req.body.sectionId
    let lessonName = req.body.lessonName
    let lessonNumber = req.body.lessonNumber
    let lessonInformation = req.body.lessonInformation
    let unfinishedCode = req.body.unfinishedCode
    let answers = req.body.answers
    let difficultyLevel = req.body.difficultyLevel
    let feedback = req.body.feedback === "" ? null : req.body.feedback
    if (chapterId && sectionId && difficultyLevel && lessonName && lessonNumber && lessonInformation && answers) {
        let lessonNumberOccupied = await isLessonNumberOccupied(lessonNumber, sectionId);
        let errorMessage = ""
        if (lessonNumberOccupied) errorMessage = "Aufgabennummer ist schon vergeben, bitte eine andere wählen";
        if (!correctNumberOfBlanksAndAnswers(unfinishedCode, answers)) errorMessage = "Anzahl an [input]'s und Antworten stimmt nicht überein "
        if (errorMessage) {
            let lesson = {
                name: lessonName,
                lessonnumber: lessonNumber,
                information: lessonInformation,
                unfinishedcode: unfinishedCode,
                answers: answers,
                difficultylevel: difficultyLevel,
                feedback: feedback,
            }
            let data = await getEditSectionData(sectionId, chapterId, lesson)
            data.codeExtensionErrorMessages = errorMessage
            res.render('sections/editSection', data)
        } else {
            lessonsRepository.insertOrUpdateCodeExtensionLesson(null, null, sectionId, lessonNumber, lessonInformation, lessonName, difficultyLevel, feedback, unfinishedCode, answers)
                .then(result => {
                    res.redirect('/section/' + chapterId + '/' + sectionId)
                })
                .catch(err => {
                    throw err
                })
        }
    } else {
        res.redirect('/section/' + chapterId + '/' + sectionId)
    }
}

exports.saveEditCodeExtensionLesson = async function (req, res, next) {
    let chapterId = req.body.chapterId
    let sectionId = req.body.sectionId
    let updatedSectionId = req.body.updatedSectionId
    let codeExtensionLessonId = req.body.lessonTypeId
    let lessonId = req.body.lessonId
    let lessonName = req.body.lessonName
    let lessonNumber = req.body.lessonNumber
    let updatedLessonNumber = req.body.updatedLessonNumber
    let lessonInformation = req.body.lessonInformation
    let unfinishedCode = req.body.unfinishedCode
    let answers = req.body.answers
    let difficultyLevel = req.body.difficultyLevel
    let feedback = req.body.feedback === "" ? null : req.body.feedback
    if (chapterId && sectionId && difficultyLevel && updatedSectionId && codeExtensionLessonId && updatedLessonNumber && lessonId && lessonName && lessonNumber && lessonInformation && answers) {
        let errorMessage = ""
        let lessonNumberOccupied = sectionId !== updatedSectionId ? await isLessonNumberOccupied(updatedLessonNumber, updatedSectionId) : await isLessonNumberOccupied(updatedLessonNumber, sectionId);
        if ((lessonNumberOccupied && lessonNumber !== updatedLessonNumber) || (lessonNumberOccupied && sectionId !== updatedSectionId)) errorMessage = "Aufgabennummer ist schon vergeben, bitte eine andere wählen";
        if (!correctNumberOfBlanksAndAnswers(unfinishedCode, answers)) errorMessage = "Anzahl an [input]'s und Antworten stimmt nicht überein "
        if (errorMessage) {
            let files = await fileRepository.findByChapterId(chapterId)
            let sections = await sectionRepository.findByChapterId(chapterId)
            res.render("lessons/editCodeExtensionLesson", {
                error: errorMessage,
                lesson: {
                    id: codeExtensionLessonId,
                    name: lessonName,
                    lessonnumber: lessonNumber,
                    information: lessonInformation,
                    unfinishedcode: unfinishedCode,
                    answers: answers,
                    difficultylevel: difficultyLevel,
                    feedback: feedback,
                },
                sections: sections,
                chapterId: chapterId,
                sectionId: sectionId,
                updatedSectionId: sectionId,
                lessonId: lessonId,
                files: files
            })
        } else {
            await lessonsRepository.insertOrUpdateCodeExtensionLesson(lessonId, codeExtensionLessonId, updatedSectionId, updatedLessonNumber, lessonInformation, lessonName, difficultyLevel, feedback, unfinishedCode, answers)
                .then(result => {
                    res.redirect('/section/' + chapterId + '/' + updatedSectionId)
                })
                .catch(err => {
                    throw err
                })
        }
    } else {
        res.redirect('/section/' + chapterId + '/' + sectionId)
    }
}
