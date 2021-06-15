const DbConnector = require("./DbConnector");
const pool = DbConnector.getDBConnectionPool();

exports.findCodeExtentions = async function () {
    let query = 'SELECT * from lessons l INNER JOIN "codeExtensionLessons" cel ON l.id = cel.lessonid'
    let result = {}
    result = await pool.query(query, [])
        .then(res => {
            if (res.rows) {
                return res.rows
            }
            return result
        }).catch(err => {
            throw  err
        })
    return result

}
exports.findCoding = async function () {
    let query = 'SELECT * from lessons l INNER JOIN "codingLessons" cl ON l.id = cl.lessonid'
    let result = {}
    result = await pool.query(query, [])
        .then(res => {
            if (res.rows) {
                return res.rows
            }
            return result
        }).catch(err => {
            throw  err
        })
    return result

}
exports.findFillTheBlank = async function () {
    let query = 'SELECT * from lessons l INNER JOIN "fillTheBlankLessons" ftbl ON l.id = ftbl.lessonid'
    let result = {}
    result = await pool.query(query, [])
        .then(res => {
            if (res.rows) {
                return res.rows
            }
            return result
        }).catch(err => {
            throw  err
        })
    return result

}
exports.findSingleMultipleChoice = async function () {
    let query = 'SELECT * from lessons l INNER JOIN "singleMultipleChoiceLessons" smcl ON l.id = smcl.lessonid'
    let result = {}
    result = await pool.query(query, [])
        .then(res => {
            if (res.rows) {
                return res.rows
            }
            return result
        }).catch(err => {
            throw  err
        })
    return result
}