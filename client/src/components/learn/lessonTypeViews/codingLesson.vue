<template>
  <div class="codingLessonContainer">
    <codemirror ref="codeMirror"
                :value="userCode"
                :options="cmOptions"
                @input="onCodeChange">
    </codemirror>
    <div ref="test" id="test">

    </div>
    <button class="checkLesson" v-on:click="evaluate2" :disabled="isLoadingResults">Aufgabe Überprüfen
      <div class="loader" v-if="isLoadingResults"></div>
    </button>
    <div class="errorMessage" v-for="error in errorMessages" :key="error">
      {{ error }}
    </div>
    <div class="verificationInformation" v-html="sanitizedVerificationInformation"></div>
  </div>
</template>
<script>
import {codemirror} from 'vue-codemirror'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/theme/darcula.css'
import 'codemirror/theme/duotone-light.css'
import {mapGetters} from "vuex";
import {backEndHost, backEndPort} from "@/envVariables";
import DOMPurify from "dompurify";
import 'mocha';

var Chai = require('chai');
var Test = Mocha.Test;
var expect = Chai.expect;

export default {
  name: 'codingLesson',
  components: {codemirror},
  props: {
    theme: String,
    lesson: Object,
    solvedHandler: Function,
  },
  data: function () {
    return {
      userCode: this.lesson.userCode,
      isLoadingResults: false,
      errorMessages: [],
      cmOptions: this.codeMirrorOptions(),
    }
  },
  computed: {
    ...mapGetters([
      'user',
    ]),
    sanitizedVerificationInformation() {
      return DOMPurify.sanitize(this.lesson.verificationInformation);
    },
    codemirror() {
      return this.$refs.codeMirror.codemirror
    },
  },
  methods: {
    createSandboxedStatements(args) {
      const code = args.code || "";
      const parameters = args.parameters || []

      let sandboxFrame = document.createElement("iframe")
      this.$el.querySelector("#test").appendChild(sandboxFrame)
      sandboxFrame.src = "data:text/html;";
      sandboxFrame.sanbox = "allow-scripts allow-same-origin";
      sandboxFrame.style.display = "none";

      let sandboxFunction = new sandboxFrame.contentWindow.Function(
          ...parameters,
          "'use strict';" + code
      )
      setTimeout(() => {
        sandboxFrame.remove()
        sandboxFrame = null;
      }, 10000)
      return sandboxFunction
    },
    evaluate2() {
      let mocha = new Mocha({
        reporterOptions: {
          toConsole: false,
        },
        reporter: 'json',
        isWorker: true,
        timeout: 3000,
        bail: false,
      });
      var suiteInstance = Mocha.Suite.create(mocha.suite, 'Test Suite');

      suiteInstance.addTest(new Test('testing tests', function () {
        expect(2).to.equal(2); // note testing 1 === 2 should fail
        expect(1).to.equal(2); // note testing 1 === 2 should fail
      }))
      /*mocha.run().on("test end", (test) => {
        console.log(test)
        return test
      })*/
      let isOddNumber = this.createSandboxedStatements({
        code:
            "require('mocha');\n" +
            "var Chai = require('chai');\n" +
            "var Test = Mocha.Test;\n" +
            "var expect = Chai.expect; " +
            "let mocha = new Mocha({\n" +
            "        reporterOptions: {\n" +
            "          toConsole: false,\n" +
            "        },\n" +
            "        isWorker: true,\n" +
            "        timeout: 3000," +
            "reporter: 'json',\n" +
            "        bail: false," +
            "      });" +
            "var suiteInstance = Mocha.Suite.create(mocha.suite, 'Test Suite');" +
            "suiteInstance.addTest(new Test('testing tests', function(){\n" +
            "setTimeout(() => console.log('gallo'),5000);" +
            "        expect(1).to.equal(2); // note testing 1 === 2 should fail\n" +
            "      }));" +
            "mocha.run().on(\"test end\", (test) => {\n" +
            "        console.log(test)\n" +
            "        return test\n" +
            "      });",
        parameters: ['number']
      })
      console.log(isOddNumber(3))
      /*let mocha = new Mocha({
        reporterOptions: {
          toConsole: false,
        },
        isWorker: true,
        timeout: 3000,
      })
      //mocha.run();
      this.$worker.run((arg1, arg2) => {
        arg2.run()
        return `this.$worker run 2: ${arg1} ${arg2}`
      }, ['Another', mocha])
          .then(console.log) // logs 'this.$worker run 2: Another function in other thread'
          .catch(console.error)
      this.$worker.run(function (args) {
        eval(args)
        return "gallo"
      }, [this.userCode])

      const actions = [
        {
          message: "self", func: (args) => {
            (async function () {
              eval(args)
              console.log("require('exec')" + args, args)
              return "mein return";

            })().then(res => {
              return res
            })
          }
        }]
      let worker = this.$worker.create(actions)
      worker.postMessage("self", [this.userCode])
          .then(res => console.log(res))
          .catch(err => console.log(err))*/
    },
    evaluate() {
      this.errorMessages = [];
      if (this.userCode) {
        let payload = {
          lessonId: this.lesson.lessonId,
          userCode: this.userCode,
        }
        this.isLoadingResults = true

        this.$http.post("http://" + backEndHost + ":" + backEndPort + "/api/v1/lessons/lesson/coding/check", payload)
            .then(response => {
              let testErrors = response.data.errors
              let isCorrect = testErrors.length === 0;
              this.errorMessages = testErrors
              this.isLoadingResults = false
              this.solvedHandler(this.lesson.lessonId, isCorrect, this.userCode)
            }, {
              withCredentials: true
            })
            .catch(err => {
              this.isLoadingResults = false

              let errorMessage = "Es ist ein unerwarteter Fehler aufgetreten. Aufgabe konnte nicht überprüft werden, bitte versuchen sie es Später erneut."
              this.$store.commit('setErrorMessage', errorMessage)
            })
      } else {
        this.errorMessages.push("Leere Code kann nicht abgeschickt werden")
      }
    },
    onCodeChange(cm) {
      this.userCode = cm
    },
    codeMirrorOptions() {
      return {
        tabSize: 4,
        mode: 'text/javascript',
        theme: this.theme === "DARK" ? "darcula" : "duotone-light",
        lineNumbers: true,
        line: true,
      }
    },
  },
}
</script>
<style>
@import "../../../assets/cssVariables.css";

.codingLessonContainer {
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 2px;
  border: 1px solid black;
  background-color: var(--white);
  min-width: 300px;
  margin-bottom: 10px;
  margin-right: 20px;

}

.verificationInformation {
  background-color: var(--white);
  border-radius: 2px;
  border: 1px solid black;
  padding: 10px;
}

.checkLesson {
  border: none;
  text-align: center;
}

.loader {
  display: inline-block;
  float: right;
  border: 3px solid var(--white); /* Light grey */
  border-top: 3px solid black; /* Blue */
  border-radius: 50%;
  width: 25px;
  height: 25px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>