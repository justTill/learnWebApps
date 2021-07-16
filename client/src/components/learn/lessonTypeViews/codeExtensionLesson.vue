<template>
  <div class="codeExtensionLessonContainer">
    <div class="codeExtensionText">
      <pre>
        <code v-html="preparedSanitizedUnfinishedCode">
        </code>
      </pre>
    </div>
    <div class="checkLesson" v-on:click="evaluate">Aufgabe Überprüfen</div>
    <div class="successMessage" v-if="successMessage"> {{ successMessage }}</div>
    <div class="errorMessage" v-if="errorMessage"> {{ errorMessage }}</div>
  </div>
</template>
<script>
import DOMPurify from 'dompurify';

export default {
  name: 'codeExtensionLesson',
  components: {},
  props: {
    lesson: Object,
    solvedHandler: Function,
  },
  data: function () {
    return {
      errorMessage: "",
      successMessage: "",
      inputs: [],
    }
  },
  computed: {
    preparedSanitizedUnfinishedCode() {
      let code = '\n' + this.lesson.unfinishedCode
      if (this.lesson.done || this.inputs.length !== 0) {
        let counter = 0;
        while (code.includes('[input]')) {
          let value = ""
          let style = "background-color: rgba(0, 255, 0, 0.1)"
          if (this.lesson.done) {
            value = this.lesson.answers[counter]
          } else if (this.inputs.length !== 0) {
            value = this.inputs[counter]
            if (value.replaceAll(" ", "") !== this.lesson.answers[counter].replaceAll(" ", "")) {
              style = "background-color: rgba(255, 0, 0, 0.1)"
            }
          }
          code = code.replace('[input]', '<input class="codeInput" type="text" value="' + value + '" style="' + style + '">')
          counter++
        }
      } else {
        code = code.replaceAll('[input]', '<input class="codeInput" type="text">')
      }

      let cleanCode = DOMPurify.sanitize(code)
      return cleanCode
    }
  },
  methods: {
    evaluate() {
      let elements = this.$el.querySelectorAll(".codeInput")
      let allAnswersCorrect = elements.length === this.lesson.answers.length;
      elements.forEach((element, index) => {
        if (this.lesson.answers[index].replaceAll(" ", "") !== element.value.replaceAll(" ", "")) {
          allAnswersCorrect = false;
          element.style.backgroundColor = "rgba(255, 0, 0, 0.1)"
        } else {
          element.style.backgroundColor = "rgba(0, 255, 0, 0.1)"
        }
        this.inputs.push(element.value)
      })
      if (allAnswersCorrect) {
        this.successMessage = "Richtig"
        this.errorMessage = ""
      } else {
        this.successMessage = ""
        this.errorMessage = "leider nicht ganz korrekt"
      }
      this.solvedHandler(this.lesson.lessonId, allAnswersCorrect)
    }
  }
}
</script>
<style>
.codeExtensionLessonContainer {
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.codeExtensionText > pre {
  display: flex;
  text-align: left;
  justify-content: left;
}

code {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>