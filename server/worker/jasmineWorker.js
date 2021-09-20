var Jasmine = require('jasmine');
var jasmine = new Jasmine();
const {parentPort, workerData} = require("worker_threads");

(async function (workerData) {
    execTests(workerData.userCode, workerData.verificationCode)
        .then(r => parentPort.postMessage(r))
        .catch(e => parentPort.postMessage(e))
})(workerData);

async function execTests(userCode, verificationCode) {
    let AsyncFunction = Object.getPrototypeOf(async function () {
    }).constructor
    describe("Test Code From User", function () {
        it("Run", async function () {
            await AsyncFunction(`'use strict'; let codeFromUser=arguments[0]; ${userCode} ${verificationCode}`)(userCode)
        })
    })
    let message = [];
    jasmine.env.addReporter({
        specDone: function (result) {
            console.log('Spec: ' + result.description + ' was ' + result.status);
            for (var i = 0; i < result.failedExpectations.length; i++) {
                message.push('Failure: ' + result.failedExpectations[i].message);
                console.log(result.failedExpectations[i].stack);
            }
            console.log(result.passedExpectations.length);
        },
    })
    await jasmine.execute()
    return message;
}

/*** jasmine and in worker is not SAVE!!
 * const {exec} = require("child_process");

 exec("ls -la", (error, stdout, stderr) => {
                if (error) {
                    console.log(${error.message});
                }
                if (stderr) {
                    console.log(${stderr});
                    return;
                }
                console.log(${stdout});
            });
 console.log(process.env)
 */