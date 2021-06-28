const {Worker} = require("worker_threads");
exports.runTestForCodingLesson = async function (codeLesson, userCode) {
    let testResults = {errors: []}
    if (codeContainsForbiddenContent(userCode)) {
        let workerPath = "";
        if (codeLesson.verificationtype === "JASMINE") {
            workerPath = "./worker/jasmineWorker.js"
        } else if (codeLesson.verificationtype === "SELF") {
            workerPath = "./worker/selfCheckingWorker.js"
        }
        if (workerPath !== "") {
            let worker = new Worker(workerPath, {
                workerData: {
                    userCode: userCode,
                    verificationCode: codeLesson.verificationcode
                }
            })
            let results = await runTextExecutionWorker(worker)
            return {errors: results}
        }
    }
    return testResults
}

function codeContainsForbiddenContent(code) {
    return !code.includes('require') && !code.includes('exec')
}

async function runTextExecutionWorker(worker) {
    return new Promise((resolve, reject) => {
        worker.on("message", result => {
            if (result instanceof Error) {
                result = [result.message]
            }
            console.log("finished sending results " + result)
            resolve(result)
        });
        worker.on("error", error => {
            console.log(error);
            reject(error);
        });

        worker.on("exit", exitCode => {
            if (exitCode !== 0) {
                //does go in exit when test results are not correct
                reject("error")
            } else {
                resolve();
            }
        })
    })

}