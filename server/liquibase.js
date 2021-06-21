const liquibase = require("liquibase-wrapper");
const config = {
    changeLogFile: './liquibase/changelog.json',
    url: 'jdbc:postgresql://' + process.env.SQL_HOST + ':' + process.env.SQL_PORT + '/' + process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    classpath: "postgres/postgresql-42.2.18.jar"
}

liquibase(config).run("update")
    .then(() => console.log('success'))
    .catch((err) => {
        console.log("Failed to run Liquibase update: ", err);
    });