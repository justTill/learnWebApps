var lessonsRepository = require("../persistence/LessonRepository")
var fileRepository = require("../persistence/FileRepository")
var sectionRepository = require("../persistence/SectionRepository")
var isLessonNumberOccupied = require("../utils/lessons").isLessonNumberOccupied
var getEditSectionData = require("../utils/sectionData").getEditSectionData

exports.deleteLesson = async function (req, res, next) {
    let chapterId = req.params.chapterId
    let sectionId = req.params.sectionId
    let lessonId = req.params.lessonId
    await lessonsRepository.deleteById(lessonId)
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
        lesson: codingLesson,
        updatedSectionId: req.params.sectionId,
        sections: sections,
        files: files
    })
}

exports.saveEditCodingLesson = async function (req, res, next) {
    let chapterId = req.body.chapterId
    let sectionId = req.body.sectionId
    let lessonId = req.body.lessonId
    let updatedSectionId = req.body.updatedSectionId
    let codingLessonId = req.body.lessonTypeId
    let lessonName = req.body.lessonName
    let updatedLessonNumber = req.body.updatedLessonNumber
    let lessonNumber = req.body.lessonNumber
    let lessonInformation = req.body.lessonInformation
    let verificationType = req.body.verificationType
    let verificationCode = req.body.verificationCode
    let exampleSolution = req.body.exampleSolution
    let verificationInformation = req.body.verificationInformation
    let difficultyLevel = req.body.difficultyLevel
    let feedback = req.body.feedback === "" ? null : req.body.feedback
    if (chapterId && codingLessonId && difficultyLevel && sectionId && lessonId && lessonName && lessonNumber && lessonInformation && updatedLessonNumber && verificationType && verificationCode && exampleSolution && verificationInformation) {
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
                lesson: {
                    id: codingLessonId,
                    sectionid: sectionId,
                    lessonnumber: lessonNumber,
                    information: lessonInformation,
                    name: lessonName,
                    difficultylevel: difficultyLevel,
                    feedback: feedback,
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
        await lessonsRepository.insertOrUpdateCodingLesson(lessonId, codingLessonId, updatedSectionId, updatedLessonNumber, lessonInformation, lessonName, difficultyLevel, feedback, verificationType, verificationCode, exampleSolution, verificationInformation)
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
    let difficultyLevel = req.body.difficultyLevel
    let feedback = req.body.feedback === "" ? null : req.body.feedback
    if (chapterId && sectionId && lessonName && difficultyLevel && lessonNumber && lessonInformation && verificationType && exampleSolution && verificationCode && verificationInformation) {
        let lessonNumberOccupied = await isLessonNumberOccupied(lessonNumber, sectionId);
        if (lessonNumberOccupied) {
            let errorMessage = "Aufgaben Nummer ist schon vergeben, bitte eine andere wählen"
            let lesson = {
                name: lessonName,
                lessonnumber: lessonNumber,
                information: lessonInformation,
                difficultylevel: difficultyLevel,
                feedback: feedback,
                verificationtype: verificationType,
                examplesolution: exampleSolution,
                verificationcode: verificationCode,
                verificationinformation: verificationInformation
            }
            let data = await getEditSectionData(sectionId, chapterId, lesson)
            data.codingErrorMessages = errorMessage
            res.render('sections/editSection', data)
        } else {
            await lessonsRepository.insertOrUpdateCodingLesson(null, null, sectionId, lessonNumber, lessonInformation, lessonName, difficultyLevel, feedback, verificationType, verificationCode, exampleSolution, verificationInformation)
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
