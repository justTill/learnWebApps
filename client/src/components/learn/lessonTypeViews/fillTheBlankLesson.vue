<template>
  <div class="fillTheBlankLessonContainer">
    <br>
    <div class="fillTheBlankText" v-for="(element, index) in preparedFillTheBlankTest">
      <span v-html="element">}</span>
      <div v-if="index+1 !== preparedFillTheBlankTest.length" class="dropzone" :id="'drop-'+index"
           @drop="onDrop($event, index)" @dragenter.prevent
           @dragover.prevent>
      </div>
    </div>
    <div class="initialDropZone" id="initialDropZone" @drop="onDrop($event, -1)" @dragenter.prevent
         @dragover.prevent>
      <div class="possibleAnswers drag" v-for="option in prepareAnswerList" :id="'option-'+option.index"
           @dragstart="startDrag($event)" draggable="true">
        {{ option.answer }}
      </div>
    </div>
    <div class="checkLesson" v-on:click="evaluate">Aufgabe Überprüfen</div>
    <div class="successMessage" v-if="successMessage"> {{ successMessage }}</div>
    <div class="errorMessage" v-if="errorMessage"> {{ errorMessage }}</div>
  </div>
</template>
<script>
import DOMPurify from "dompurify";

export default {
  name: 'fillTheBlankLesson',
  props: {
    lesson: Object,
    solvedHandler: Function,
  },
  data: function () {
    return {
      errorMessage: "",
      successMessage: "",
      userHasSolvedLessonBefore: false,
    }
  },
  methods: {
    onDrop(event, dropzoneId) {
      if (dropzoneId !== -1) {
        let updatedAnswer = this.$el.querySelector("#" + event.dataTransfer.getData("Text"))
        let dropZoneEl = this.$el.querySelector("#drop-" + dropzoneId)
        if (dropZoneEl.hasChildNodes()) {
          let formerAnswer = dropZoneEl.childNodes[0]
          dropZoneEl.removeChild(formerAnswer)
          let answerOptionsDropzone = this.$el.querySelector("#initialDropZone")
          updatedAnswer.parentNode.removeChild(updatedAnswer)
          answerOptionsDropzone.appendChild(formerAnswer)
        }
        dropZoneEl.appendChild(updatedAnswer)
        dropZoneEl.style.backgroundColor = "#C2C9D6"
      } else {
        let updatedAnswer = this.$el.querySelector("#" + event.dataTransfer.getData("Text"))
        let answerOptionsDropzone = this.$el.querySelector("#initialDropZone")
        updatedAnswer.parentNode.removeChild(updatedAnswer)
        answerOptionsDropzone.appendChild(updatedAnswer)
      }
    },
    startDrag(event) {
      event.dataTransfer.setData('Text', event.target.id);
    },
    evaluate() {
      let isCorrect = true;
      let rightAnswers = this.lesson.answerOptions.filter(o => o.isCorrect)
      for (let i = 0; i < rightAnswers.length; i++) {
        let dropZone = this.$el.querySelector("#drop-" + i)
        if (dropZone.hasChildNodes()) {
          let answerStr = rightAnswers[i].possibleAnswer.replaceAll(" ", "")
          let dropzoneStr = dropZone.childNodes[0].innerText.replaceAll(" ", "")
          if (dropzoneStr !== answerStr) {
            isCorrect = false
            dropZone.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
          } else {
            dropZone.style.backgroundColor = "rgba(0, 255, 0, 0.3)";
          }
        } else {
          isCorrect = false
          dropZone.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
        }
      }
      if (isCorrect) {
        this.successMessage = "Richtig"
        this.errorMessage = ""
      } else {
        this.successMessage = ""
        this.errorMessage = "leider nicht ganz korrekt"
      }
      this.solvedHandler(this.lesson.lessonId, isCorrect)
    },
    pseudoShuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    }
  },
  computed: {
    preparedFillTheBlankTest() {
      let textWithBlanksText = DOMPurify.sanitize(this.lesson.textWithBlanks)
      return textWithBlanksText.split("[input]")
    },
    prepareAnswerList() {
      let answerList = []
      this.lesson.answerOptions.forEach((a, i) => {
        answerList.push({
          answer: a.possibleAnswer,
          index: i
        })
      })
      if (this.lesson.done) {
        this.userHasSolvedLessonBefore = true
        //return only false answers
      }
      return this.pseudoShuffle(answerList)
    },
  },
}
</script>
<style>
.fillTheBlankLessonContainer {
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
}

.fillTheBlankText {
  display: inline-flex;
  align-items: center;
}

.initialDropZone {
  border: 1px solid black;
  border-radius: 5px;
  min-height: 60px;
  margin: 20px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.initialDropZone div {
  flex: 1 0 15%;
}

.dropzone {
  display: inline-block;
  margin: 3px;
  padding: 3px;
  min-height: 20px;
  min-width: 70px;
  background-color: #C2C9D6;
  border-radius: 10px;
}

.drag {
  justify-content: center;
  margin-left: auto;
  align-items: center;
  margin-right: auto;
  display: inline-flex;
  text-align: center;
}

.drag:hover {
  cursor: pointer;
}

code {
  background-color: lightgray;
  padding: 3px;
}

</style>