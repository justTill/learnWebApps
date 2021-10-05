const {parentPort, workerData} = require("worker_threads");

(async function (workerData) {
    execTests(workerData.userCode, workerData.verificationCode)
        .then(r => {
            console.log(r)
            parentPort.postMessage(r)
        })
        .catch(e => {
            console.log(e)
            parentPort.postMessage(e)
        })
})(workerData);

async function execTests(userCode, verificationCode) {
    let AsyncFunction = Object.getPrototypeOf(async function () {
    }).constructor
    let messages = await AsyncFunction(`'use strict'; let codeFromUser=arguments[0]; let errorMessagesForUser = []; ${userCode} ${verificationCode} return errorMessagesForUser;`)(userCode)
    return messages;
}
