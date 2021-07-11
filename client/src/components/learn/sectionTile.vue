<template>
  <div>
    <div class="title sectionTitle">{{ this.section.sectionName }}</div>
    <div class="sectionInformation">
      {{ sectionPreview }}
    </div>
    <div class="percentageBar"
         v-if="!user.isDefault && percentage.lessonsSolved !== 0 && percentage.numberOfLessons !== 0 ">
      <progress :value="percentage.lessonsSolved" :max="percentage.numberOfLessons">
      </progress>
      <span> {{ percentage.lessonsSolved }}/{{ percentage.numberOfLessons }}</span>
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
      'user'
    ]),
    percentage: function () {
      let numberOfInteractiveLessons = 0
      let numberOfLessonsDone = 0;
      for (let lesson of this.section.lessons) {
        if (lesson.type !== 'information') {
          numberOfInteractiveLessons++
          if (lesson.done) numberOfLessonsDone++
        }
      }
      return {numberOfLessons: numberOfInteractiveLessons, lessonsSolved: numberOfLessonsDone}
    },
    sectionPreview: function () {
      let updatedInformation = this.section.information
      if (this.section.information.length > 100) {
        updatedInformation = updatedInformation.substring(0, 100) + " ..."
      }
      return updatedInformation
    },
  },
  methods: {}
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