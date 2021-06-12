var chapterRepository = require("../persistence/ChapterRepository")
var fileRepository = require("../persistence/FileRepository")
var mv = require('mv');
const path = require("path");
const fs = require("fs");

exports.showChapterOverview = async function (req, res, next) {
    chapterRepository.findAll()
        .then(rows => {
            res.render('chapters/chapter', {chapters: rows})
        })
        .catch(err => {
            throw err
        })
}

exports.editChapter = async function (req, res, next) {
    let id = req.params.id
    let files = await fileRepository.findByChapterId(id)
    chapterRepository.findById(id)
        .then(chapter => {
            res.render('chapters/editChapter', {chapter: chapter, files: files})
        })
        .catch(err => {
            throw err
        })
}
exports.createChapter = async function (req, res, next) {
    res.render('chapters/createChapter')
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

exports.uploadMedia = async function (req, res, next) {
    let id = req.body.chapter
    let chapter = await chapterRepository.findById(id)
    let imagePath = chapter.name.split(' ').join('') + "/" + req.file.originalname
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "../mediafiles/" + imagePath);
    let allowedFiles = [".gif", ".png", ".jpg", ".jpeg"]
    if (allowedFiles.includes(path.extname(req.file.originalname).toLowerCase())) {
        mv(tempPath, targetPath, {mkdirp: true}, err => {
            if (err) {
                throw err
            }
            fileRepository.insert(id, imagePath)
            chapterRepository.findAll()
                .then(rows => res.render('chapters/chapter', {chapters: rows, fileUploaded: true}))
        });
    } else {
        fs.unlink(tempPath, err => {
            if (err) {
                res.redirect("/chapter")
            }
            ;
            chapterRepository.findAll()
                .then(rows => res.render('chapters/chapter', {
                    chapters: rows,
                    fileError: "Datei ist kein png, jpg, jpeg oder gif"
                }))
        });
    }

}