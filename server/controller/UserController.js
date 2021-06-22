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
        solvedByChapter.push({chapterName: chapter.name, sections: []})
        let sectionCounter = 0
        for (let section of sections) {
            solvedByChapter[chapterCounter].sections.push({sectionName: section.name, lessons: []})
            let lessons = await lessonRepository.findAllBySectionId(section.id)
            for (let lesson of lessons) {
                lessonIds.push(lesson.id)
                let users = await userRepository.findUserThatSolvedLesson(lesson.id)
                solvedByChapter[chapterCounter].sections[sectionCounter].lessons.push({
                    lessonName: lesson.name,
                    solvedBy: users
                })
            }
            sectionCounter++
        }
        chapterCounter++
    }
    return solvedByChapter
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
    res.render('users/notifications')
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