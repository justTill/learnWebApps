<template>
  <div id="app">
    <p>Startseite</p>
    <p>{{ username }}</p>
    <p>{{ userID }}</p>
    <router-link to="/">Startseite</router-link>
    <router-link to="/about">Go to about</router-link>
    <router-link :to="{ name: 'test', params: {name: username, id: userID } }">Go to test</router-link>
    <router-link to="/hello">Go to Helloworld</router-link>
    <router-view class="view"></router-view>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {},
  computed: {
    username() {
      //in Store speichern!!!
      return this.$route.query.name
    },
    userID() {
      return this.$route.query.userId
    }
  },
  methods: {
    test: async function () {
      const res = await fetch('/api/v1');
      console.log(res);
    }
  }
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
