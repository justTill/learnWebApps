var passport = require('passport');
const fs = require('fs')
var userRepository = require("../persistence/UserRepository")
var chapterRepository = require("../persistence/ChapterRepository")
var sectionRepository = require("../persistence/SectionRepository")
var lessonRepository = require("../persistence/LessonRepository")

exports.authenticate = passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect: '/'
}), (err, req, res, next) => {
    if (err) next(err);
};
exports.openManual = async function (req, res, next) {
    let filePath = "./public/manual.pdf";
    fs.readFile(filePath, function (err, data) {
        res.contentType("application/pdf");
        res.send(data);
    });
};

async function getUserThatSolvedEveryLesson() {
    let allUsers = await userRepository.findAllUsers()
    let lessonIds = await lessonRepository.findAllLessonIds()
    let allSolved = allUsers
    for (let user of allUsers) {
        for (let lessonId of lessonIds) {
            if (lessonId.difficultylevel !== null) {
                let solvedLesson = await lessonRepository.findSolvedByLessonIdAndMoodleId(lessonId.id, user.moodleid)
                if (solvedLesson.length === 0) {
                    allSolved = allSolved.filter(u => {
                        return u.moodleid !== user.moodleid
                    })
                }
            }
        }
    }
    return allSolved
}

async function getUsersThatSolvedLessonsByChapter() {
    let solvedByChapter = []
    let chapters = await chapterRepository.findAll();
    let chapterCounter = 0
    let lessonIds = []
    for (let chapter of chapters) {
        let sections = await sectionRepository.findByChapterId(chapter.id)
        solvedByChapter.push({id: chapter.id, chapterName: chapter.name, sections: []})
        let sectionCounter = 0
        for (let section of sections) {
            solvedByChapter[chapterCounter].sections.push({id: section.id, sectionName: section.name, lessons: []})
            let lessons = await lessonRepository.findAllBySectionId(section.id)
            for (let lesson of lessons) {
                lessonIds.push(lesson.id)
                let users = await userRepository.findUserThatSolvedLesson(lesson.id)
                solvedByChapter[chapterCounter].sections[sectionCounter].lessons.push({
                    lessonName: lesson.name,
                    solvedBy: users,
                    id: lesson.id
                })
            }
            sectionCounter++
        }
        chapterCounter++
    }
    return solvedByChapter
}

exports.deleteProblem = async function (req, res, next) {
    await userRepository.deleteProblemById(req.body.problemId)
    res.redirect('/notifications')
}
exports.markProblemAsSeen = async function (req, res, next) {
    userRepository.updateNotificationsSeenForProblem(req.body.problemId, true)
        .then(res => res)
        .catch(err => {
        })
    res.redirect('/notifications')
}

exports.showUserOverview = async function (req, res, next) {
    let solvedLessonsByChapter = await getUsersThatSolvedLessonsByChapter();
    let userThatSolvedEveryLesson = await getUserThatSolvedEveryLesson();
    res.render('users/overview', {
        solvedByChapter: solvedLessonsByChapter,
        solvedEveryLesson: userThatSolvedEveryLesson
    })
}
exports.showUserNotifications = async function (req, res, next) {
    let unansweredProblems = await userRepository.findUnansweredProblem()
    let answeredProblems = await userRepository.findAnsweredProblems()
    let mappedAnsweredProblems = mapAnsweredProblems(answeredProblems)
    res.render('users/notifications', {
        unansweredProblems: unansweredProblems,
        seenProblems: mappedAnsweredProblems.filter(p => p.seen),
        unseenProblems: mappedAnsweredProblems.filter(p => !p.seen)
    })
}

function mapAnsweredProblems(problems) {
    let mappedProblems = new Map()
    for (let problem of problems) {
        let sender = problem.sender === "STUDENT" ? "vom: Studenten" : "vom: Dozenten"
        if (mappedProblems.has(problem.problemid)) {
            mappedProblems.get(problem.problemid).answers.push("\n \n" + problem.answer + "\n " + sender)
            mappedProblems.get(problem.problemid).seen = problem.sender !== "STUDENT" || problem.seen
        } else {
            let mappedProblem = {
                problemId: problem.problemid,
                moodleId: problem.moodleid,
                moodleName: problem.moodlename,
                seen: problem.sender !== "STUDENT" || problem.seen,
                message: problem.message,
                createdAt: problem.createdat,
                answers: [problem.answer + "\n " + sender],
                lessonId: problem.lessonid,
                lessonName: problem.lessonname,
                notificationId: problem.notificationid,
            }
            mappedProblems.set(problem.problemid, mappedProblem)
        }
    }
    return Array.from(mappedProblems.values())
}

exports.saveAnswerOnProblem = async function (req, res, next) {
    let problemId = req.body.problemId
    let moodleId = req.body.moodleId
    let answer = req.body.answer
    if (problemId && moodleId && answer) {
        await userRepository.insertOrUpdateUserNotifications(null, moodleId, answer, problemId, "LECTURER", true)
            .then(res => res)
            .catch(err => console.log(err))
    }
    res.redirect('/notifications')
}

exports.logout = function (req, res, next) {
    req.logout();
    res.redirect('/');
}