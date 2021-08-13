<template>
  <div class="codingLessonContainer">
    <codemirror ref="codeMirror"
                :value="userCode"
                :options="cmOptions"
                @input="onCodeChange">
    </codemirror>
    <button class="checkLesson" v-on:click="evaluate" :disabled="isLoadingResults">Aufgabe Überprüfen
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
    evaluate() {
      this.errorMessages = [];
      if (this.userCode) {
        let payload = {
          lessonId: this.lesson.lessonId,
          userCode: this.userCode,
        }
        if (!this.user.isDefault) {
          payload.moodleId = this.user.userId
          payload.moodleName = this.user.userName
        }
        this.isLoadingResults = true

        this.$http.post("http://" + backEndHost + ":" + backEndPort + "/api/v1/lessons/lesson/coding/check", payload)
            .then(response => {
              let testErrors = response.data.errors
              let isCorrect = testErrors.length === 0;
              this.errorMessages = testErrors
              this.isLoadingResults = false
              this.solvedHandler(this.lesson.lessonId, isCorrect, this.userCode)
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