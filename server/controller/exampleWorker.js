const {Worker} = require("worker_threads");
const userRepository = require("../persistence/UserRepository");

exports.firstFunc = function (req, res, next) {
    createAndRunTestExecuterWorker()
        .then(e => res.send(e))
        .catch(e => res.send(e))
}

async function createAndRunTestExecuterWorker() {
    return new Promise((resolve, reject) => {
        let worker = new Worker("./controller/worker.js", {workerData: {code: "let be =3"}})
        worker.on("message", result => {
            console.log("finished senden results" + result)
            resolve(result)
        });
        worker.on("error", error => {
            console.log(error);
            reject(error);
        });

        worker.on("exit", exitCode => {
            console.log(exitCode)
            if (exitCode !== 0) {
                //does go in exit when test results are not correct
                reject("error")
            } else {
                resolve();
            }
        })
    })

}

/**For future reference if inline worker
 * var blob = new Blob([
 "onmessage = function(e) { postMessage('msg from worker'); }"]);

 // Obtain a blob URL reference to our worker 'file'.
 var blobURL = window.URL.createObjectURL(blob);

 var worker = new Worker(blobURL);
 worker.onmessage = function(e) {
  // e.data == 'msg from worker'
};
 worker.postMessage(); // Start the worker.*/