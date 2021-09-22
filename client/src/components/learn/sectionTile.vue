<template>
  <div>
    <div class="sectionTitle">{{ this.section.sectionName }}</div>
    <div class="sectionInformation">
      {{ sectionPreview }}
    </div>
    <div class="percentageBar"
         v-if="!user.isDefault && percentage.numberOfLessons !== 0 ">
      <progress :value="lessonsSolved" :max="numberOfLessons">
      </progress>
      <span> {{ lessonsSolved }}/{{ numberOfLessons }}</span>
    </div>
  </div>
</template>

<script>

import {mapGetters} from "vuex";

export default {
  name: 'sectionTile',
  props: {
    section: Object
  },
  components: {},
  computed: {
    ...mapGetters([
      'user',
      'difficultyLevel'
    ]),
    numberOfLessons() {
      return this.percentage().numberOfLessons
    },
    lessonsSolved() {
      return this.percentage().lessonsSolved
    },
    sectionPreview: function () {
      let updatedInformation = this.section.information
      if (this.section.information.length > 50) {
        updatedInformation = updatedInformation.substring(0, 50) + " ..."
      }
      return updatedInformation
    },
  },
  methods: {
    percentage: function () {
      let numberOfInteractiveLessons = 0
      let numberOfLessonsDone = 0;
      for (let lesson of this.section.lessons) {
        if (lesson.type !== 'information' && (this.difficultyLevel === "ALL" || this.difficultyLevel === lesson.difficultyLevel)) {
          numberOfInteractiveLessons++
          if (lesson.done) numberOfLessonsDone++
        }
      }
      return {numberOfLessons: numberOfInteractiveLessons, lessonsSolved: numberOfLessonsDone}
    },
  }
}
</script>
<style>
.sectionTitle {
  text-align: center;
  font-size: large;
  font-weight: bold;
  padding: 2px;
}

.percentageBar {
  position: absolute;
  bottom: 10px;
  margin-left: 20px;
}

.sectionInformation {
  margin: 5px 20px 10px;
}
</style>