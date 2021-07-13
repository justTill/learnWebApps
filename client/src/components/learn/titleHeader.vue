<template>
  <div class="title">
    <h1> {{ title }}
      <span class="doneIcon" v-if="lesson && lesson.type !== 'information'">&#10003;</span>
    </h1>
    <div v-if="lesson" class="helperButtons">
      <div class="helpButton" v-on:click="help">Help</div>
      <div class="reportButton" v-on:click="report"> Report</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'titleHeader',
  props: {
    title: String,
    lesson: Object
  },
  methods: {
    help() {
      console.log('help')
    },
    report() {
      console.log('report')
    }
  }
}
</script>
<style>
.doneIcon {
  color: green;
}

.title > h1 {
  display: inline-block;
}

.title {
  height: 80px;
  position: relative;
  text-align: center;
  background-color: white;
  margin-bottom: 10px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

.helperButtons {
  position: absolute;
  right: 30px;
  height: 80px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.helpButton, .reportButton {
  width: 40px;
  height: 80px;
  align-items: center;
  display: inline-flex;
  margin: 10px;
}

.helperButtons:hover {
  cursor: pointer;
}

</style>