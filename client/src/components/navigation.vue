<template>
  <div class="navigation">
    <span class="navLink">Logo</span>
    <router-link class="navLink" to="/learn">Lernen</router-link>
    <router-link class="navLink" v-if="!user.isDefault" to="/notes">Notes</router-link>
    <router-link class="navLink" v-if="!user.isDefault" to="/messages">Nachrichten</router-link>
  </div>
</template>

<script>

import {mapGetters} from "vuex";

export default {
  name: 'navigation',
  components: {},
  computed: {
    ...mapGetters([
      'user'
    ]),
  },
  methods: {}
}
</script>

<style>
@import "../assets/cssVariables.css";

.navigation {
  background-color: var(--white);
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
  color: var(--dark-blue)
}
</style>