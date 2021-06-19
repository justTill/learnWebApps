var lessonsRepository = require("../persistence/LessonRepository")

exports.createSingleMultipleChoiceLesson = async function (req, res, next) {
    res.render('lessons/createSingleMultipleChoiceLesson', {
        chapterId: req.params.chapterId,
        sectionId: req.params.sectionId
    })
}


exports.editSingleMultipleChoiceLesson = async function (req, res, next) {
    let chapterId = req.params.chapterId
    let sectionId = req.params.sectionId
    res.render('lessons/editSingleMultipleChoiceLesson')
}
