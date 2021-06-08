const DbConnector = require("./DbConnector");
const {Pool} = require('pg')

class UserRepository {

    static #pool = DbConnector.getDBConnectionPool()

    constructor() {
    }

    getUsers() {
    }

    static async findByEmail(email) {
        let query = "Select * from admins where email = $1";
        let result = await this.#pool.query(query, [email])
            .then(res => {
                return res.rows
            }).catch(err => {
                throw  err
            })
        return result
    }
}

module.exports = UserRepository;