var crypto = require('crypto');
var ltiRepository = require("../persistence/LTIRepository")
var fs = require('fs');

exports.handleLTIRegistration = async function (req, res, next) {
    let consumerKey = req.body.consumerKey
    if (consumerKey && consumerKey.length <= 100) {
        let keyExist = await ltiRepository.consumerKeyExist(consumerKey)
        if (!keyExist) {
            let secretKey = crypto.randomBytes(48).toString('hex')
            ltiRepository.insert(consumerKey, secretKey)
                .then(result => {
                    res.status(200).attachment("credentials.json").send("{" +
                        "secretKey:" + secretKey +
                        "consumerKey:" + consumerKey +
                        "}")
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