var lessonsRepository = require("../persistence/LessonRepository")

exports.isLessonNumberOccupied = async function isLessonNumberOccupied(lessonNumber, sectionId) {
    let lesson = await lessonsRepository.findByLessonNumber(lessonNumber, sectionId)
    return Object.keys(lesson).length !== 0
}