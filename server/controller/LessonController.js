exports.editCodingLesson = async function (req, res, next) {
    res.render('lessons/editCodingLesson')
}

exports.editFillTheBlankLesson = async function (req, res, next) {
    res.render('lessons/createFillTheBlankLesson')
}

exports.editSingleMultipleChoiceLesson = async function (req, res, next) {
    res.render('lessons/createSingleMultipleChoiceLesson')
}

exports.editCodeExtensionLesson = async function (req, res, next) {
    res.render('lessons/createCodeExtensionLesson')
}
exports.createCodingLesson = async function (req, res, next) {
    res.render('lessons/createCodingLesson')
}

exports.createFillTheBlankLesson = async function (req, res, next) {
    res.render('lessons/createFillTheBlankLesson')
}

exports.createSingleMultipleChoiceLesson = async function (req, res, next) {
    res.render('lessons/createSingleMultipleChoiceLesson')
}

exports.createCodeExtensionLesson = async function (req, res, next) {
    res.render('lessons/createCodeExtensionLesson')
}