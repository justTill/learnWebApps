const {parentPort, workerData} = require("worker_threads");
var global = this;

/* Could possibly create some helper functions here so they are always available when executing code in chat?*/

/* Most extra functions could be possibly unsafe */

var wl = {
    "self": 1,
    "onmessage": 1,
    "postMessage": 1,
    "global": 1,
    "wl": 1,
    "eval": 1,
    "Array": 1,
    "Boolean": 1,
    "Date": 1,
    "Function": 1,
    "Number": 1,
    "Object": 1,
    "RegExp": 1,
    "String": 1,
    "Error": 1,
    "EvalError": 1,
    "RangeError": 1,
    "ReferenceError": 1,
    "SyntaxError": 1,
    "TypeError": 1,
    "URIError": 1,
    "decodeURI": 1,
    "decodeURIComponent": 1,
    "encodeURI": 1,
    "encodeURIComponent": 1,
    "isFinite": 1,
    "isNaN": 1,
    "parseFloat": 1,
    "parseInt": 1,
    "Infinity": 1,
    "JSON": 1,
    "Math": 1,
    "NaN": 1,
    "undefined": 1,
    "constructor": 1,
    "__defineGetter__": 1,
    "__defineSetter__": 1,
    "__lookupGetter__": 1,
    "__lookupSetter__": 1,
    "isPrototypeOf": 1,
    "propertyIsEnumerable": 1,
    "toString": 1,
    "valueOf": 1,
    "toLocaleString": 1,
};

Object.getOwnPropertyNames(global).forEach(function (prop) {
    if (!wl.hasOwnProperty(prop)) {
        Object.defineProperty(global, prop, {
            get: function () {
                throw "Security Exception: cannot access " + prop;
                return 1;
            },
            configurable: false
        });
    }
});

Object.getOwnPropertyNames(global.__proto__).forEach(function (prop) {
    if (!wl.hasOwnProperty(prop) && prop !== "hasOwnProperty" && prop !== "__proto__") {
        Object.defineProperty(global.__proto__, prop, {
            get: function () {
                console.log("get denied " + prop)
                throw "Security Exception: cannot access " + prop;
                return 1;
            },
            configurable: false
        });
    }
});

Object.defineProperty(Array.prototype, "join", {

    writable: false,
    configurable: false,
    enumerable: false,

    value: function (old) {
        return function (arg) {
            if (this.length > 500 || (arg && arg.length > 500)) {
                //throw "Exception: too many items";
            }

            return old.apply(this, arguments);
        };
    }(Array.prototype.join)

});


(function () {
    var cvalues = [];

    var console = {
        log: function () {
            cvalues = cvalues.concat([].slice.call(arguments));
        }
    };
    console.log("here")
    let code = "'halllo'.toString()"
    console.log("here")
    var result;
    try {
        result = eval('"use strict";\n' + code);
        console.log(result)
        parentPort.postMessage(result);
    } catch (e) {
        parentPort.postMessage(e.toString());
        return;
    }

})();