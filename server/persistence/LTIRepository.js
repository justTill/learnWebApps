const DbConnector = require("./DbConnector");
const pool = DbConnector.getDBConnectionPool();


exports.insert = async function (consumerKey, secretKey) {
    let query = "INSERT INTO ltiregistration (consumerkey, secretkey) VALUES ($1, $2)"
    let result = {}
    result = await pool.query(query, [consumerKey, secretKey])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.consumerKeyExist = async function (consumerKey) {
    let query = "Select * from ltiregistration where consumerkey = $1"
    let result = {}
    result = await pool.query(query, [consumerKey])
        .then(res => {
            return res.rows.length !== 0;
        }).catch(err => {
            throw  err
        })
    return result
}

exports.findByConsumerKey = async function (consumerKey) {
    let query = "Select * from ltiregistration where consumerkey = $1"
    let result = {}
    result = await pool.query(query, [consumerKey])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
