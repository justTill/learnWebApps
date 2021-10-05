<template>
  <div class="navigation">
    <router-link class="navLink" to="/">
      <img class="navLogo" src="../../public/logo.svg"/>
    </router-link>
    <router-link class="navLink" to="/">Lernen</router-link>
    <router-link class="navLink" v-if="!user.isDefault" to="notes"> Meine Notizen</router-link>
    <router-link class="navLink" v-if="!user.isDefault" to="messages">
      <span class="notification">
        Gemeldete Probleme
        <img v-if="updatedProblems" src="../assets/new-message.svg" class="newMessage">
      </span>
    </router-link>
  </div>
</template>

<script>

import {mapGetters} from "vuex";

export default {
  name: 'navigation',
  components: {},
  computed: {
    ...mapGetters([
      'user',
      'updatedProblems'
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

.notification {
  text-decoration: none;
  position: relative;
  display: inline-block;
}

.newMessage {
  right: -30px;
  top: -20px;
  padding: 3px 5px;
  position: absolute;
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