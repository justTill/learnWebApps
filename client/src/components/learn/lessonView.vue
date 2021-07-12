<template>
  <div class="lessonContainer">
    <div class="title">
      <h1>{{ lesson.lessonName }}
        <span class="doneIcon" v-if="lesson.done && lesson.type !== 'information'">&#10003;</span></h1>
    </div>
    <div class="lessonTextContainer">
      <div class="lessonText">
        <div v-html="lessonText"></div>
        <div class="lessonButtons">
          <div class="prevButton" v-if="previousLesson" v-on:click="goToLesson(previousLesson)"> &#8592; Vorherige
            Lerneinheit
          </div>
          <div class="nextButton" v-if="nextLesson" v-on:click="goToLesson(nextLesson)"> Nächste Lerneinheit &#8594;
          </div>
        </div>
      </div>
      <coding-lesson v-if="lesson.type==='codingLesson'" :lesson="lesson"></coding-lesson>
      <code-extension-lesson v-if="lesson.type==='codeExtensionLesson'" :lesson="lesson"></code-extension-lesson>
      <fill-the-blank-lesson v-if="lesson.type==='fillTheBlankLesson'" :lesson="lesson"></fill-the-blank-lesson>
      <single-multiple-choice-lesson v-if="lesson.type==='singleMultipleChoiceLesson'"
                                     :lesson="lesson"></single-multiple-choice-lesson>
    </div>
  </div>
</template>

<script>
import CodingLesson from "@/components/learn/lessonTypeViews/codingLesson";
import SingleMultipleChoiceLesson from "@/components/learn/lessonTypeViews/singleMultipleChoiceLesson";
import CodeExtensionLesson from "@/components/learn/lessonTypeViews/codeExtensionLesson";
import FillTheBlankLesson from "@/components/learn/lessonTypeViews/fillTheBlankLesson";

export default {
  name: 'lessonView',
  components: {FillTheBlankLesson, CodeExtensionLesson, SingleMultipleChoiceLesson, CodingLesson},
  props: {
    lesson: Object,
    previousLesson: Object,
    nextLesson: Object,
    goToLesson: Function,
  },
  computed: {
    lessonText: function () {
      let information = this.lesson.information
      return information;
    }
  }
}
</script>

<style>
.doneIcon {
  color: green;
}

.lessonTextContainer {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: lightgray;
  border-radius: 10px;
  padding-right: 10px;
  padding-left: 10px;
}


.lessonContainer {
  display: block;
  padding: 10px;
  width: 100%;
}

.lessonText {
  display: block;
  max-width: 700px;
  background-color: white;
  border: 1px solid black;
  border-radius: 2px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  margin-right: 20px;
  min-height: 30vh;
  max-height: 70vh;
  overflow: auto;
  min-width: 400px;
}

.nextButton:hover, .prevButton:hover {
  cursor: pointer;
}

.lessonButtons {
  display: block;
  position: relative;
  height: 50px;
  bottom: 1px;
}

.nextButton {
  padding: 10px;
  display: inline-block;
  right: 0px;
  color: green;
  position: absolute;
}

.prevButton {
  padding: 10px;
  display: inline-block;
  position: absolute;
  color: green;
}

@media only screen and (max-width: 1000px) {
  .lessonTextContainer {
    flex-direction: column;

  }
}

</style>