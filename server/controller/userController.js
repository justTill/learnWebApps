var passport = require('passport');
var crypto = require('crypto');
var UserRepository = require("../persistence/UserRepository")

exports.authenticate = passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect: '/'
}), (err, req, res, next) => {
    if (err) next(err);
};

exports.registerUser = function (req, res, next) {

    const saltHash = genPassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    UserRepository.saveAdmin(req.body.email, hash, salt).then(res => console.log(res))

    res.redirect('/');

}
exports.logout = function (req, res, next) {
    req.logout();
    res.redirect('/');
}

function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

    return {
        salt: salt,
        hash: genHash
    };
}