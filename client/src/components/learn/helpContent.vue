<template>
  <div class="solutionContainer">
    <div class="checkLesson showSolution" ref="showSolutionButton" v-on:click="showSolution"> Lösung anzeigen</div>
    <div class="solution" :id="'solution-'+lesson.type" v-if="lesson.type ===  'codingLesson'">
      <pre>
        <code>
          {{ "\n" + this.lesson.exampleSolution }}
        </code>
      </pre>
    </div>
    <div class="solution" :id="'solution-'+lesson.type" v-else-if="lesson.type ===  'codeExtensionLesson'"
         v-html="prepareAndSanitizeCodeExtensionSolution">
    </div>
    <div class="solution" :id="'solution-'+lesson.type" v-else-if="lesson.type ===  'fillTheBlankLesson'"
         v-html="prepareAndSanitizeFillTheBlankSolution">
    </div>
    <div class="solution" :id="'solution-'+lesson.type" v-else-if="lesson.type ===  'singleMultipleChoiceLesson'">
      <div v-for="answer in getCorrectFtbOrSmcAnswers()" class="answerOptions">
        <label>{{ answer.possibleAnswer }}</label>
      </div>
    </div>
  </div>
</template>
<script>
import DOMPurify from "dompurify";

export default {
  name: 'helpContent',
  props: {
    lesson: Object,
  },
  data: function () {
    return {
      solutionShown: false
    }
  },
  methods: {
    showSolution() {
      if (!this.solutionShown) {
        this.solutionShown = true;
        this.$refs['showSolutionButton'].innerText = "Lösung ausblenden"
        this.$el.querySelector('#solution-' + this.lesson.type).style.display = "block";
      } else {
        this.solutionShown = false;
        this.$refs['showSolutionButton'].innerText = "Lösung anzeigen"
        this.$el.querySelector('#solution-' + this.lesson.type).style.display = "none";
      }
    },
    getCorrectFtbOrSmcAnswers() {
      return this.lesson.answerOptions.filter((a) => a.isCorrect)
    },
  },
  computed: {
    prepareAndSanitizeCodeExtensionSolution() {
      let code = '\n' + this.lesson.unfinishedCode
      let counter = 0;
      while (code.includes('[input]')) {
        let inputValue = this.lesson.answers[counter]
        let readOnlyInput = '<input class="codeInput" type="Text" value="' + inputValue + '" readonly style="background-color:rgba(0, 255, 0, 0.1) ">'
        code = code.replace('[input]', readOnlyInput)
        counter++
      }
      code = "<pre><code>" + code + "</code></pre>"
      let cleanCode = DOMPurify.sanitize(code)
      return cleanCode
    },
    prepareAndSanitizeFillTheBlankSolution() {
      let text = this.lesson.textWithBlanks
      let answers = this.getCorrectFtbOrSmcAnswers();
      let counter = 0;
      while (text.includes('[input]')) {
        let answerValue = answers[counter].possibleAnswer
        let divValue = '<div class="dropzone" style="background-color: rgba(0, 255, 0, 0.3)">' + '<div class="possibleAnswers drag">' + answerValue + '</div></div>'
        text = text.replace('[input]', divValue)
        counter++
      }
      let sanitizedText = DOMPurify.sanitize(text)
      return sanitizedText
    },
  },
}
</script>
<style>
.solutionContainer {

}

.showSolution {
  text-align: center;
  margin: 10px;
  display: block !important;
}

.showSolution:hover {
  cursor: pointer;
}

.solution {
  display: none;
}
</style>