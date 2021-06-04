const {Pool} = require('pg')

class DbConnector {

    static #config = {
        connectionString: "postgres://" + process.env.DB_USER + ":" + process.env.DB_PASSWORD + "@" + process.env.DB_CONTAINER_NAME + ":5432/" + process.env.DB_Name,
        host: process.env.DB_CONTAINER_NAME,
        port: 5432,
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