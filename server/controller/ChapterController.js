var chapterRepository = require("../persistence/ChapterRepository")
var fileRepository = require("../persistence/FileRepository")
var sectionRepository = require("../persistence/SectionRepository")
var mv = require('mv');
const path = require("path");
const fs = require("fs");

exports.showChapterOverview = async function (req, res, next) {
    await chapterRepository.findAll()
        .then(rows => {
            res.render('chapters/chapter', {chapters: rows})
        })
        .catch(err => {
            throw err
        })
}

exports.deleteChapter = async function (req, res, next) {
    let id = req.params.id
    await chapterRepository.deleteById(id)
        .then(rows => {
            res.redirect("/chapter")
        })
        .catch(err => {
            throw err
        })
}

exports.editChapter = async function (req, res, next) {
    let id = req.params.id
    let files = await fileRepository.findByChapterId(id)
    let sections = await sectionRepository.findByChapterId(id)
    await chapterRepository.findById(id)
        .then(chapter => {
            res.render('chapters/editChapter', {chapter: chapter, files: files, sections: sections})
        })
        .catch(err => {
            throw err
        })
}
exports.createChapter = async function (req, res, next) {
    res.render('chapters/createChapter')
}

exports.saveNewChapter = async function (req, res, next) {
    let name = req.body.chapterName
    let overview = req.body.overview
    let chapterNumber = req.body.chapterNumber
    let chapter = await chapterRepository.findByChapterNumber(chapterNumber)
    let chapters = await chapterRepository.findAll()
    if (Object.keys(chapter).length !== 0) {
        res.render('chapters/chapter', {
            error: "Kapitelnummer ist schon vergeben, bitte eine andere wählen",
            chapterData: {name: name, overview: overview, chapterNumber: chapterNumber},
            chapters: chapters,
        })
    } else if (name && overview && chapterNumber) {
        await chapterRepository.insertOrUpdateChapter(null, name, overview, chapterNumber)
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

exports.saveEditedChapter = async function (req, res, next) {
    let name = req.body.chapterName
    let overview = req.body.overview
    let chapterNumber = req.body.chapterNumber
    let updatedChapterNumber = req.body.updatedChapterNumber
    let chapterId = req.body.chapterId
    if (chapterId && name && overview && chapterNumber && updatedChapterNumber) {
        if (chapterNumber !== updatedChapterNumber) {
            let chapter = await chapterRepository.findByChapterNumber(updatedChapterNumber)
            if (Object.keys(chapter).length !== 0) {
                let sections = await sectionRepository.findByChapterId(chapterId)
                let files = await fileRepository.findByChapterId(chapterId)
                res.render('chapters/editChapter', {
                    editChapterErrorMessage: "Kapitelnummer ist schon vergeben, bitte eine andere wählen",
                    chapter: {id: chapterId, name: name, overview: overview, chapternumber: chapterNumber},
                    sections: sections,
                    files: files
                })
                return
            }
        }
        await chapterRepository.insertOrUpdateChapter(chapterId, name, overview, updatedChapterNumber)
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