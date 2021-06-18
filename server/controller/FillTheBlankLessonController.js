var lessonsRepository = require("../persistence/LessonRepository")
var fileRepository = require("../persistence/FileRepository")
var sectionRepository = require("../persistence/SectionRepository")
var isLessonNumberOccupied = require("../utils/lessons").isLessonNumberOccupied

function correctNumberOfBlanksAndAnswersAndPossibleAnswers(textWithBlanks, answers, possibleAnswers) {
    let numberOfAnswers = answers.replaceAll("\n", "").split('\r').length
    let numberOfPossibleAnswers = possibleAnswers.replaceAll("\n", "").split('\r').length
    let numberOfInputs = (textWithBlanks.match(/\[input]/g) || []).length
    return numberOfAnswers === numberOfInputs && numberOfPossibleAnswers >= numberOfInputs

}


exports.createFillTheBlankLesson = async function (req, res, next) {
    let files = await fileRepository.findByChapterId(req.params.chapterId)
    res.render('lessons/createFillTheBlankLesson', {
        chapterId: req.params.chapterId,
        sectionId: req.params.sectionId,
        files: files
    })
}


exports.editFillTheBlankLesson = async function (req, res, next) {
    let files = await fileRepository.findByChapterId(req.params.chapterId)
    let codeExtensionLesson = await lessonsRepository.findFillTheBlankBySectionId(req.params.lessonId)
    let sections = await sectionRepository.findByChapterId(req.params.chapterId)
    res.render('lessons/editFillTheBlankLesson', {
        chapterId: req.params.chapterId,
        sectionId: req.params.sectionId,
        lessonId: req.params.lessonId,
        files: files,
        sections: sections,
        codeExtensionLesson: codeExtensionLesson
    })
}

exports.saveCreateFillTheBlankLesson = async function (req, res, next) {
    let chapterId = req.body.chapterId
    let sectionId = req.body.sectionId
    let lessonName = req.body.lessonName
    let lessonNumber = req.body.lessonNumber
    let lessonInformation = req.body.lessonInformation
    let textWithBlanks = req.body.textWithBlanks
    let possibleAnswers = req.body.possibleAnswers
    let answers = req.body.answers
    if (chapterId && sectionId && textWithBlanks && possibleAnswers && lessonName && lessonNumber && lessonInformation && answers) {
        let lessonNumberOccupied = await isLessonNumberOccupied(lessonNumber, sectionId);
        let errorMessage = ""
        if (lessonNumberOccupied) errorMessage = "Aufgabennummer ist schon vergeben, bitte eine andere wählen";
        if (!correctNumberOfBlanksAndAnswersAndPossibleAnswers(textWithBlanks, answers, possibleAnswers)) errorMessage = "Anzahl an [input]'s und Antworten stimmt nicht überein oder Anzahl an möglich Antworten ist geringer als Anzahl an Inputs "
        if (errorMessage) {
            let files = await fileRepository.findByChapterId(chapterId)
            res.render("lessons/createFillTheBlankLesson", {
                error: errorMessage,
                fillTheBlankLesson: {
                    name: lessonName,
                    lessonnumber: lessonNumber,
                    information: lessonInformation,
                    textWithBlanks: textWithBlanks,
                    possibleAnswers: possibleAnswers,
                    answers: answers,
                },
                chapterId: chapterId,
                sectionId: sectionId,
                files: files
            })
        } else {
            lessonsRepository.insertOrUpdateFillTheBlankLesson(null, null, sectionId, lessonNumber, lessonInformation, lessonName, textWithBlanks, possibleAnswers, answers)
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
exports.saveEditFillTheBlankLesson = async function (req, res, next) {
}