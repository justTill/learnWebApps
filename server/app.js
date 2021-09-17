var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var chapterRouter = require('./routes/chapter');
var apiRouter = require('./routes/api');
var sectionRouter = require('./routes/section');
var lessonRouter = require('./routes/lesson');
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
const cors = require('cors');
const ltis = require('ltijs').Provider
const Database = require('ltijs-sequelize')
var LocalStrategy = require('passport-local').Strategy;
var UserRepository = require('./persistence/UserRepository')


const db = new Database(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD,
    {
        host: process.env.SQL_HOST,
        dialect: 'postgres',
        logging: false
    })
// Setup provider
ltis.setup(process.env.SESSION_KEY, // Key used to sign cookies and tokens
    {
        plugin: db // Passing db object to plugin field
    },
    { // Options
        appRoute: '/learn', loginRoute: '/login', // Optionally, specify some of the reserved routes
        cookies: {
            secure: true, // Set secure to true if the testing platform is in a different domain and https is being used
            sameSite: 'None' // Set sameSite to 'None' if the testing platform is in a different domain and https is being used
        },
        devMode: false, // Set DevMode to true if the testing platform is in a different domain and https is not being used
        dynReg: {
            url: 'http://localhost:3080/learn', // Tool Provider URL. Required field.
            name: 'Tool Provider', // Tool Provider name. Required field.
            description: 'Tool Description', // Tool Provider description.
            redirectUris: ['http://localhost:3080/launch'], // Additional redirection URLs. The main URL is added by default.
            customParameters: {}, // Custom parameters.
            autoActivate: true // Whether or not dynamically registered Platforms should be automatically activated. Defaults to false.
        }
    }
)
//view engine setup
ltis.app.set('views', path.join(__dirname, 'views'));
ltis.app.set('view engine', 'jade');

ltis.app.use(logger('dev'));
ltis.app.use(express.json());
ltis.app.use(express.urlencoded({extended: false}));
ltis.app.use(cookieParser());
ltis.app.use(bodyParser.json());
ltis.app.use(express.static(path.join(__dirname, 'public')));
ltis.app.use(
    cors({
        origin: (origin, callback) => callback(null, true), // you can control it based on condition.
        credentials: true, // if using cookie sessions.
    })
);
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

ltis.app.use(session({
    store: new pgSession({
        pool: pgPool,
        tableName: 'sessions'
    }),
    secret: process.env.SESSION_KEY,
    resave: true,
    saveUninitialized: false,
    cookie: {maxAge: 24 * 60 * 60 * 1000, secure: false}, // 1 day
}));

ltis.app.use(passport.initialize());
ltis.app.use(passport.session());
ltis.app.use('/', indexRouter);
ltis.app.use('/', chapterRouter);
ltis.app.use('/', sectionRouter);
ltis.app.use('/', lessonRouter);
ltis.app.use('/api/v1/', apiRouter);

// catch 404 and forward to error handler
ltis.app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
ltis.app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

ltis.whitelist(new RegExp(/^\/api\/v1\//))
ltis.whitelist({route: '/', method: 'get'})
ltis.whitelist({route: '/overview', method: 'get'},
    {route: '/notifications', method: 'get'},
    {route: '/logout', method: 'get'},
    {route: '/manual', method: 'get'},
    {route: '/loginAdmin', method: 'post'},
    {route: '/deleteProblem', method: 'post'},
    {route: '/markAsRead', method: 'post'},
    {route: '/saveAnswerOnProblem', method: 'post'})

ltis.whitelist({route: new RegExp(/^\/section/), method: 'get'})
ltis.whitelist({route: new RegExp(/^\/deleteSection/), method: 'get'})
ltis.whitelist({route: '/saveEditedSection', method: 'post'}, {route: '/saveNewSection', method: 'post'})

ltis.whitelist({route: new RegExp(/^\/chapter/), method: 'get'})
ltis.whitelist({route: new RegExp(/^\/deleteChapter/), method: 'get'})
ltis.whitelist({route: '/editChapter', method: 'post'},
    {route: '/saveNewChapter', method: 'post'},
    {route: '/uploadChapterMedia', method: 'post'})

ltis.whitelist({route: new RegExp(/^\/deleteLesson/), method: 'get'})
ltis.whitelist({route: new RegExp(/\bedit\S+Lesson\b/), method: 'get'})
ltis.whitelist({route: new RegExp(/\bsaveCreate\S+Lesson\b/), method: 'post'})
ltis.whitelist({route: new RegExp(/\bsaveEdit\S+Lesson\b/), method: 'post'})


ltis.onConnect((token, req, res) => {
    if (token) {
        let userId = token.user
        let userName = token.userInfo.name
        if (userId && userName) {
            UserRepository.findUserByMoodleIdAndMoodleName(userId, userName)
                .then(result => {
                    if (result.length === 0) {
                        UserRepository.createPerson(userId, userName)
                            .then()
                            .catch(err => console.log(err))
                    }
                }).catch(err => console.log(err))
        }
    }
    ltis.redirect(res, 'http://localhost:8080')
})
ltis.onDynamicRegistration(async (req, res, next) => {
    try {
        if (!req.query.openid_configuration) return res.status(400).send({
            status: 400,
            error: 'Bad Request',
            details: {message: 'Missing parameter: "openid_configuration".'}
        })
        const message = await ltis.DynamicRegistration.register(req.query.openid_configuration, req.query.registration_token)
        res.setHeader('Content-type', 'text/html')
        res.send(message)
    } catch (err) {
        if (err.message === 'PLATFORM_ALREADY_REGISTERED') return res.status(403).send({
            status: 403,
            error: 'Forbidden',
            details: {message: 'Platform already registered.'}
        })
        return res.status(500).send({status: 500, error: 'Internal Server Error', details: {message: err.message}})
    }
});
ltis.deploy({port: 3080})

function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

module.exports = ltis.app;
