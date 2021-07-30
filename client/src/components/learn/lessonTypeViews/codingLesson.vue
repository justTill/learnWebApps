<template>
  <div class="codingLessonContainer">
    <codemirror ref="codeMirror"
                :value="userCode"
                :options="cmOptions"
                @input="onCodeChange">
    </codemirror>
    <div class="verificationInformation"> {{ lesson.verificationInformation }}</div>
    <div class="checkLesson" v-on:click="evaluate">Aufgabe Überprüfen</div>
    <div class="successMessage" v-if="successMessage"> {{ successMessage }}</div>
    <div class="errorMessage" v-for="error in errorMessages" :key="error">
      {{ error }}
    </div>
  </div>
</template>
<script>
import {codemirror} from 'vue-codemirror'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/theme/darcula.css'
import 'codemirror/theme/duotone-light.css'
import {mapGetters} from "vuex";
import {backEndHost, backEndPort} from "@/envVariables";

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
      successMessage: "",
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
              this.successMessage = isCorrect ? this.lesson.feedback : ""
              this.solvedHandler(this.lesson.lessonId, isCorrect, this.userCode)
            })
            .catch(err => {
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
.codingLessonContainer {
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 2px;
  border: 1px solid black;
  background-color: white;
  min-width: 300px;

}

.verificationInformation {
  background-color: white;
  border-radius: 2px;
  border: 1px solid black;
  padding: 10px;
}

.checkLesson {
  text-align: center;
}

.successMessage {
  text-align: center;
}

</style>