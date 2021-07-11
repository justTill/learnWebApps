<template>
  <div @click="activate" :style="buttonStyles">
    {{ name }}
  </div>
</template>
<script>
export default {
  name: "navButton",
  props: {
    onClickFunction: Function,
    name: String
  },
  data: function () {
    return {
      isActive: false,
    }
  },
  computed: {
    buttonStyles() {
      return {
        color: this.isActive ? 'white' : "#e0e0e0",
      }
    }
  },
  methods: {
    activate() {
      this.onClickFunction()
      this.isActive = true;
    }
  }
}
</script>
<style>

</style>