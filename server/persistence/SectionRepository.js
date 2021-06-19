const DbConnector = require("./DbConnector");
const pool = DbConnector.getDBConnectionPool();

exports.findByChapterId = async function (chapterId) {
    let query = "SELECT * from sections where chapterid= $1 ORDER BY sectionnumber;"
    let result = {}
    result = await pool.query(query, [chapterId])
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
exports.findBySectionNumber = async function (sectionNumber, chapterId) {
    let query = "SELECT * from sections where sectionnumber=$1 AND chapterid=$2;"
    let result = {}
    result = await pool.query(query, [sectionNumber, chapterId])
        .then(res => {
            if (res.rows[0]) {
                return res.rows[0]
            }
            return result
        }).catch(err => {
            throw  err
        })
    return result
}

exports.deleteById = async function (id) {
    let query = "DELETE from sections where id= $1;"
    let result = await pool.query(query, [id])
        .then(res => {
            return res
        }).catch(err => {
            throw  err
        })
    return result
}

exports.findById = async function (id) {
    let query = "SELECT * from sections where id= $1;"
    let result = {}
    result = await pool.query(query, [id])
        .then(res => {
            if (res.rows[0]) {
                return res.rows[0]
            }
        }).catch(err => {
            throw  err
        })
    return result
}


exports.insertOrUpdateChapter = async function (id, chapterId, name, information, sectionNumber) {
    let result
    if (id) {
        let query = "UPDATE sections SET name=$1, chapterid=$2, information=$3, sectionnumber=$4 WHERE id=$5;"
        result = pool.query(query, [name, chapterId, information, sectionNumber, id])
            .then(res => {
                return res
            }).catch(err => {
                throw  err
            })
    } else {
        let query = "INSERT INTO sections (chapterid, name,information, sectionnumber) VALUES ($1,$2,$3,$4);"
        result = pool.query(query, [chapterId, name, information, sectionNumber])
            .then(res => {
                return res
            }).catch(err => {
                throw  err
            })
    }
    return result
}
