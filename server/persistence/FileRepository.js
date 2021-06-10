const DbConnector = require("./DbConnector");
const pool = DbConnector.getDBConnectionPool();

exports.insert = async function (chapterId, path) {
    let query = "INSERT INTO files (chapterid, path) VALUES ($1, $2)"
    let result = []
    result = await pool.query(query, [chapterId, path])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}

exports.findByChapterId = async function (chapterId) {
    let query = "SELECT * from files where chapterid=$1"
    let result = []
    result = await pool.query(query, [chapterId])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}