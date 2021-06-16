var lessonsRepository = require("../persistence/LessonRepository")

exports.isLessonNumberOccupied = async function isLessonNumberOccupied(number) {
    let lesson = await lessonsRepository.findByLessonNumber(number)
    return Object.keys(lesson).length !== 0
}