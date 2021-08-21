var crypto = require('crypto');
var ltiRepository = require("../persistence/LTIRepository")
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

const secrets = {
    demo: '123456789',
    demo2: '123456789'
};
const nonceStore = new lti.Stores.MemoryStore();

const getSecret = (consumerKey, callback) => {
    const secret = consumerKey = secrets.demo;
    if (secret) {
        return callback(null, secret);
    }

    let err = new Error(`Unknown consumer ${consumerKey}`);
    err.status = 403;

    return callback(err);
};

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
    const provider = new lti.Provider(consumerKey, consumerSecret, nonceStore, lti.HMAC_SHA1);
    provider.valid_request(req, (err, isValid) => {
        if (err) {
            return next(err);
        }
        if (isValid) {
            req.session.regenerate(err => {
                if (err) next(err);
                //does not work since moodle is localhost and localhost in docker is different
                //provider.outcome_service.send_replace_result(1, (err, isValid) => console.log(err))
                req.session.email = provider.body.lis_person_contact_email_primary;
                req.session.contextId = provider.context_id;
                req.session.userId = provider.userId;
                req.session.username = provider.username;
                req.session.ltiConsumer = provider.body.tool_consumer_instance_guid;
                req.session.isTutor = provider.instructor === true;
                req.session.context_id = provider.context_id;

                return res.redirect(301, 'http://localhost:8080');
            });
        } else {
            return next(err);
        }
    });
}