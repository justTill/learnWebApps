var lessonsRepository = require("../persistence/LessonRepository")
var fileRepository = require("../persistence/FileRepository")
var sectionRepository = require("../persistence/SectionRepository")
var chapterRepository = require("../persistence/ChapterRepository")

exports.getEditSectionData = async function (sectionId, chapterId, lesson) {
    let chapters = await chapterRepository.findAll()
    let files = await fileRepository.findByChapterId(chapterId)
    let section = await sectionRepository.findById(sectionId)
    let informationLessons = await lessonsRepository.findInformationsBySectionId(sectionId);
    let codingLessons = await lessonsRepository.findCodingBySectionId(sectionId);
    let fillTheBlankLessons = await lessonsRepository.findFillTheBlankBySectionId(sectionId);
    let codeExtensionLessons = await lessonsRepository.findCodeExtensionBySectionId(sectionId);
    let singleMultipleChoiceLessons = await lessonsRepository.findSingleMultipleChoiceBySectionId(sectionId);
    return {
        section: section,
        chapters: chapters,
        files: files,
        lesson: lesson,
        currentChapterId: chapterId,
        informationLessons: informationLessons,
        codingLessons: codingLessons,
        fillTheBlankLessons: fillTheBlankLessons,
        codeExtensionLessons: codeExtensionLessons,
        singleMultipleChoiceLessons: singleMultipleChoiceLessons,
    }
}