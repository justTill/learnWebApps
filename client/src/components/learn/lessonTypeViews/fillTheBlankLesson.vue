<template>
  <div class="fillTheBlankLessonContainer">
    <div class="fillTheBlankText">
      hier ist der text mit den Lücken
      <div class="dropzone" @drop="onDrop($event, 1)" @dragenter.prevent @dragover.prevent></div>
      hiert ist noch eine
      <div class="dropzone" @drop="onDrop($event, 2)" @dragenter.prevent @dragover.prevent></div>
    </div>
    <div class="possibleAnswers">
      <div class="drag-el" id="#option-1" @dragstart="startDrag($event, 1)" draggable="true">
        Hallo
      </div>
      <div class="drag-el" id="#option-3" @dragstart="startDrag($event, 2)" draggable="true">
        Hallo 2
      </div>
      <div class="drag-el" id="#option-2" @dragstart="startDrag($event, 2)" draggable="true">
        Hallo 3
      </div>
    </div>
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
      usersAnswers: [],
      answerList: []
    }
  },
  methods: {
    onDrop(event, dropzoneId) {
      console.log("drop" + dropzoneId)
      console.log(event.dataTransfer.getData("Text"))
    },
    startDrag(event, answerOptionId) {
      this.$el.querySelector('#option-' + answerOptionId)
      event.dataTransfer.setData('Text', event.target.id);
      console.log(event.target.id)

    }
  },
  computed: {
    sanitizedAndPreparedTextWithBlanks() {
      let preparedText = this.lesson.textWithBlanks //answerOptions
      if (this.lesson.done) {

      } else {

      }
      return DOMPurify.sanitize(preparedText)
    }
  },
}
</script>
<style>
.dropzone {
  display: inline;
  margin: 5px;
  padding: 5px;
  min-height: 10px;
  min-width: 30px;
  background-color: red;
}
</style>