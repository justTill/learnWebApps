const userRepository = require("./persistence/UserRepository");
const genPassword = require("./utils/logIn").genPassword;
const prompt = require('prompt-sync')({sigint: true});

const name = prompt('Please enter admin name: ');
let pw = prompt('Please enter an password: ', {echo: ''});
let pw2 = prompt('Please enter the password again: ', {echo: ''});

while (pw !== pw2) {
    console.log("Passwords are not the same")
    pw = prompt('Please enter an password: ', {echo: ''});
    pw2 = prompt('Please enter the password again: ', {echo: ''});

}
const saltHash = genPassword(pw);
const salt = saltHash.salt;
const hash = saltHash.hash;

userRepository.saveAdmin(name, hash, salt)
    .then(res => {
        console.log("Admin created")
        process.exit(0)
    })
    .catch(err => {
        console.log("Failed to create Admin please try again")
        process.exit(1)
    })