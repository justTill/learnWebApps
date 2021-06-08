const liquibase = require("liquibase-wrapper");
const config = {
    changeLogFile: './liquibase/changelog.json',
    url: 'jdbc:postgresql://' + process.env.DB_CONTAINER_NAME + ':5432/' + process.env.DB_Name,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    classpath: "postgres/postgresql-42.2.18.jar"
}

liquibase(config).run("update")
    .then(() => console.log('success'))
    .catch((err) => {
        console.log("Failed to run Liquibase update: ", err);
    });