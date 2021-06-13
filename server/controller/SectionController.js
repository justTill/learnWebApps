var sectionRepository = require("../persistence/SectionRepository")


async function isSectionNumberOccupied(number) {
    let section = await sectionRepository.findBySectionNumber(number);
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

exports.saveSection = async function (req, res, next) {
    let chapterId = req.body.chapterId
    let updatedChapterId = req.body.updatedChapterId
    let sectionId = req.body.sectionId
    let name = req.body.sectionName
    let information = req.body.information
    let sectionNumber = req.body.sectionNumber
    if (!sectionId && sectionNumber) {
        let numberOccupied = await isSectionNumberOccupied(sectionNumber);
        if (numberOccupied) {
            res.render('sections/createSection', {
                error: "Unterthema Nummer ist schon vergeben, bitte eine andere wählen",
                sectionData: {name: name, information: information, sectionNumber: sectionNumber}
            })
            return
        }

    }
    if (name && information && sectionNumber) {
        sectionRepository.insertOrUpdateChapter(sectionId, chapterId, name, information, sectionNumber)
            .then(result => {
                res.redirect('/chapter/' + chapterId)
            })
            .catch(err => {
                throw err
            })
    } else {
        res.redirect('/chapter/' + chapterId)
    }

}
exports.editSection = async function (req, res, next) {
    let sectionId = req.params.id
    sectionRepository.findById(sectionId)
        .then(result => {
            res.render('sections/editSection')
        })
        .catch(err => {
            throw err
        })
}