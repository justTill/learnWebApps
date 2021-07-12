<template>
  <div class="SingleMultipleChoiceLessonContainer">
    <div class="AnswerOptions" v-for="option in lesson.answerOptions">
      <input type="checkbox" :value="option.possibleAnswer" v-model="checkedAnswers"
             :checked="lesson.done && option.isCorrect">{{ option.possibleAnswer }}
    </div>
    <div class="errorMessage" v-if="errorMessage"> {{ errorMessage }}</div>
    <button v-on:click="evaluate">Aufgabe Überprüfen</button>
    <div class="successMessage" v-if="successMessage"> {{ successMessage }}</div>
  </div>
</template>
<script>
export default {
  name: 'singleMultipleChoiceLesson',
  props: {
    lesson: Object
  },
  data: function () {
    return {
      checkedAnswers: [],
      errorMessage: "",
      successMessage: "",
    }
  },
  methods: {
    evaluate() {
      let isCorrect = true;
      let correctAnswers = []
      for (let option of this.lesson.answerOptions) {
        if (option.isCorrect) {
          correctAnswers.push(option.possibleAnswer)
        }
      }
      if (correctAnswers.length === this.checkedAnswers.length) {
        for (let answer of correctAnswers) {
          if (this.checkedAnswers.indexOf(answer) === -1) {
            isCorrect = false;
          }
        }
      } else {
        isCorrect = false;
      }
      if (isCorrect) {
        this.errorMessage = "";
        this.successMessage = this.lesson.feedback
        //store set Done
        //make API Call
      } else {
        this.successMessage = ""
        this.errorMessage = "Die Antwort ist leider nicht korrekt"
      }
    }
  }
}
</script>
<style>

</style>
