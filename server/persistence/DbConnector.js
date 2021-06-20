const {Pool} = require('pg')

class DbConnector {

    static #config = {
        connectionString: "postgres://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.SQL_HOST + ":" + process.env.SQL_PORT + "/" + process.env.DB_NAME,
        host: process.env.SQL_HOST,
        port: process.env.SQL_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    }

    static #pool = new Pool(DbConnector.#config);

    constructor() {
    }

    static getDBConnectionPool() {
        return this.#pool
    }
}

module.exports = DbConnector;