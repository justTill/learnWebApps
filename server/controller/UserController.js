var passport = require('passport');
var crypto = require('crypto');
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

async function getUserThatSolvedEveryLesson() {
    let allUsers = await userRepository.findAllUsers()
    let lessonIds = await lessonRepository.findAllLessonIds()
    let allSolved = allUsers
    for (let user of allUsers) {
        for (let lessonId of lessonIds) {
            let solvedLesson = await lessonRepository.findSolvedByLessonIdAndMoodleId(lessonId.id, user.moodleid)
            if (solvedLesson.length === 0) {
                allSolved = allSolved.filter(u => {
                    return u.moodleid !== user.moodleid
                })
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
    let answeredProblemsKey = []
    let mappedProblems = new Map()
    for (let problem of mappedAnsweredProblems) {
        let dateString = new Date(problem.createdAt).toISOString().split('T')[0]
        if (mappedProblems.has(dateString)) {
            mappedProblems.get(dateString).push(problem)
        } else {
            answeredProblemsKey.push(dateString)
            mappedProblems.set(dateString, [problem])
        }
    }
    res.render('users/notifications', {
        answeredProblemKeys: answeredProblemsKey,
        answeredProblems: mappedProblems,
        unansweredProblems: unansweredProblems
    })
}

function mapAnsweredProblems(problems) {
    let mappedProblems = new Map()
    for (let problem of problems) {
        if (mappedProblems.has(problem.problemid)) {
            mappedProblems.get(problem.problemid).answers.push("\n \n" + problem.answer)
        } else {
            let mappedProblem = {
                problemId: problem.problemid,
                moodleId: problem.moodleid,
                moodleName: problem.moodlename,
                message: problem.message,
                createdAt: problem.createdat,
                answers: [problem.answer],
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
        await userRepository.insertOrUpdateUserNotifications(null, moodleId, answer, problemId)
    }
    res.redirect('/notifications')
}

exports.registerUser = function (req, res, next) {
    const saltHash = genPassword(req.body.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    userRepository.saveAdmin(req.body.email, hash, salt).then(res => res)
    res.redirect('/');
}
exports.logout = function (req, res, next) {
    req.logout();
    res.redirect('/');
}

function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: genHash
    };
}