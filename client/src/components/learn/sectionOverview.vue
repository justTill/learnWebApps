<template>
  <div class="sectionOverviewContainer">
    <h1 class="title"> {{ section.sectionName }}</h1>
    <div class="textContainer">
      <div class="overviewText" v-html="section.information">
      </div>
    </div>
    <div class="lessons">
      <lesson-tile class="lesson hoverEffect"
                   v-for="lesson in section.lessons"
                   v-on:click.native="gotToLesson(lesson)"
                   :key="lesson.lessonNumber"
                   :lesson="lesson">
      </lesson-tile>
    </div>
  </div>
</template>

<script>

import LessonTile from "@/components/learn/lessonTile";

export default {
  name: 'sectionOverview',
  props: {
    section: Object,
    gotToLesson: Function
  },
  components: {LessonTile},
  computed: {},
  methods: {}
}
</script>
<style>
.title {
  text-align: center;
}

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
  background-color: white;
  border: 1px solid black;
}

.overviewText {
  display: block;
  min-width: 700px;
  max-width: 1300px;
  background-color: white;
  border: 1px solid black;
  border-radius: 2px;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>