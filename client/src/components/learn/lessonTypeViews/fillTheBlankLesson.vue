<template>
  <div class="fillTheBlankLessonContainer">
    <br>
    <div class="fillTheBlankTextContainer">
      <div class="fillTheBlankText" v-for="(element, index) in preparedFillTheBlankTest">
        <span v-html="element"></span>
        <div v-if="index+1 !== preparedFillTheBlankTest.length" class="dropzone" :id="'drop-'+index"
             @drop="onDrop($event, index)" @dragenter.prevent
             @dragover.prevent>
          <div v-if="userAnswer.length !== 0 && userAnswer[index]" :id="'option-'+userAnswer[index].index"
               @dragstart="startDrag($event)" draggable="true" class="possibleAnswers drag">
            {{ userAnswer[index].answer }}
          </div>
        </div>
      </div>
    </div>
    <div class="initialDropZone" id="initialDropZone" @drop="onDrop($event, -1)" @dragenter.prevent
         @dragover.prevent>
      <div class="possibleAnswers drag" v-for="option in answerOptions" :id="'option-'+option.index"
           @dragstart="startDrag($event)" draggable="true">
        {{ option.answer }}
      </div>
    </div>
    <div class="checkLesson" v-on:click="evaluate">Aufgabe Überprüfen</div>
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
      userAnswer: this.getUserAnswers(),
      answerOptions: this.getAnswersOptions()
    }
  },
  methods: {
    getUserAnswers() {
      let answers = [];
      if (this.lesson.done) {
        this.lesson.answerOptions.forEach((option, index) => {
          if (option.isCorrect) {
            answers.push({
              answer: option.possibleAnswer,
              index: index,
            })
          }
        })
      }
      return answers;
    },
    getAnswersOptions() {
      let answerOptions = []
      this.lesson.answerOptions.forEach((option, index) => {
        if (this.lesson.done) {
          if (!option.isCorrect) {
            answerOptions.push({
              answer: option.possibleAnswer,
              index: index,
            })
          }
        } else {
          answerOptions.push({
            answer: option.possibleAnswer,
            index: index,
          })
        }
      })
      return answerOptions
    },
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
        let indexOfNonCommentChildNodes = this.hasChildrenAndNonCommentOnes(dropZone)
        if (indexOfNonCommentChildNodes !== -1) {
          let answerStr = rightAnswers[i].possibleAnswer.replaceAll(" ", "")
          let dropzoneStr = dropZone.childNodes[indexOfNonCommentChildNodes].innerText.replaceAll(" ", "")
          if (dropzoneStr !== answerStr) {
            isCorrect = false
            dropZone.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
          } else {
            console.log("dropzoneId " + i + " set Color Green")
            dropZone.style.backgroundColor = "rgba(0, 255, 0, 0.1)";
          }
        } else {
          isCorrect = false
          dropZone.style.backgroundColor = "rgba(255, 0, 0, 0.2)";
        }
      }
      if (isCorrect) {
        this.errorMessage = ""
      } else {
        this.errorMessage = "leider nicht ganz korrekt"
      }
      this.solvedHandler(this.lesson.lessonId, isCorrect, null)
    },
    hasChildrenAndNonCommentOnes(zone) {
      let index = -1
      if (zone.hasChildNodes()) {
        zone.childNodes.forEach((el, i) => {
          if (el.nodeName !== '#comment') {
            index = i
          }
        })
      }
      return index
    }
  },
  computed: {
    preparedFillTheBlankTest() {
      let textWithBlanksText = DOMPurify.sanitize(this.lesson.textWithBlanks)
      console.log(textWithBlanksText.split("[input]"))
      textWithBlanksText = textWithBlanksText.replaceAll("\n", "<br>")
      textWithBlanksText = textWithBlanksText.replaceAll(" ", "&nbsp;")
      return textWithBlanksText.split("[input]")
    },
  },
}
</script>
<style>
@import "../../../assets/cssVariables.css";

.fillTheBlankLessonContainer {
  display: inline-flex;
  flex-direction: column;
}

.fillTheBlankTextContainer {
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.fillTheBlankText {
  display: inline;
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

.dropzone {
  display: inline;
  margin: 3px;
  padding-left: 15px;
  padding-right: 15px;
  /*padding: 3px;*/
  min-width: 70px;
  background-color: var(--davys-grey-light);
  border-radius: 10px;
}

.possibleAnswers {
  margin: 5px 15px;
  border-color: var(--davys-grey-light);
  border: 1px solid;
  padding: 2px;
  border-radius: 5px;
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
  background-color: var(--davys-grey-light);
  padding: 3px;
}

</style>