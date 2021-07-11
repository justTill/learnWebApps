<template>
  <div class="navigation">
    <span class="nav-link">Logo</span>
    <router-link class="nav-link" to="/home">Home</router-link>
    <router-link class="nav-link" to="/learn">Lernen</router-link>
    <router-link class="nav-link" to="/notes">Notes</router-link>
    <router-link class="nav-link" to="/messages">Nachrichten</router-link>
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

.nav-link {
  margin: 10px;
  text-decoration: none;
  color: black;
}
</style>