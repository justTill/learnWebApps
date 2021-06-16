var lessonsRepository = require("../persistence/LessonRepository")
var fileRepository = require("../persistence/FileRepository")
var sectionRepository = require("../persistence/SectionRepository")

async function isLessonNumberOccupied(number) {
    let lesson = await lessonsRepository.findCodingByLessonNumber(number)
    return Object.keys(lesson).length !== 0
}

exports.createCodeExtensionLesson = async function (req, res, next) {
    let files = await fileRepository.findByChapterId(req.params.chapterId)
    res.render('lessons/createCodeExtensionLesson', {
        chapterId: req.params.chapterId,
        sectionId: req.params.sectionId,
        files: files
    })
}

exports.editCodeExtensionLesson = async function (req, res, next) {
    res.render('lessons/editCodeExtensionLesson')
}

exports.saveCreateCodingLesson = async function (req, res, next) {
    let chapterId = req.body.chapterId
    let sectionId = req.body.sectionId
    let lessonName = req.body.lessonName
    let lessonNumber = req.body.lessonNumber
    let lessonInformation = req.body.lessonInformation
    let unfinishedCode = req.body.unfinishedCode
    let answers = req.body.answers
    if (chapterId, sectionId, lessonName, lessonNumber, lessonInformation, answers) {
        let lessonNumberOccupied = await isLessonNumberOccupied(lessonNumber);
        let numberOfAnswers = answers.replaceAll("\n", "").split('\r').length
        let numberOfInputs = (unfinishedCode.match(/\[input]/g) || []).length
        let errorMessage = ""
        if (lessonNumberOccupied) errorMessage = "Aufgabennummer ist schon vergeben, bitte eine andere wählen";
        if (numberOfInputs !== numberOfAnswers) errorMessage = "Anzahl an [input]'s und Antworten stimmt nicht überein "
        if (errorMessage) {
            let files = await fileRepository.findByChapterId(chapterId)
            res.render("lessons/createCodeExtensionLesson", {
                error: errorMessage,
                codeExtensionLesson: {
                    name: lessonName,
                    lessonnumber: lessonNumber,
                    information: lessonInformation,
                    unfinishedcode: unfinishedCode,
                    answers: answers,
                },
                chapterId: chapterId,
                sectionId: sectionId,
                files: files
            })
        } else {
            lessonsRepository.insertOrUpdateCodeExtensionLesson(null, null, sectionId, lessonNumber, lessonInformation, lessonName, unfinishedCode, answers)
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
