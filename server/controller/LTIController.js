var crypto = require('crypto');
var ltiRepository = require("../persistence/LTIRepository")
var userRepository = require("../persistence/UserRepository")
var lti = require("ims-lti")

exports.handleLTIRegistration = async function (req, res, next) {
    let consumerKey = req.body.consumerKey
    if (consumerKey && consumerKey.length <= 100) {
        let keyExist = await ltiRepository.consumerKeyExist(consumerKey)
        if (!keyExist) {
            let secretKey = crypto.randomBytes(48).toString('hex')
            ltiRepository.insert(consumerKey, secretKey)
                .then(result => {
                    res.status(200).attachment("credentials.json").send({
                        secretKey: secretKey,
                        consumerKey: consumerKey
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.render('LTI/registration', {
                        error: "Could not save Secret and ConsumerKey please try again later"
                    })
                })
        } else {
            res.render('LTI/registration', {
                error: "ConsumerKey is already in use please choose another one",
            })
        }
    } else {
        res.render('LTI/registration', {
            error: "ConsumerKey missing. Or ConsumerKey is longer than 100 chars"
        })
    }
}

let getSecretsForConsumer = async function (consumerKey, cb) {
    let consumer = await ltiRepository.findByConsumerKey(consumerKey)
    if (consumer.length !== 0) {
        return consumer[0].secretkey
    }
    let err = new Error(`Unknown consumer ${consumerKey}`);
    err.status = 403;

    return cb(err);
}

exports.handleLTILaunch = async function (req, res, next) {
    if (!req.body) {
        let err = new Error('Expected a body');
        err.status = 400;
        return next(err);
    }
    const consumerKey = req.body.oauth_consumer_key;
    if (!consumerKey) {
        let err = new Error('Expected a consumer');
        err.status = 422;
        return next(err);
    }
    let consumerSecret = await getSecretsForConsumer(consumerKey, (err) => {
        if (err) return next(err)
    })
    const provider = new lti.Provider(consumerKey, consumerSecret, lti.HMAC_SHA1);
    provider.valid_request(req, (err, isValid) => {
        if (err) {
            return next(err);
        }
        if (isValid) {
            req.session.regenerate(err => {
                if (err) next(err);
                req.session.email = provider.body.lis_person_contact_email_primary;
                req.session.userId = provider.userId;
                req.session.userName = provider.username;
                req.session.givenName = provider.body.lis_person_name_given;
                req.session.ltiConsumer = provider.body.tool_consumer_instance_guid;
                req.session.consumer_key = provider.consumer_key;
                req.session.consumer_secret = provider.consumer_secret;
                req.session.service_url = provider.outcome_service.service_url;
                req.session.source_did = provider.outcome_service.source_did;
                userRepository.findUserByMoodleIdAndMoodleName(provider.userId, provider.username)
                    .then(result => {
                        if (result.length === 0) {
                            userRepository.createPerson(req.session.userId, req.session.userName)
                                .then()
                                .catch(err => console.log(err))
                        }
                    }).catch(err => console.log(err))
                res.cookie('connect.sid', req.sessionID, {
                    maxAge: req.session.cookie.maxAge,
                })
                res.cookie('learnAppUsersGivenName', provider.body.lis_person_name_given, {
                    maxAge: req.session.cookie.maxAge,
                })
                return res.redirect(301, 'http://learnwebappsapp.westeurope.azurecontainer.io/');
            });
        } else {
            return next(err);
        }
    });
}

exports.updateGrade = function (req, normedGrade) {
    try {
        let options = {
            consumer_key: req.session.consumer_key,
            consumer_secret: req.session.consumer_secret,
            service_url: req.session.service_url,
            source_did: req.session.source_did,
        };
        let outcomeService = new lti.OutcomeService(options)
        outcomeService.send_replace_result(normedGrade, function (err, result) {
            console.log(`Replace result ${result}`);
            console.log(err)
        })
    } catch (e) {
        console.log(e)
    }
}