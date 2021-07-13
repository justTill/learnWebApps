<template>
  <div class="navigation">
    <span class="navLink">Logo</span>
    <router-link class="navLink" to="/home">Home</router-link>
    <router-link class="navLink" to="/learn">Lernen</router-link>
    <router-link class="navLink" to="/notes">Notes</router-link>
    <router-link class="navLink" to="/messages">Nachrichten</router-link>
  </div>
</template>

<script>

export default {
  name: 'navigation',
  components: {},
  computed: {},
  methods: {}
}
</script>

<style>

.navigation {
  background-color: white;
  padding-left: 50px;
  padding-top: 25px;
  padding-bottom: 25px;
}

.min-nav {
  display: none;
}

.navLink {
  margin: 10px;
  text-decoration: none;
  color: black;
}
</style>