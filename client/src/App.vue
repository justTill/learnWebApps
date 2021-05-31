<template>
  <div id="app">
    <p>Startseite</p>
    <router-link to="/about">Go to about</router-link>
    <router-link to="/test">Go to test</router-link>
    <router-link to="/hello">Go to Helloworld</router-link>
    <router-view class="view"></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {},
  computed: {},
  methods: {}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
