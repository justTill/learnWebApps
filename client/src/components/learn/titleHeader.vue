<template>
  <div class="title">
    <h1> {{ title }}
      <span class="doneIcon" v-if="lesson && lesson.type !== 'information'">&#10003;</span>
    </h1>
  </div>
</template>
<script>
export default {
  name: 'titleHeader',
  props: {
    title: String,
    lesson: Object
  }
}
</script>
<style>
.doneIcon {
  color: green;
}

.title {
  text-align: center;
}

.title {
  text-align: center;
  background-color: white;
  margin-bottom: 10px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

</style>