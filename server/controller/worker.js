var Jasmine = require('jasmine');
var jasmine = new Jasmine();
const {parentPort, workerData} = require("worker_threads");

(async function (code) {
    execTests(code)
        .then(r => parentPort.postMessage(r))
        .catch(e => parentPort.postMessage(e))
})(workerData.userCode);

async function execTests(userCode) {
    describe("test", function () {
        it("sampleTest", function () {
            console.log("test was running")
            expect(false).toBe(true)
        })
    })
    let message = "";
    jasmine.env.addReporter({
        specDone: function (result) {
            console.log('Spec: ' + result.description + ' was ' + result.status);

            for (var i = 0; i < result.failedExpectations.length; i++) {
                message = 'Failure: ' + result.failedExpectations[i].message;
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
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
 console.log(process.env)
 */