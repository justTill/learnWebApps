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