<template>
  <div class="navigation">
    <router-link class="navLink" to="/">
      <img class="navLogo" src="../../public/logo.svg"/>
    </router-link>
    <router-link class="navLink" to="/">Lernen</router-link>
    <router-link class="navLink" v-if="!user.isDefault" to="notes">Notizen</router-link>
    <router-link class="navLink" v-if="!user.isDefault" to="messages">Nachrichten</router-link>
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
  height: 80px;
}

.min-nav {
  display: none;
}

.navLink {
  margin: 10px;
  text-decoration: none;
  color: var(--dark-blue)
}

.navLogo {
  margin-left: 10px;
  margin-right: 10px;
  width: 80px;
  height: 80px;
}
</style>