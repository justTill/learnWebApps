const DbConnector = require("./DbConnector");
const pool = DbConnector.getDBConnectionPool();
exports.findAdminByEmail = async function (email) {
    let query = "SELECT * FROM admins WHERE email = $1";
    let result = {}
    result = await pool.query(query, [email])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}

exports.findAdminById = async function (id) {
    let query = "SELECT * FROM admins WHERE id = $1";
    let result = {}
    result = await pool.query(query, [id])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}

exports.saveAdmin = async function (email, hash, salt) {
    let query = "INSERT INTO admins (hash, salt, email) VALUES ($1, $2, $3)";
    await pool.query(query, [hash, salt, email])
        .then(res => {
            return res
        }).catch(err => {
            throw  err
        })
}

exports.findUserThatSolvedLesson = async function (lessonId) {
    let query = 'SELECT moodlename from "solvedLessons" sl JOIN "persons" p ON sl.moodleid = p.moodleid WHERE sl.lessonid=$1';
    let result = []
    result = await pool.query(query, [lessonId])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.findAllUsers = async function () {
    let query = 'SELECT * from "persons"';
    let result = []
    result = await pool.query(query, [])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}

exports.findAnsweredProblems = async function () {
    let query = 'select p.moodleid, p.message, p.createdat, ps.moodlename, n.answer, p.id as "problemid",n.id as notificationid,  l.id as "lessonid", l.name as "lessonname" from problems p join notifications n on n.problemid = p.id join lessons l on l.id = p.lessonid join persons ps on ps.moodleid = p.moodleid order by p.createdat';
    let result = []
    result = await pool.query(query, [])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.findUnansweredProblem = async function () {
    let query = 'select p.id ,p.moodleid,p.message ,p.createdat ,p.lessonid, ps.moodlename, l."name" as lessonname from problems p left outer join notifications n on p.id = n.problemid join persons ps on p.moodleid = ps.moodleid join lessons l on l.id = p.lessonid where n.id IS null';
    let result = []
    result = await pool.query(query, [])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.deleteProblemById = async function (id) {
    let query = 'DELETE from problems WHERE id=$1';
    let result = []
    result = await pool.query(query, [id])
        .then(res => {
            return res
        }).catch(err => {
            throw  err
        })
    return result
}
exports.insertOrUpdateUserNotifications = async function (id, moodleId, answer, problemId) {
    let result = []
    if (id) {
        let query = 'UPDATE notifications set moodleid=$1, answer=$2, problemid=$3 where id=$4';
        result = await pool.query(query, [moodleId, answer, problemId, id])
            .then(res => {
                return res
            }).catch(err => {
                throw  err
            })
    } else {
        let query = 'INSERT INTO notifications (moodleid, answer, problemid) VALUES ($1, $2, $3)';
        result = await pool.query(query, [moodleId, answer, problemId])
            .then(res => {
                return res
            }).catch(err => {
                throw  err
            })
    }
    return result
}
exports.findUserByMoodleIdAndMoodleName = async function (moodleId, moodleName) {
    let query = 'SELECT * from persons where moodleid=$1 and moodlename=$2';
    let result = []
    result = await pool.query(query, [moodleId, moodleName])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.createPerson = async function (moodleId, moodleName) {
    let query = 'INSERT INTO persons (moodleid, moodlename) VALUES ($1, $2)';
    let result = []
    result = await pool.query(query, [moodleId, moodleName])
        .then(res => {
            return res
        }).catch(err => {
            throw  err
        })
    return result
}
exports.findProblemsAndAnswersByUser = async function (moodleId, moodleName) {
    let query = 'select p.id,p.createdat, p.message, p.lessonid, n.answer, l."name", l.id as lessonid from problems p left join notifications n on p.id = n.problemid join persons pe on p.moodleid = pe.moodleid join lessons l on l.id = p.lessonid where p.moodleid=$1 and pe.moodlename=$2 order by p.createdat DESC  ';
    let result = []
    result = await pool.query(query, [moodleId, moodleName])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.insertNotesForUser = async function (moodleId, note) {
    let query = 'INSERT INTO notes (moodleid, note) VALUES ($1, $2)';
    let result = []
    result = await pool.query(query, [moodleId, note])
        .then(res => {
            return res
        }).catch(err => {
            throw  err
        })
    return result
}
exports.findNotesByUser = async function (moodleId, moodlename) {
    let query = 'SELECT * from notes n join persons p on p.moodleid = n.moodleid where n.moodleid=$1 and p.moodlename=$2 order by n.id';
    let result = []
    result = await pool.query(query, [moodleId, moodlename])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}

exports.insertSolvedLessonForUser = async function (lessonId, moodleId, userCode) {
    let result = []
    let query = 'INSERT INTO "solvedLessons" (moodleid, lessonid, code) VALUES ($1, $2, $3)';
    result = await pool.query(query, [moodleId, lessonId, userCode])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.insertProblemForUser = async function (moodleId, lessonId, problem) {
    let result = []
    let query = 'INSERT INTO "problems" (moodleid, lessonid, message) VALUES ($1, $2, $3)';
    result = await pool.query(query, [moodleId, lessonId, problem])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.deleteSolvedByMoodleId = async function (moodleId) {
    let result = []
    let query = 'DELETE from "solvedLessons" WHERE moodleId=$1';
    result = await pool.query(query, [moodleId])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}