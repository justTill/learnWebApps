<template>
  <div class="singleMultipleChoiceLessonContainer">
    <div class="answerOptions" v-for="(option, index) in lesson.answerOptions">
      <input type="checkbox" :id="'option-'+index" :ref="'option-'+index" :value="option.possibleAnswer"
             v-model="checkedAnswers"
             :checked="lesson.done && option.isCorrect">
      <label :for="'option-'+index">{{ option.possibleAnswer }}</label>
    </div>
    <div class="checkLesson" v-on:click="evaluate">Aufgabe Überprüfen</div>
    <div class="successMessage" v-if="successMessage"> {{ successMessage }}</div>
    <div class="errorMessage" v-if="errorMessage"> {{ errorMessage }}</div>
  </div>
</template>
<script>
export default {
  name: 'singleMultipleChoiceLesson',
  props: {
    lesson: Object,
    solvedHandler: Function
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
      } else {
        this.successMessage = ""
        this.errorMessage = "Die Antwort ist leider nicht korrekt"
      }
      this.solvedHandler(this.lesson.lessonId, isCorrect)
    }
  }
}
</script>
<style>
.singleMultipleChoiceLessonContainer {
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.checkLesson:hover, .answerOptions:hover {
  cursor: pointer;
}

.errorMessage {
  height: 60px;
  background-color: #f2ebdc;
  padding-top: 25px;
  margin-top: 10px;
  margin-bottom: 10px;
  border-top: 2px solid red;
  border-bottom: 2px solid red;
}

.answerOptions {
  padding-bottom: 10px;
}

label {
  display: inline-block;
  margin: 10px;
  padding: 10px;
  border-radius: 10px;
  width: 90%;
  background-color: lightgray;
}

label:hover {
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.8);
}

input[type=checkbox]:checked + label {
  transition: box-shadow 200ms ease, transform 200ms ease;
  box-shadow: 2px 5px 5px rgba(0, 0, 0, 0.8);
}

.checkLesson {
  display: inline-block;
  background-color: #1a152d;
  padding: 10px;
  color: white;
}
</style>
