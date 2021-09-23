<template>
  <div @click="activate" :style="buttonStyles">
    {{ preparedName }}
    <span v-if="isSolved" style="color: var(--dark-green)">&#x2713;</span>
  </div>
</template>
<script>
export default {
  name: "navButton",
  props: {
    onClickFunction: Function,
    name: String,
    chapter: Object,
    section: Object,
  },
  data: function () {
    return {
      isActive: false,
      isSolved: false
    }
  },
  computed: {
    preparedName() {
      let name = this.name
      if (this.isActive) {
        name += "  " + String.fromCharCode("0x2190")
      }
      if (this.chapter) {
        let numberOfSections = this.chapter.sections.length
        let numberOfSectionsSolved = 0
        for (let section of this.chapter.sections) {
          if (this.sectionSolved(section)) {
            numberOfSectionsSolved++
          }
        }
        this.isSolved = numberOfSectionsSolved === numberOfSections
      }
      if (this.section) {
        this.isSolved = this.sectionSolved(this.section)
      }
      return name;
    },
    buttonStyles() {
      return {
        color: this.isActive ? 'white' : "#e0e0e0",
      }
    }
  },
  methods: {
    sectionSolved(section) {
      let numberOfInteractiveLessons = 0
      let numberOfLessonsDone = 0;
      for (let lesson of section.lessons) {
        if (lesson.type !== 'information') {
          numberOfInteractiveLessons++
          if (lesson.done) numberOfLessonsDone++
        }
      }
      return numberOfInteractiveLessons === numberOfLessonsDone
    },
    activate() {
      this.onClickFunction()
      this.isActive = true;
    }
  }
}
</script>
<style>

</style>