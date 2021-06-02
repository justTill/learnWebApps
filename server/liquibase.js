const Liquibase = require('liquibase').Liquibase;
const POSTGRESQL_DEFAULT_CONFIG = require('liquibase').POSTGRESQL_DEFAULT_CONFIG;

const myConfig = {
    ...POSTGRESQL_DEFAULT_CONFIG,
    changeLogFile: './liquibase/changelog.json',
    url: 'jdbc:postgresql://' + process.env.DB_CONTAINER_NAME + ':5432/' + process.env.DB_Name,
    username: process.env.DB_USER, //'webAdmin',
    password: process.env.DB_PASSWORD,
}
const instTs = new Liquibase(myConfig);

instTs.update().then(r => console.log("Successfully run liquibase")).catch(e => process.exit(1));