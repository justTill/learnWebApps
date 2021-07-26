const userRepository = require("./persistence/UserRepository");
const genPassword = require("./utils/logIn").genPassword;
var crypto = require('crypto');

const saltHash = genPassword(process.env.ADMIN_PASSWORD);
const salt = saltHash.salt;
const hash = saltHash.hash;

userRepository.saveAdmin(process.env.ADMIN_NAME, hash, salt)
    .then(res => {
        process.exit(0)
    })
    .catch(err => {
        process.exit(1)
    })