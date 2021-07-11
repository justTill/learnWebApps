<template>
  <div id="app">
    <navigation></navigation>
    <div class="viewArea">
      <router-view class="view"></router-view>
    </div>
  </div>
</template>

<script>

import Navigation from "@/components/navigation";

export default {
  name: 'app',
  components: {Navigation},
  computed: {},
  methods: {}
}
</script>

<style>
html, body {
  margin: 0;
  height: 100%;
  overflow: hidden
}

body, html {
  height: 100% !important;
}

.viewArea {
  height: 100%;
}

#app {
  background-color: #f7f3eb;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #2c3e50;
  height: 100%;
}

.hoverEffect {
  transition: box-shadow 200ms ease, transform 200ms ease;
  box-shadow: 2px 5px 5px rgba(0, 0, 0, 0.8);
}

.hoverEffect:hover {
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.8);
}
</style>
