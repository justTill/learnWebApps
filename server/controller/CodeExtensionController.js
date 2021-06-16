var lessonsRepository = require("../persistence/LessonRepository")

exports.createCodeExtensionLesson = async function (req, res, next) {
    res.render('lessons/createCodeExtensionLesson', {chapterId: req.params.chapterId, sectionId: req.params.sectionId})
}

exports.editCodeExtensionLesson = async function (req, res, next) {
    res.render('lessons/editCodeExtensionLesson')
}