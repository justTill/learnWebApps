var sectionRepository = require("../persistence/SectionRepository")
var chapterRepository = require("../persistence/ChapterRepository")


async function isSectionNumberOccupied(number) {
    let section = await sectionRepository.findBySectionNumber(number);
    console.log(section)
    return Object.keys(section).length !== 0
}

exports.deleteSection = async function (req, res, next) {
    let sectionId = req.params.sectionId
    let chapterId = req.params.chapterId
    sectionRepository.deleteById(sectionId)
        .then(rows => {
            res.redirect("/chapter/" + chapterId)
        })
        .catch(err => {
            throw err
        })
}
exports.createSection = async function (req, res, next) {
    res.render('sections/createSection', {chapterId: req.params.chapterId})

}

exports.saveNewSection = async function (req, res, next) {
    let chapterId = req.body.chapterId
    let name = req.body.sectionName
    let information = req.body.information
    let sectionNumber = req.body.sectionNumber
    if (chapterId && name && information && sectionNumber) {
        let numberOccupied = await isSectionNumberOccupied(sectionNumber);
        if (numberOccupied) {
            res.render('sections/createSection', {
                error: "Unterthema Nummer ist schon vergeben, bitte eine andere wählen",
                sectionData: {name: name, information: information, sectionNumber: sectionNumber},
                chapterId: chapterId
            })
        } else {
            sectionRepository.insertOrUpdateChapter(null, chapterId, name, information, sectionNumber)
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
    let chapterId = req.body.chapterId
    let currentChapterId = req.body.currentChapterId
    let sectionId = req.body.sectionId
    if (chapterId && sectionId && name && sectionNumber && currentChapterId && information && updatedSectionNumber) {
        if (sectionNumber !== updatedSectionNumber) {
            let numberOccupied = await isSectionNumberOccupied(updatedSectionNumber);
            if (numberOccupied) {
                let chapters = await chapterRepository.findAll()
                res.render('sections/editSection', {
                    error: "Unterthema Nummer ist schon vergeben, bitte eine andere wählen",
                    section: {
                        id: sectionId,
                        name: name,
                        information: information,
                        sectionnumber: sectionNumber
                    },
                    chapters: chapters,
                    currentChapterId: currentChapterId,
                })
            }
        } else {
            sectionRepository.insertOrUpdateChapter(sectionId, chapterId, name, information, updatedSectionNumber)
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
exports.editSection = async function (req, res, next) {
    let chapterId = req.params.chapterId
    let sectionId = req.params.sectionId
    let chapters = await chapterRepository.findAll();
    sectionRepository.findById(sectionId)
        .then(result => {
            res.render('sections/editSection', {
                section: result,
                chapters: chapters,
                currentChapterId: chapterId
            })
        })
        .catch(err => {
            throw err
        })
}