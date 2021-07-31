const {parentPort, workerData} = require("worker_threads");

(async function (workerData) {
    execTests(workerData.userCode, workerData.verificationCode)
        .then(r => {
            parentPort.postMessage(r)
        })
        .catch(e => {
            parentPort.postMessage(e)
        })
})(workerData);

async function execTests(userCode, verificationCode) {
    var AsyncFunction = Object.getPrototypeOf(async function () {
    }).constructor
    let messages = await AsyncFunction(`'use strict'; let messages = []; let userCode=' ${userCode}'; ${userCode} ${verificationCode} return messages`)()
    return messages;
}
