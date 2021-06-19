var lessonsRepository = require("../persistence/LessonRepository")
var fileRepository = require("../persistence/FileRepository")
var sectionRepository = require("../persistence/SectionRepository")
var isLessonNumberOccupied = require("../utils/lessons").isLessonNumberOccupied

function correctNumberOfBlanksAndAnswers(unfinishedCode, answers) {
    let numberOfAnswers = answers.replaceAll("\n", "").split('\r').length
    let numberOfInputs = (unfinishedCode.match(/\[input]/g) || []).length
    return numberOfAnswers === numberOfInputs

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
        codeExtensionLesson: codeExtensionLesson
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
    if (chapterId && sectionId && lessonName && lessonNumber && lessonInformation && answers) {
        let lessonNumberOccupied = await isLessonNumberOccupied(lessonNumber, sectionId);
        let errorMessage = ""
        if (lessonNumberOccupied) errorMessage = "Aufgabennummer ist schon vergeben, bitte eine andere wählen";
        if (!correctNumberOfBlanksAndAnswers(unfinishedCode, answers)) errorMessage = "Anzahl an [input]'s und Antworten stimmt nicht überein "
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

exports.saveEditCodeExtensionLesson = async function (req, res, next) {
    let chapterId = req.body.chapterId
    let sectionId = req.body.sectionId
    let updatedSectionId = req.body.updatedSectionId
    let codeExtensionLessonId = req.body.codeExtensionLessonId
    let lessonId = req.body.lessonId
    let lessonName = req.body.lessonName
    let lessonNumber = req.body.lessonNumber
    let updatedLessonNumber = req.body.updatedLessonNumber
    let lessonInformation = req.body.lessonInformation
    let unfinishedCode = req.body.unfinishedCode
    let answers = req.body.answers
    if (chapterId && sectionId && updatedSectionId && codeExtensionLessonId && updatedLessonNumber && lessonId && lessonName && lessonNumber && lessonInformation && answers) {
        let errorMessage = ""
        let lessonNumberOccupied = sectionId !== updatedSectionId ? await isLessonNumberOccupied(updatedLessonNumber, updatedSectionId) : await isLessonNumberOccupied(updatedLessonNumber, sectionId);
        if ((lessonNumberOccupied && lessonNumber !== updatedLessonNumber) || (lessonNumberOccupied && sectionId !== updatedSectionId)) errorMessage = "Aufgabennummer ist schon vergeben, bitte eine andere wählen";
        if (!correctNumberOfBlanksAndAnswers(unfinishedCode, answers)) errorMessage = "Anzahl an [input]'s und Antworten stimmt nicht überein "
        if (errorMessage) {
            let files = await fileRepository.findByChapterId(chapterId)
            let sections = await sectionRepository.findByChapterId(chapterId)
            res.render("lessons/editCodeExtensionLesson", {
                error: errorMessage,
                codeExtensionLesson: {
                    id: codeExtensionLessonId,
                    name: lessonName,
                    lessonnumber: lessonNumber,
                    information: lessonInformation,
                    unfinishedcode: unfinishedCode,
                    answers: answers,
                },
                sections: sections,
                chapterId: chapterId,
                sectionId: sectionId,
                updatedSectionId: sectionId,
                lessonId: lessonId,
                files: files
            })
        } else {
            lessonsRepository.insertOrUpdateCodeExtensionLesson(lessonId, codeExtensionLessonId, updatedSectionId, updatedLessonNumber, lessonInformation, lessonName, unfinishedCode, answers)
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
