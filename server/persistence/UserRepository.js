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