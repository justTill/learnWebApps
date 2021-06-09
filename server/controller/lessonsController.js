var chapterRepository = require("../persistence/ChapterRepository")


exports.showChapterOverview = async function (req, res, next) {
    chapterRepository.findAll()
        .then(rows => {
            res.render('create/chapter', {chapters: rows})
        })
        .catch(err => {
            throw err
        })
}

exports.editChapter = async function (req, res, next) {
    let id = req.params.id
    chapterRepository.findById(id)
        .then(chapter => {
            res.render('create/editChapter', {chapter: chapter})
        })
        .catch(err => {
            throw err
        })
}
exports.createChapter = async function (req, res, next) {
    res.render('create/createChapter')
}

exports.saveChapter = async function (req, res, next) {
    let id = req.body.id
    let name = req.body.chapterName
    let overview = req.body.overview
    let chapterNumber = req.body.chapterNumber
    console.log(id)
    if (name && overview && chapterNumber) {
        chapterRepository.insertOrUpdateChapter(id, name, overview, chapterNumber)
            .then(result => {
                res.redirect('/chapter')
            })
            .catch(err => {
                throw err
            })
    } else {
        res.redirect('/chapter')
    }
}