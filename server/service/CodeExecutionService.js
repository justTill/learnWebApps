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
                    verificationCode: codeLesson.verificationcode,
                }
            })
            let terminateMessage = ""
            setTimeout(function () {
                terminateMessage = "Die Ausfrührung des Codes dauert länger als 1 Minute und wird daher abgebrochen"
                worker.terminate()
            }, 30000)
            testResults = await runTextExecutionWorker(worker)
                .then(res => {
                    return {errors: res}
                })
                .catch(err => {
                    if (terminateMessage) {
                        return {errors: [terminateMessage]}
                    } else {
                        throw err
                    }
                })
        }
    } else {
        testResults.errors.push(["Could not run Code for security reasons"])
    }
    return testResults
}

function codeContainsForbiddenContent(code) {
    return !code.includes('require')
        && !code.includes('exec')
        && !code.includes('import')
        && !code.includes('process')
        && !code.includes('process.env')
}

async function runTextExecutionWorker(worker) {
    return new Promise((resolve, reject) => {
        worker.on("message", result => {
            if (result instanceof Error) {
                result = [result.message]
            }
            resolve(result)
        });
        worker.on("error", error => {
            reject(error);
        });

        worker.on("exit", exitCode => {
            if (exitCode !== 0) {
                reject("error")
            } else {
                resolve();
            }
        })
    })

}