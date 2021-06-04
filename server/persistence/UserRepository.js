const DbConnector = require("./DbConnector");
const {Pool} = require('pg')

class UserRepository {

    static #pool = DbConnector.getDBConnectionPool()

    constructor() {
    }

    getUsers() {
    }
}

module.exports = UserRepository;