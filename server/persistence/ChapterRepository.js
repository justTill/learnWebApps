const DbConnector = require("./DbConnector");
const pool = DbConnector.getDBConnectionPool();

exports.findAll = async function () {
    let query = "SELECT * from chapters ORDER BY chapternumber;"
    let result = []
    result = await pool.query(query)
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.findById = async function (id) {
    let query = "SELECT * from chapters where id= $1;"
    let result = []
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

exports.insertOrUpdateChapter = async function (id, name, overview, chapterNumber) {
    let result = false
    if (id) {
        let query = "UPDATE chapters SET name=$1, overview=$2, chapternumber=$3 WHERE id=$4;"
        result = await pool.query(query, [name, overview, chapterNumber, id])
            .then(res => {
                console.log(res)
                return true
            }).catch(err => {
                throw  err
            })
    } else {
        let query = "INSERT INTO chapters (name, overview, chapternumber) VALUES ($1,$2, $3);"
        result = await pool.query(query, [name, overview, chapterNumber])
            .then(res => {
                return true
            }).catch(err => {
                throw  err
            })
    }
    return result
}