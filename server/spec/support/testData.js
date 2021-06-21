const chapterRepository = require('../../persistence/ChapterRepository')
const sectionRepository = require('../../persistence/SectionRepository')
const lessonRepository = require('../../persistence/LessonRepository')
const userRepository = require('../../persistence/UserRepository')
const fileRepository = require('../../persistence/FileRepository')

const classChapter = require('./cannedData').firstChpater
const asyncChapter = require('./cannedData').secondChapter
const classSectionOne = require('./cannedData').firstSectionToChapterOne
const classSectionTwo = require('./cannedData').secondSectionToChapterOne

const asyncSectionOne = require('./cannedData').firstSectionToChapterTwo
const asyncSectionTwo = require('./cannedData').secondSectionToChapterTwo

const asyncCodeLesson = require('./cannedData').asyncSectionOneLessonOne
const asyncFillTheBlank = require('./cannedData').asyncSectionOneLessonTwo
const asyncCodeExtensions = require('./cannedData').asyncSectionTwoLessonOne

const classCodeLesson = require('./cannedData').classSectionOneLessonOne
const classFillTheBlank = require('./cannedData').classSectionOneLessonTwo
const classCodeExtensions = require('./cannedData').classSectionTwoLessonOne;


(async function insertData() {
    await chapterRepository.insertOrUpdateChapter(null, classChapter.name, classChapter.overview, classChapter.chapternumber)
    await chapterRepository.insertOrUpdateChapter(null, asyncChapter.name, asyncChapter.overview, asyncChapter.chapternumber)

    await sectionRepository.insertOrUpdateSection(null, classSectionOne.chapterId, classSectionOne.name, classSectionOne.information, classSectionOne.sectionnumber)
    await sectionRepository.insertOrUpdateSection(null, classSectionTwo.chapterId, classSectionTwo.name, classSectionTwo.information, classSectionTwo.sectionnumber)
    await sectionRepository.insertOrUpdateSection(null, asyncSectionOne.chapterId, asyncSectionOne.name, asyncSectionOne.information, asyncSectionOne.sectionnumber)
    await sectionRepository.insertOrUpdateSection(null, asyncSectionTwo.chapterId, asyncSectionTwo.name, asyncSectionTwo.information, asyncSectionTwo.sectionnumber)

    await lessonRepository.insertOrUpdateCodingLesson(null, null, asyncCodeLesson.sectionid, asyncCodeLesson.lessonnumber, asyncCodeLesson.information, asyncCodeLesson.name, asyncCodeLesson.verificationtype, asyncCodeLesson.verificationcode, asyncCodeLesson.examplsolution, asyncCodeLesson.verificationinformation)
    await lessonRepository.insertOrUpdateFillTheBlankLesson(null, null, asyncFillTheBlank.sectionid, asyncFillTheBlank.lessonnumber, asyncFillTheBlank.information, asyncFillTheBlank.name, asyncFillTheBlank.textwithblanks, asyncFillTheBlank.possibleAnswers, asyncFillTheBlank.answers)
    await lessonRepository.insertOrUpdateCodeExtensionLesson(null, null, asyncCodeExtensions.sectionid, asyncCodeExtensions.lessonnumber, asyncCodeExtensions.information, asyncCodeExtensions.name, asyncCodeExtensions.unfinishedcode, asyncCodeExtensions.answers)

    await lessonRepository.insertOrUpdateCodingLesson(null, null, classCodeLesson.sectionid, classCodeLesson.lessonnumber, classCodeLesson.information, classCodeLesson.name, classCodeLesson.verificationtype, classCodeLesson.verificationcode, classCodeLesson.examplsolution, classCodeLesson.verificationinformation)
    await lessonRepository.insertOrUpdateFillTheBlankLesson(null, null, classFillTheBlank.sectionid, classFillTheBlank.lessonnumber, classFillTheBlank.information, classFillTheBlank.name, classFillTheBlank.textwithblanks, classFillTheBlank.possibleAnswers, classFillTheBlank.answers)
    await lessonRepository.insertOrUpdateCodeExtensionLesson(null, null, classCodeExtensions.sectionid, classCodeExtensions.lessonnumber, classCodeExtensions.information, classCodeExtensions.name, classCodeExtensions.unfinishedcode, classCodeExtensions.answers).then(res => res).catch(err => err)

    await fileRepository.insert(1, "myImagePath")
})();

