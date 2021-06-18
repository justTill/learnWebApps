var lessonsRepository = require("../persistence/LessonRepository")
var fileRepository = require("../persistence/FileRepository")
var sectionRepository = require("../persistence/SectionRepository")
var isLessonNumberOccupied = require("../utils/lessons").isLessonNumberOccupied


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
}
exports.saveEditFillTheBlankLesson = async function (req, res, next) {
}