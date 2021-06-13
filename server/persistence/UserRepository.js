const DbConnector = require("./DbConnector");

class UserRepository {

    static #pool = DbConnector.getDBConnectionPool()

    constructor() {
    }

    static async findAdminByEmail(email) {
        let query = "SELECT * FROM admins WHERE email = $1";
        let result = {}
        result = await this.#pool.query(query, [email])
            .then(res => {
                return res.rows
            }).catch(err => {
                throw  err
            })
        return result
    }

    static async findAdminById(id) {
        let query = "SELECT * FROM admins WHERE id = $1";
        let result = {}
        result = await this.#pool.query(query, [id])
            .then(res => {
                return res.rows
            }).catch(err => {
                throw  err
            })
        return result
    }

    static async saveAdmin(email, hash, salt) {
        let query = "INSERT INTO admins (hash, salt, email) VALUES ($1, $2, $3)";
        this.#pool.query(query, [hash, salt, email])
            .then(res => {
                return res
            }).catch(err => {
            throw  err
        })
    }
}

module.exports = UserRepository;