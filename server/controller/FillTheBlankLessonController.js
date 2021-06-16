var lessonsRepository = require("../persistence/LessonRepository")


exports.createFillTheBlankLesson = async function (req, res, next) {
    res.render('lessons/createFillTheBlankLesson', {chapterId: req.params.chapterId, sectionId: req.params.sectionId})
}


exports.editFillTheBlankLesson = async function (req, res, next) {
    let chapterId = req.params.chapterId
    let sectionId = req.params.sectionId
    res.render('lessons/editFillTheBlankLesson')
}
