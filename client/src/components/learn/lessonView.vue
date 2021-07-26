<template>
  <div class="lessonContainer">
    <title-header :title="lesson.lessonName" :lesson="lesson">
    </title-header>
    <div class="lessonTextContainer">
      <div class="lessonText">
        <div v-html="sanitizedLessonText"></div>
        <single-multiple-choice-lesson v-if="lesson.type==='singleMultipleChoiceLesson'"
                                       :lesson="lesson"
                                       :solvedHandler="solvedLesson"></single-multiple-choice-lesson>
        <code-extension-lesson v-if="lesson.type==='codeExtensionLesson'" :lesson="lesson"
                               :solvedHandler="solvedLesson"></code-extension-lesson>
      <fill-the-blank-lesson v-if="lesson.type==='fillTheBlankLesson'" :lesson="lesson"
                             :solvedHandler="solvedLesson"></fill-the-blank-lesson>
        <div class="lessonButtons">
          <div class="prevButton" v-if="previousLesson" v-on:click="goToLesson(previousLesson)"> &#8592; Vorherige
            Lerneinheit
          </div>
          <div class="nextButton" v-if="nextLesson" v-on:click="goToLesson(nextLesson)"> Nächste Lerneinheit &#8594;
          </div>
        </div>
      </div>
      <coding-lesson v-if="lesson.type==='codingLesson'" :lesson="lesson" :solvedHandler="solvedLesson"></coding-lesson>
    </div>
    <lesson-solved :feedback="lesson.feedback" v-if="lessonSolved"></lesson-solved>
  </div>
</template>

<script>
import CodingLesson from "@/components/learn/lessonTypeViews/codingLesson";
import SingleMultipleChoiceLesson from "@/components/learn/lessonTypeViews/singleMultipleChoiceLesson";
import CodeExtensionLesson from "@/components/learn/lessonTypeViews/codeExtensionLesson";
import FillTheBlankLesson from "@/components/learn/lessonTypeViews/fillTheBlankLesson";
import {backEndHost, backEndPort} from '@/envVariables'
import {mapGetters} from "vuex";
import TitleHeader from "@/components/learn/titleHeader";
import DOMPurify from "dompurify";
import LessonSolved from "@/components/learn/lessonSolved";

export default {
  name: 'lessonView',
  components: {
    LessonSolved,
    TitleHeader, FillTheBlankLesson, CodeExtensionLesson, SingleMultipleChoiceLesson, CodingLesson
  },
  props: {
    lesson: Object,
    previousLesson: Object,
    nextLesson: Object,
    goToLesson: Function,
    lessonSolvedHandler: Function,
  },
  data: function () {
    return {
      lessonSolved: false,
    }
  },
  computed: {
    sanitizedLessonText: function () {
      return DOMPurify.sanitize(this.lesson.information);
    },
    ...mapGetters([
      'user'
    ]),
  },
  methods: {
    solvedLesson(lessonId, isSolved, userCode) {
      this.lessonSolvedHandler(lessonId, isSolved, userCode)
      this.lessonSolved = isSolved
      if (isSolved) {
        this.$http.post("http://" + backEndHost + ":" + backEndPort + "/api/v1/lessons/lesson/solved", {
          lessonId: lessonId,
          moodleId: this.user.userId,
          moodleName: this.user.userName,
          userCode: userCode
        }).then(response => {

        }).catch(err => {
        })
      }
    }
  }
}
</script>

<style>

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