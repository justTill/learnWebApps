<template>
  <div id="app">
    <error-pop-up v-if="isErrorMessage !== ''" :errorMessage="isErrorMessage"></error-pop-up>
    <navigation></navigation>
    <div class="viewArea">
      <router-view class="view"></router-view>
    </div>
  </div>
</template>

<script>

import Navigation from "@/components/navigation";
import {mapGetters} from "vuex";
import ErrorPopUp from "@/components/utils/errorPopUp";

export default {
  name: 'app',
  components: {ErrorPopUp, Navigation},
  computed: {
    ...mapGetters([
      'errorMessage',
    ]),
    isErrorMessage() {
      return this.errorMessage
    }
  },
  methods: {}
}
</script>

<style>
@import "assets/cssVariables.css";
html {
  background-color: var(--beige);
}

html, body {
  margin: 0;
  height: 100%;
}

body, html {
  height: 100% !important;
}

@media only screen and (min-width: 1000px) {
  body, html {
    overflow: hidden;
  }
}

.viewArea {
  height: 100%;
}

#app {
  background-color: var(--beige);
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: var(--dark-blue);
  height: 100%;
  word-wrap: break-word;
}

pre {
  overflow: hidden;
}

code {
  overflow: hidden;
}

.hoverEffect {
  transition: box-shadow 200ms ease, transform 200ms ease;
  box-shadow: 2px 5px 5px rgba(0, 0, 0, 0.8);
}

.hoverEffect:hover {
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.8);
}
</style>
