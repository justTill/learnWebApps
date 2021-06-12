var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var pg = require('pg');
var session = require('express-session');
var pgSession = require('express-pg-session')(session);
var app = express();
var bodyParser = require("body-parser");
var port = 3080;
var DbConnector = require('./persistence/DbConnector');
var pgPool = DbConnector.getDBConnectionPool()
var passport = require('passport');
var crypto = require('crypto');
var LocalStrategy = require('passport-local').Strategy;
var UserRepository = require('./persistence/UserRepository')
//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * This function is called when the `passport.authenticate()` method is called.
 *
 * If a user is found an validated, a callback is called (`cb(null, user)`) with the user
 * object.  The user object is then serialized with `passport.serializeUser()` and added to the
 * `req.session.passport` object.
 */
passport.use(new LocalStrategy(
    function (email, password, cb) {
        UserRepository.findAdminByEmail(email)
            .then((rows) => {

                if (!rows) {
                    return cb(null, false)
                }
                // Function defined at bottom of app.js
                let isValid = false;
                if (rows[0]) {
                    isValid = validPassword(password, rows[0].hash, rows[0].salt);
                }

                if (isValid) {
                    return cb(null, rows[0]);
                } else {
                    return cb(null, false);
                }
            })
            .catch((err) => {
                cb(err);
            });
    }));

passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    UserRepository.findAdminById(id).then(row => {
        cb(null, row[0]);
    }).catch(err => console.log(err))
});


app.use(session({
    store: new pgSession({
        pool: pgPool,
        tableName: 'sessions'
    }),
    secret: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 30 * 24 * 60 * 60 * 1000} // 30 days
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/api/', apiRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}
module.exports = app;
