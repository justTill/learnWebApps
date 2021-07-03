var sectionRepository = require("../persistence/SectionRepository")
var chapterRepository = require("../persistence/ChapterRepository")
var lessonsRepository = require("../persistence/LessonRepository")
var fileRepository = require("../persistence/FileRepository")


async function isSectionNumberOccupied(number, chapterId) {
    let section = await sectionRepository.findBySectionNumber(number, chapterId);
    return Object.keys(section).length !== 0
}

exports.deleteSection = async function (req, res, next) {
    let sectionId = req.params.sectionId
    let chapterId = req.params.chapterId
    await sectionRepository.deleteById(sectionId)
        .then(rows => {
            res.redirect("/chapter/" + chapterId)
        })
        .catch(err => {
            throw err
        })
}

exports.saveNewSection = async function (req, res, next) {
    let chapterId = req.body.chapterId
    let name = req.body.sectionName
    let information = req.body.information
    let sectionNumber = req.body.sectionNumber
    if (chapterId && name && information && sectionNumber) {
        let numberOccupied = await isSectionNumberOccupied(sectionNumber, chapterId);
        let files = await fileRepository.findByChapterId(chapterId)
        let sections = await sectionRepository.findByChapterId(chapterId)
        let chapter = await chapterRepository.findById(chapterId)
        if (numberOccupied) {
            res.render('chapters/editChapter', {
                error: "Unterthema Nummer ist schon vergeben, bitte eine andere wählen",
                sectionData: {name: name, information: information, sectionNumber: sectionNumber},
                chapterId: chapterId,
                chapter: chapter,
                files: files,
                sections: sections
            })
        } else {
            await sectionRepository.insertOrUpdateSection(null, chapterId, name, information, sectionNumber)
                .then(result => {
                    res.redirect('/chapter/' + chapterId)
                })
                .catch(err => {
                    throw err
                })
        }
    } else {
        res.redirect('/chapter/' + chapterId)
    }
}

exports.saveEditedSection = async function (req, res, next) {
    let name = req.body.sectionName
    let information = req.body.information
    let sectionNumber = req.body.sectionNumber
    let updatedSectionNumber = req.body.updatedSectionNumber
    let updatedChapterId = req.body.chapterId
    let currentChapterId = req.body.currentChapterId
    let sectionId = req.body.sectionId
    if (updatedChapterId && sectionId && name && sectionNumber && currentChapterId && information && updatedSectionNumber) {
        let errorMessage = "";
        let sectionNumberOccupied = currentChapterId !== updatedChapterId ? await isSectionNumberOccupied(updatedSectionNumber, updatedChapterId) : await isSectionNumberOccupied(updatedSectionNumber, currentChapterId);
        if ((sectionNumberOccupied && sectionNumber !== updatedSectionNumber) || (sectionNumberOccupied && currentChapterId !== updatedChapterId)) errorMessage = "Unterthema Nummer ist schon vergeben, bitte eine andere wählen"
        if (errorMessage) {
            let chapters = await chapterRepository.findAll()
            let informationLessons = await lessonsRepository.findInformationsBySectionId(sectionId);
            let codingLessons = await lessonsRepository.findCodingBySectionId(sectionId);
            let fillTheBlankLessons = await lessonsRepository.findFillTheBlankBySectionId(sectionId);
            let codeExtensionLessons = await lessonsRepository.findCodeExtensionBySectionId(sectionId);
            let singleMultipleChoiceLessons = await lessonsRepository.findSingleMultipleChoiceBySectionId(sectionId);
            let files = await fileRepository.findByChapterId(currentChapterId)
            res.render('sections/editSection', {
                error: errorMessage,
                section: {
                    id: sectionId,
                    name: name,
                    information: information,
                    sectionnumber: sectionNumber
                },
                chapters: chapters,
                currentChapterId: currentChapterId,
                codingLessons: codingLessons,
                informationLessons: informationLessons,
                fillTheBlankLessons: fillTheBlankLessons,
                codeExtensionLessons: codeExtensionLessons,
                singleMultipleChoiceLessons: singleMultipleChoiceLessons,
                files: files
            })
        } else {
            await sectionRepository.insertOrUpdateSection(sectionId, updatedChapterId, name, information, updatedSectionNumber)
                .then(result => {
                    res.redirect('/chapter/' + updatedChapterId)
                })
                .catch(err => {
                    throw err
                })
        }
    } else {
        res.redirect('/chapter/' + currentChapterId)
    }

}
exports.editSection = async function (req, res, next) {
    let chapterId = req.params.chapterId
    let sectionId = req.params.sectionId
    let chapters = await chapterRepository.findAll();
    let informationLessons = await lessonsRepository.findInformationsBySectionId(sectionId);
    let codingLessons = await lessonsRepository.findCodingBySectionId(sectionId);
    let fillTheBlankLessons = await lessonsRepository.findFillTheBlankBySectionId(sectionId);
    let codeExtensionLessons = await lessonsRepository.findCodeExtensionBySectionId(sectionId);
    let singleMultipleChoiceLessons = await lessonsRepository.findSingleMultipleChoiceBySectionId(sectionId);
    let files = await fileRepository.findByChapterId(chapterId)
    await sectionRepository.findById(sectionId)
        .then(result => {
            res.render('sections/editSection', {
                section: result,
                chapters: chapters,
                currentChapterId: chapterId,
                informationLessons: informationLessons,
                codingLessons: codingLessons,
                fillTheBlankLessons: fillTheBlankLessons,
                codeExtensionLessons: codeExtensionLessons,
                singleMultipleChoiceLessons: singleMultipleChoiceLessons,
                files: files,
                sectionId: sectionId,
                chapterId: chapterId
            })
        })
        .catch(err => {
            throw err
        })
}