var lessonsRepository = require("../persistence/LessonRepository")
var fileRepository = require("../persistence/FileRepository")
var sectionRepository = require("../persistence/SectionRepository")
var isLessonNumberOccupied = require("../utils/lessons").isLessonNumberOccupied
var getEditSectionData = require("../utils/sectionData").getEditSectionData

exports.saveCreateInformationLesson = async function (req, res, next) {
    let chapterId = req.body.chapterId
    let sectionId = req.body.sectionId
    let lessonName = req.body.lessonName
    let lessonNumber = req.body.lessonNumber
    let lessonInformation = req.body.lessonInformation
    if (chapterId && sectionId && lessonName && lessonNumber && lessonInformation) {
        let lessonNumberOccupied = await isLessonNumberOccupied(lessonNumber, sectionId);
        if (lessonNumberOccupied) {
            let lesson = {
                name: lessonName,
                lessonnumber: lessonNumber,
                information: lessonInformation,
            }
            let errorMessage = "Aufgabennummer ist schon vergeben, bitte eine andere wählen"
            let data = await getEditSectionData(sectionId, chapterId, lesson)
            data.informationErrorMessage = errorMessage
            res.render("sections/editSection", data)
        } else {
            await lessonsRepository.insertOrUpdateInformationLesson(null, sectionId, lessonNumber, lessonInformation, lessonName)
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

exports.editInformationLesson = async function (req, res, next) {
    let files = await fileRepository.findByChapterId(req.params.chapterId)
    let informationLesson = await lessonsRepository.findById(req.params.lessonId)
    let sections = await sectionRepository.findByChapterId(req.params.chapterId)
    res.render('lessons/editInformationLesson', {
        chapterId: req.params.chapterId,
        sectionId: req.params.sectionId,
        lessonId: req.params.lessonId,
        lesson: informationLesson,
        files: files,
        sections: sections,
    })
}


exports.saveEditInformationLesson = async function (req, res, next) {
    let chapterId = req.body.chapterId
    let sectionId = req.body.sectionId
    let lessonId = req.body.lessonId
    let updatedSectionId = req.body.updatedSectionId
    let lessonName = req.body.lessonName
    let lessonNumber = req.body.lessonNumber
    let updatedLessonNumber = req.body.updatedLessonNumber
    let lessonInformation = req.body.lessonInformation
    if (chapterId && sectionId && updatedSectionId && updatedLessonNumber && lessonId && lessonName && lessonNumber && lessonInformation) {
        let errorMessage = ""
        let lessonNumberOccupied = sectionId !== updatedSectionId ? await isLessonNumberOccupied(updatedLessonNumber, updatedSectionId) : await isLessonNumberOccupied(updatedLessonNumber, sectionId);
        if ((lessonNumberOccupied && lessonNumber !== updatedLessonNumber) || (lessonNumberOccupied && sectionId !== updatedSectionId)) errorMessage = "Aufgabennummer ist schon vergeben, bitte eine andere wählen";
        if (errorMessage) {
            let files = await fileRepository.findByChapterId(chapterId)
            let sections = await sectionRepository.findByChapterId(chapterId)
            res.render("lessons/editInformationLesson", {
                error: errorMessage,
                lesson: {
                    id: lessonId,
                    name: lessonName,
                    lessonnumber: lessonNumber,
                    information: lessonInformation,
                },
                lessonId: lessonId,
                sections: sections,
                chapterId: chapterId,
                sectionId: sectionId,
                updatedSectionId: sectionId,
                files: files
            })
        } else {
            await lessonsRepository.insertOrUpdateInformationLesson(lessonId, updatedSectionId, updatedLessonNumber, lessonInformation, lessonName)
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
