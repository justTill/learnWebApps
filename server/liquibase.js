const Liquibase = require('liquibase').Liquibase;
const POSTGRESQL_DEFAULT_CONFIG = require('liquibase').POSTGRESQL_DEFAULT_CONFIG;

const myConfig = {
    ...POSTGRESQL_DEFAULT_CONFIG,
    changeLogFile: './liquibase/changelog.json',
    url: 'jdbc:postgresql://' + process.env.DB_CONTAINER_NAME + ':5432/' + process.env.DB_Name,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
}
const instTs = new Liquibase(myConfig);

instTs.status()
    .then(r => {
        instTs.update()
            .then(console.log("Successfully run liquibase"))
            .catch(e => console.log(e))
    }).catch(e => console.log(e));