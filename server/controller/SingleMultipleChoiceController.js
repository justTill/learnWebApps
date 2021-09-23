var lessonsRepository = require("../persistence/LessonRepository")
var fileRepository = require("../persistence/FileRepository")
var sectionRepository = require("../persistence/SectionRepository")
var isLessonNumberOccupied = require("../utils/lessons").isLessonNumberOccupied
var getEditSectionData = require("../utils/sectionData").getEditSectionData


let containsAnswers = function (markedAnswerText) {
    return markedAnswerText.includes('[X]') || markedAnswerText.includes('[x]')
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
        lesson: singleMultipleChoiceLessons
    })
}

exports.saveCreateSingleMultipleChoiceLesson = async function (req, res, next) {
    let chapterId = req.body.chapterId
    let sectionId = req.body.sectionId
    let lessonName = req.body.lessonName
    let lessonNumber = req.body.lessonNumber
    let lessonInformation = req.body.lessonInformation
    let markedOptions = req.body.markedOptions
    let hints = req.body.hints
    let difficultyLevel = req.body.difficultyLevel
    let feedback = req.body.feedback === "" ? null : req.body.feedback
    if (chapterId && sectionId && lessonName && lessonNumber && lessonInformation && markedOptions) {
        let errorMessage = ""
        if (await isLessonNumberOccupied(lessonNumber, sectionId)) errorMessage = "Aufgaben Nummer ist schon vergeben, bitte eine andere wählen"
        if (!containsAnswers(markedOptions)) errorMessage = "Bitte mindestens eine Antwort mit [X] als richtige Antwort makrieren"
        if (errorMessage) {
            let lesson = {
                name: lessonName,
                lessonnumber: lessonNumber,
                information: lessonInformation,
                markedoptions: markedOptions,
                difficultylevel: difficultyLevel,
                feedback: feedback,
            }
            let data = await getEditSectionData(sectionId, chapterId, lesson)
            data.singleMultipleChoiceError = errorMessage
            res.render('sections/editSection', data)
        } else {
            await lessonsRepository.insertOrUpdateSingleMultipleChoiceLesson(null, null, sectionId, lessonNumber, lessonInformation, lessonName, difficultyLevel, feedback, markedOptions, hints ? hints : null)
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
    let singleMultipleChoiceLessonId = req.body.lessonTypeId
    let lessonId = req.body.lessonId
    let lessonName = req.body.lessonName
    let lessonNumber = req.body.lessonNumber
    let hints = req.body.hints
    let updatedLessonNumber = req.body.updatedLessonNumber
    let lessonInformation = req.body.lessonInformation
    let markedOptions = req.body.markedoptions
    let difficultyLevel = req.body.difficultyLevel
    let feedback = req.body.feedback === "" ? null : req.body.feedback
    if (chapterId && sectionId && difficultyLevel && updatedSectionId && singleMultipleChoiceLessonId && lessonId && lessonName && lessonNumber && updatedLessonNumber && lessonInformation && markedOptions) {
        let errorMessage = ""
        let lessonNumberOccupied = sectionId !== updatedSectionId ? await isLessonNumberOccupied(updatedLessonNumber, updatedSectionId) : await isLessonNumberOccupied(updatedLessonNumber, sectionId);
        if ((lessonNumberOccupied && lessonNumber !== updatedLessonNumber) || (lessonNumberOccupied && sectionId !== updatedSectionId)) errorMessage = "Aufgabennummer ist schon vergeben, bitte eine andere wählen";
        if (!containsAnswers(markedOptions)) errorMessage = "Bitte mindestens eine Antwort mit [X] als richtige Antwort makrieren"
        if (errorMessage) {
            let files = await fileRepository.findByChapterId(chapterId)
            let sections = await sectionRepository.findByChapterId(chapterId)
            res.render("lessons/editSingleMultipleChoiceLesson", {
                error: errorMessage,
                lesson: {
                    id: singleMultipleChoiceLessonId,
                    name: lessonName,
                    lessonnumber: lessonNumber,
                    information: lessonInformation,
                    markedoptions: markedOptions,
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
            await lessonsRepository.insertOrUpdateSingleMultipleChoiceLesson(lessonId, singleMultipleChoiceLessonId, updatedSectionId, updatedLessonNumber, lessonInformation, lessonName, difficultyLevel, feedback, markedOptions, hints ? hints : null)
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
