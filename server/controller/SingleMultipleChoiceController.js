var lessonsRepository = require("../persistence/LessonRepository")
var fileRepository = require("../persistence/FileRepository")
var sectionRepository = require("../persistence/SectionRepository")
var isLessonNumberOccupied = require("../utils/lessons").isLessonNumberOccupied

let containsAnswers = function (markedAnswerText) {
    return markedAnswerText.includes('[X]') || markedAnswerText.includes('[x]')
}

exports.createSingleMultipleChoiceLesson = async function (req, res, next) {
    let files = await fileRepository.findByChapterId(req.params.chapterId)
    res.render('lessons/createSingleMultipleChoiceLesson', {
        chapterId: req.params.chapterId,
        sectionId: req.params.sectionId,
        files: files
    })
}


exports.editSingleMultipleChoiceLesson = async function (req, res, next) {
    let files = await fileRepository.findByChapterId(req.params.chapterId)
    let singleMultipleChoiceLessons = await lessonsRepository.findSingleMultipleChoiceByLessonIdlessonId(req.params.lessonId)
    let sections = await sectionRepository.findByChapterId(req.params.chapterId)
    res.render('lessons/editSingleMultipleChoiceLesson', {
        chapterId: req.params.chapterId,
        sectionId: req.params.sectionId,
        updatedSectionId: req.params.sectionId,
        lessonId: req.params.lessonId,
        files: files,
        sections: sections,
        singleMultipleChoice: singleMultipleChoiceLessons
    })
}

exports.saveCreateSingleMultipleChoiceLesson = async function (req, res, next) {
    let chapterId = req.body.chapterId
    let sectionId = req.body.sectionId
    let lessonName = req.body.lessonName
    let lessonNumber = req.body.lessonNumber
    let lessonInformation = req.body.lessonInformation
    let markedOptions = req.body.markedOptions
    if (chapterId && sectionId && lessonName && lessonNumber && lessonInformation && markedOptions) {
        let errorMessage = ""
        if (await isLessonNumberOccupied(lessonNumber, sectionId)) errorMessage = "Aufgaben Nummer ist schon vergeben, bitte eine andere wählen"
        if (!containsAnswers(markedOptions)) errorMessage = "Bitte mindestens eine Antwort mit [X] als richtige Antwort makrieren"
        if (errorMessage) {
            let files = await fileRepository.findByChapterId(chapterId)
            res.render('lessons/createSingleMultipleChoiceLesson', {
                error: errorMessage,
                singleMultipleChoice: {
                    name: lessonName,
                    lessonnumber: lessonNumber,
                    information: lessonInformation,
                    markedoptions: markedOptions,
                },
                chapterId: chapterId,
                sectionId: sectionId,
                files: files
            })
        } else {
            await lessonsRepository.insertOrUpdateSingleMultipleChoiceLesson(null, null, sectionId, lessonNumber, lessonInformation, lessonName, markedOptions)
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

exports.saveEditSingleMultipleChoiceLesson = async function (req, res, next) {
    let chapterId = req.body.chapterId
    let sectionId = req.body.sectionId
    let updatedSectionId = req.body.updatedSectionId
    let singleMultipleChoiceLessonId = req.body.singleMultipleChoiceLessonId
    let lessonId = req.body.lessonId
    let lessonName = req.body.lessonName
    let lessonNumber = req.body.lessonNumber
    let updatedLessonNumber = req.body.updatedLessonNumber
    let lessonInformation = req.body.lessonInformation
    let markedOptions = req.body.markedoptions
    if (chapterId && sectionId && updatedSectionId && singleMultipleChoiceLessonId && lessonId && lessonName && lessonNumber && updatedLessonNumber && lessonInformation && markedOptions) {
        let errorMessage = ""
        let lessonNumberOccupied = sectionId !== updatedSectionId ? await isLessonNumberOccupied(updatedLessonNumber, updatedSectionId) : await isLessonNumberOccupied(updatedLessonNumber, sectionId);
        if ((lessonNumberOccupied && lessonNumber !== updatedLessonNumber) || (lessonNumberOccupied && sectionId !== updatedSectionId)) errorMessage = "Aufgabennummer ist schon vergeben, bitte eine andere wählen";
        if (!containsAnswers(markedOptions)) errorMessage = "Bitte mindestens eine Antwort mit [X] als richtige Antwort makrieren"
        if (errorMessage) {
            let files = await fileRepository.findByChapterId(chapterId)
            let sections = await sectionRepository.findByChapterId(chapterId)
            res.render("lessons/editSingleMultipleChoiceLesson", {
                error: errorMessage,
                singleMultipleChoice: {
                    id: singleMultipleChoiceLessonId,
                    name: lessonName,
                    lessonnumber: lessonNumber,
                    information: lessonInformation,
                    markedoptions: markedOptions,
                },
                sections: sections,
                chapterId: chapterId,
                sectionId: sectionId,
                updatedSectionId: sectionId,
                lessonId: lessonId,
                files: files
            })
        } else {
            console.log(updatedSectionId)
            await lessonsRepository.insertOrUpdateSingleMultipleChoiceLesson(lessonId, singleMultipleChoiceLessonId, updatedSectionId, updatedLessonNumber, lessonInformation, lessonName, markedOptions)
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
