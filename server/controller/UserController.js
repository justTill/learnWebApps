var passport = require('passport');
const fs = require('fs')
var userRepository = require("../persistence/UserRepository")
var chapterRepository = require("../persistence/ChapterRepository")
var sectionRepository = require("../persistence/SectionRepository")
var lessonRepository = require("../persistence/LessonRepository")
var lti = require("ims-lti")
var crypto = require('crypto');

exports.authenticate = passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect: '/'
}), (err, req, res, next) => {
    if (err) next(err);
};

const secrets = {
    demo: '123456789',
    demo2: '123456789'
};
const nonceStore = new lti.Stores.MemoryStore();

const getSecret = (consumerKey, callback) => {
    const secret = consumerKey = secrets.demo;
    if (secret) {
        return callback(null, secret);
    }

    let err = new Error(`Unknown consumer ${consumerKey}`);
    err.status = 403;

    return callback(err);
};
exports.handleLTILaunch = async function (req, res, next) {
    if (!req.body) {
        let err = new Error('Expected a body');
        err.status = 400;
        return next(err);
    }
    const consumerKey = req.body.oauth_consumer_key;
    if (!consumerKey) {
        let err = new Error('Expected a consumer');
        err.status = 422;
        return next(err);
    }
    getSecret(consumerKey, (err, consumerSecret) => {
        if (err) {
            return next(err);
        }
        const provider = new lti.Provider(consumerKey, consumerSecret, nonceStore, lti.HMAC_SHA1);
        provider.valid_request(req, (err, isValid) => {
            if (err) {
                return next(err);
            }
            if (isValid) {
                req.session.regenerate(err => {
                    if (err) next(err);
                    //does not work since moodle is localhost and localhost in docker is different
                    //provider.outcome_service.send_replace_result(1, (err, isValid) => console.log(err))
                    req.session.email = provider.body.lis_person_contact_email_primary;
                    req.session.contextId = provider.context_id;
                    req.session.userId = provider.userId;
                    req.session.username = provider.username;
                    req.session.ltiConsumer = provider.body.tool_consumer_instance_guid;
                    req.session.isTutor = provider.instructor === true;
                    req.session.context_id = provider.context_id;

                    return res.redirect(301, 'http://localhost:8080');
                });
            } else {
                return next(err);
            }
        });
    });
}

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
        .catch(err => console.log(err))
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
    let unseenProblems = mappedAnsweredProblems.filter(p => !p.seen)
    let seenProblems = mappedAnsweredProblems.filter(p => p.seen)
    for (let problem of seenProblems) {
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
        unansweredProblems: unansweredProblems,
        unseenProblems: unseenProblems
    })
}

function mapAnsweredProblems(problems) {
    let mappedProblems = new Map()
    for (let problem of problems) {
        let sender = problem.sender === "STUDENT" ? "vom: studenten" : "vom: Dozenten"
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