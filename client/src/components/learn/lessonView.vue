<template>
  <div class="lessonContainer">
    <title-header :title="prepareLessonTitle" :lesson="lesson">
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
          <div class="prevButton"
               v-on:click="previousLesson?goToLesson(previousLesson): goToLessonOverview(null)"> &#8592;
            {{ prevLessonText }}
          </div>
          <div class="nextButton"
               v-on:click="nextLesson?goToLesson(nextLesson): goToLessonOverview(null)">
            {{ nextLessonText }} &#8594;
          </div>
        </div>
      </div>
      <coding-lesson v-if="lesson.type==='codingLesson'" :lesson="lesson" :solvedHandler="solvedLesson"
                     :theme="codeMirrorTheme"></coding-lesson>
    </div>
  </div>
</template>

<script>
import CodingLesson from "@/components/learn/lessonTypeViews/codingLesson";
import SingleMultipleChoiceLesson from "@/components/learn/lessonTypeViews/singleMultipleChoiceLesson";
import CodeExtensionLesson from "@/components/learn/lessonTypeViews/codeExtensionLesson";
import FillTheBlankLesson from "@/components/learn/lessonTypeViews/fillTheBlankLesson";
import {backEndUrl} from '@/envVariables'
import {mapGetters} from "vuex";
import TitleHeader from "@/components/learn/titleHeader";
import DOMPurify from "dompurify";

export default {
  name: 'lessonView',
  components: {
    TitleHeader, FillTheBlankLesson, CodeExtensionLesson, SingleMultipleChoiceLesson, CodingLesson
  },
  props: {
    lesson: Object,
    previousLesson: Object,
    currentLessonIndex: Number,
    numberOfLessons: Number,
    nextLesson: Object,
    goToLesson: Function,
    goToLessonOverview: Function,
    lessonSolvedHandler: Function,
  },
  data: function () {
    return {
    }
  },
  computed: {
    nextLessonText() {
      if (this.nextLesson) {
        if (this.nextLesson.type === "information") {
          return "Zur nächsten Informationseinheit"
        }
        return "Zur nächsten Aufgabe"
      }
      return "Zur Übersicht"
    },
    prevLessonText() {
      if (this.previousLesson) {
        if (this.previousLesson.type === "information") {
          return "Zur vorherigen Informationseinheit"
        }
        return "Zur vorherigen Aufgabe"
      }
      return "Zur Übersicht"
    },
    prepareLessonTitle() {
      return this.lesson.lessonName + " (" + (this.currentLessonIndex + 1) + "/" + this.numberOfLessons + ")"
    },
    sanitizedLessonText: function () {
      return DOMPurify.sanitize(this.lesson.information);
    },
    ...mapGetters([
      'user',
      'ltiKey',
      'codeMirrorTheme'
    ]),
  },
  methods: {
    solvedLesson(lessonId, isSolved, userCode) {
      this.lessonSolvedHandler(lessonId, isSolved, userCode)
      if (isSolved && !this.user.isDefault) {
        this.$http.post(backEndUrl + "/api/v1/lessons/lesson/solved" + "/?ltik=" + this.ltiKey, {
          lessonId: lessonId,
          userCode: userCode
        }, {
          withCredentials: true
        }).then(response => {

        }).catch(err => {
          let errorMessage = "Es ist ein unerwarteter Fehler aufgetreten. Es konnte leider nicht permanent gespeichert werden, das die Aufgabe gelöst wurde"
          this.$store.commit('setErrorMessage', errorMessage)
        })
      }
    }
  }
}
</script>

<style>
@import "../../assets/cssVariables.css";

.lessonTextContainer {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
  background-color: var(--light-gray);
  border-radius: 10px;
  padding-right: 10px;
  padding-left: 10px;
}


.lessonContainer {
  display: block;
  width: 100%;
}

.lessonText {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  max-width: 900px;
  background-color: white;
  border: 1px solid black;
  border-radius: 2px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  margin-right: 20px;
  margin-left: 20px;
  min-height: 30vh;
  max-height: 70vh;
  overflow: auto;
  min-width: 400px;
}

@media only screen and (max-width: 1000px) {
  .lessonText {
    margin-right: auto;
    margin-left: auto;
  }
}

.nextButton:hover, .prevButton:hover {
  cursor: pointer;
}

.lessonButtons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 50px;
  bottom: 1px;
}

.nextButton {
  padding: 10px;
  display: inline-block;
  color: var(--dark-green);
}

.prevButton {
  padding: 10px;
  display: inline-block;
  color: var(--dark-green);
}

code {
  color: var(--dark-blue) !important;
}
@media only screen and (max-width: 1000px) {
  .lessonTextContainer {
    flex-direction: column;
  }
}

</style>