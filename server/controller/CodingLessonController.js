var lessonsRepository = require("../persistence/LessonRepository")
var fileRepository = require("../persistence/FileRepository")
var sectionRepository = require("../persistence/SectionRepository")
var isLessonNumberOccupied = require("../utils/lessons").isLessonNumberOccupied

exports.deleteLesson = async function (req, res, next) {
    let chapterId = req.params.chapterId
    let sectionId = req.params.sectionId
    let lessonId = req.params.lessonId
    lessonsRepository.deleteById(lessonId)
        .then(rows => {
            res.redirect("/section/" + chapterId + "/" + sectionId)
        })
        .catch(err => {
            throw err
        })

}
exports.editCodingLesson = async function (req, res, next) {
    let chapterId = req.params.chapterId
    let sectionId = req.params.sectionId
    let lessonId = req.params.lessonId
    let codingLesson = await lessonsRepository.findCodingByLessonId(lessonId)
    let sections = await sectionRepository.findByChapterId(chapterId)
    let files = await fileRepository.findByChapterId(chapterId)
    res.render('lessons/editCodingLesson', {
        chapterId: chapterId,
        sectionId: sectionId,
        lessonId: lessonId,
        codingLesson: codingLesson,
        updatedSectionId: req.params.sectionId,
        sections: sections,
        files: files
    })
}
exports.createCodingLesson = async function (req, res, next) {
    let files = await fileRepository.findByChapterId(req.params.chapterId)
    res.render('lessons/createCodingLesson', {
        chapterId: req.params.chapterId,
        sectionId: req.params.sectionId,
        files: files
    })
}

exports.saveEditCodingLesson = async function (req, res, next) {
    let chapterId = req.body.chapterId
    let sectionId = req.body.sectionId
    let lessonId = req.body.lessonId
    let updatedSectionId = req.body.updatedSectionId
    let codingLessonId = req.body.codingLessonId
    let lessonName = req.body.lessonName
    let updatedLessonNumber = req.body.updatedLessonNumber
    let lessonNumber = req.body.lessonNumber
    let lessonInformation = req.body.lessonInformation
    let verificationType = req.body.verificationType
    let verificationCode = req.body.verificationCode
    let exampleSolution = req.body.exampleSolution
    let verificationInformation = req.body.verificationInformation
    if (chapterId && codingLessonId && sectionId && lessonId && lessonName && lessonNumber && lessonInformation && updatedLessonNumber && verificationType && verificationCode && exampleSolution && verificationInformation) {
        let errorMessage = "";
        let lessonNumberOccupied = sectionId !== updatedSectionId ? await isLessonNumberOccupied(updatedLessonNumber, updatedSectionId) : await isLessonNumberOccupied(updatedLessonNumber, sectionId);
        if ((lessonNumberOccupied && lessonNumber !== updatedLessonNumber) || (lessonNumberOccupied && sectionId !== updatedSectionId)) errorMessage = "Aufgabennummer ist schon vergeben, bitte eine andere wählen";
        if (errorMessage) {
            let sections = await sectionRepository.findByChapterId(chapterId)
            let files = await fileRepository.findByChapterId(chapterId)
            res.render('lessons/editCodingLesson', {
                error: errorMessage,
                chapterId: chapterId,
                sectionId: sectionId,
                lessonId: lessonId,
                codingLesson: {
                    id: codingLessonId,
                    sectionid: sectionId,
                    lessonnumber: lessonNumber,
                    information: lessonInformation,
                    name: lessonName,
                    lessonid: lessonId,
                    verificationtype: verificationType,
                    verificationcode: verificationCode,
                    examplesolution: exampleSolution,
                    verificationinformation: verificationInformation,
                },
                sections: sections,
                updatedSectionId: sectionId,
                files: files
            })
            return
        }
        lessonsRepository.insertOrUpdateCodingLesson(lessonId, codingLessonId, updatedSectionId, updatedLessonNumber, lessonInformation, lessonName, verificationType, verificationCode, exampleSolution, verificationInformation)
            .then(result => {
                res.redirect('/section/' + chapterId + '/' + updatedSectionId)
            })
            .catch(err => {
                throw err
            })
    } else {
        res.redirect('/section/' + chapterId + '/' + sectionId)
    }
}

exports.saveCreateCodingLesson = async function (req, res, next) {
    let chapterId = req.body.chapterId
    let sectionId = req.body.sectionId
    let lessonName = req.body.lessonName
    let lessonNumber = req.body.lessonNumber
    let lessonInformation = req.body.lessonInformation
    let verificationType = req.body.verificationtype
    let exampleSolution = req.body.examplesolution
    let verificationCode = req.body.verificationCode
    let verificationInformation = req.body.verificationInformation
    if (chapterId && sectionId && lessonName && lessonNumber && lessonInformation && verificationType && exampleSolution && verificationCode && verificationInformation) {
        let lessonNumberOccupied = await isLessonNumberOccupied(lessonNumber, sectionId);
        if (lessonNumberOccupied) {
            let files = await fileRepository.findByChapterId(chapterId)
            res.render("lessons/createCodingLesson", {
                error: "Aufgaben Nummer ist schon vergeben, bitte eine andere wählen",
                codinglesson: {
                    name: lessonName,
                    lessonnumber: lessonNumber,
                    information: lessonInformation,
                    verificationtype: verificationType,
                    examplesolution: exampleSolution,
                    verificationcode: verificationCode,
                    verificationinformation: verificationInformation
                },
                chapterId: chapterId,
                sectionId: sectionId,
                files: files
            })
        } else {
            lessonsRepository.insertOrUpdateCodingLesson(null, null, sectionId, lessonNumber, lessonInformation, lessonName, verificationType, verificationCode, exampleSolution, verificationInformation)
                .then(result => {
                    res.redirect('/section/' + chapterId + '/' + sectionId)
                })
                .catch(err => {
                    throw err
                })
        }
    } else {
        res.redirect('/section/' + chapterId + '/' + sectionId)
    }
}
