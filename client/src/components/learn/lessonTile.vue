<template>
  <div>
    <div class="title lessonTitle">{{ this.lesson.lessonName }} <span class="doneIcon"
                                                                      v-if="lesson.done && lesson.type !== 'information'">&#10003;</span>
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
    lesson: Object
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
}

.lessonInformation {
  margin: 5px 20px 10px;
}
</style>