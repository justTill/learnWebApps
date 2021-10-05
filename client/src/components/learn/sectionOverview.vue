<template>
  <div class="sectionOverviewContainer">
    <title-header :title="section.sectionName" :lesson="null">
    </title-header>
    <div class="overviewArrangement">
      <div class="navigateToChapterOrSection hoverEffect" v-if="hasPrevSection">
        <img src="../../assets/skip-prev.svg" width="30px" height="30px" v-b-tooltip.hover.lefttop
             title="zum vorherigen Unterthema" v-on:click="prevSection">
      </div>
      <div class="contentOverview">
        <div class="textContainer">
          <div class="overviewText" v-html="sanitizedSectionInformation">
          </div>
        </div>
        <div class="lessons">
          <lesson-tile class="lesson hoverEffect"
                       v-for="lesson in lessonsForSelectedDifficultyLevel"
                       v-on:click.native="goToLesson(lesson)"
                       :key="lesson.lessonNumber"
                       :lesson="lesson">
          </lesson-tile>
        </div>
      </div>
      <div class="navigateToChapterOrSection hoverEffect" v-if="hasNextSection">
        <img src="../../assets/skip-next.svg" width="30px" height="30px" v-b-tooltip.hover.lefttop
             title="zum nächsten Unterthema" v-on:click="nextSection">
      </div>
    </div>
  </div>
</template>

<script>

import LessonTile from "@/components/learn/lessonTile";
import TitleHeader from "@/components/learn/titleHeader";
import DOMPurify from "dompurify";
import {mapGetters} from "vuex";
import utils from "@/shared/utils";

export default {
  name: 'sectionOverview',
  props: {
    section: Object,
    goToLesson: Function,
    goToSection: Function,
    chapter: Object
  },
  components: {TitleHeader, LessonTile},
  computed: {
    ...mapGetters([
      'difficultyLevel',
    ]),
    sanitizedSectionInformation() {
      return DOMPurify.sanitize(this.section.information)
    },
    lessonsForSelectedDifficultyLevel() {
      return utils.lessonsForDifficulty.bind(this)(this.section)
    },
    hasPrevSection() {
      let index = this.chapter.sections.indexOf(this.section)
      return this.chapter.sections[index - 1]
    },
    hasNextSection() {
      let index = this.chapter.sections.indexOf(this.section)
      return this.chapter.sections[index + 1]
    }
  },
  methods: {
    nextSection() {
      this.goToSection(this.chapter.sections[this.chapter.sections.indexOf(this.section) + 1])
    },
    prevSection() {
      this.goToSection(this.chapter.sections[this.chapter.sections.indexOf(this.section) - 1])
    }
  }
}
</script>
<style>
@import "../../assets/cssVariables.css";

.textContainer {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.sectionOverviewContainer {
  display: flex;
  align-content: center;
  flex-direction: column;
  margin-right: auto;
  margin-left: auto;
  overflow: scroll;
}

.overviewText img {
  max-width: 600px;
  max-height: 600px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  padding-top: 20px;
  padding-bottom: 20px;
}

.lessons {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  flex-wrap: wrap;
}

.lessons:hover {
  cursor: pointer;
}

.lesson {
  position: relative;
  margin: 10px;
  display: block;
  min-height: 150px;
  max-height: 150px;
  min-width: 400px;
  width: 100px;
  background-color: var(--white);
  border: 1px solid black;
}

.overviewText {
  display: block;
  min-width: 550px;
  max-width: 1300px;
  background-color: var(--white);
  border: 1px solid black;
  border-radius: 2px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>