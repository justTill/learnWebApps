<template>
  <div>
    <div class="lessonTitle">
      <img v-if="lesson.type ==='information'" src="../../assets/info.png" style="padding-bottom: 5px"
           v-b-tooltip.hover.lefttop title="Informationseinheit">
      <img v-else src="../../assets/lessons.png" style="padding-bottom: 5px" v-b-tooltip.hover.lefttop title="Aufgabe">
      {{ lesson.lessonName }}
      <span class="doneIcon" v-if="lesson.done && lesson.type !== 'information'">&#10003;</span>
    </div>
    <div class="lessonInformation">
      {{ lessonPreview }}
    </div>
  </div>
</template>
<script>

import {mapGetters} from "vuex";

export default {
  name: 'lessonTile',
  props: {
    lesson: Object,
    helpText: String
  },
  components: {},
  computed: {
    ...mapGetters([
      'user'
    ]),
    lessonPreview: function () {
      let updatedInformation = this.lesson.information
      if (this.lesson.information.length > 100) {
        updatedInformation = updatedInformation.substring(0, 100) + " ..."
      }
      return updatedInformation
    },
  },
  methods: {},
}
</script>
<style>
.lessonTitle {
  text-align: center;
  font-size: large;
  font-weight: bold;
  padding: 2px;
  margin: 10px;

}

.lessonInformation {
  margin: 5px 20px 10px;
}
</style>