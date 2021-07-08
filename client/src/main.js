import Vue from 'vue'
import App from './App.vue'
import {router} from '@/./routes/routes'
import {store} from '@/stores/store.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {backEndHost, backEndPort} from './envVariables'

Vue.use(VueAxios, axios)
Vue.config.productionTip = false

function getChapters() {
  this.$http.get("http://" + backEndHost + ":" + backEndPort + "/api/v1/chapters/")
      .then(result => {
        console.log(result.data.chapters)
        this.$store.commit("setNotes", result.data.chapters)
      })
      .catch(err => console.log(err))
}

function getChaptersForUser(userId, userName) {
  this.$http.get("http://" + backEndHost + ":" + backEndPort + "/api/v1/chapters/" + userId + "/" + userName)
      .then(result => {
        console.log(result.data.chapters)
        this.$store.commit("setNotes", result.data.chapters)
      })
      .catch(err => console.log(err))
}

function getNotes(userId, userName) {
  this.$http.get("http://" + backEndHost + ":" + backEndPort + "/api/v1/users/notes/" + userId + "/" + userName)
      .then(result => {
        console.log(result.data.notes)
        this.$store.commit("setNotes", result.data.notes)
      })
      .catch(err => console.log(err))
}

function getProblems(userId, userName) {
  this.$http.get("http://" + backEndHost + ":" + backEndPort + "/api/v1/users/problems/" + userId + "/" + userName)
      .then(result => {
        if (result.status === 200) {
          console.log(result.data.problems)
          this.$store.commit("setProblems", result.data.problems)
        }
      })
      .catch(err => console.log(err))
}

let vm = new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    let userId = this.$route.query.userId;
    let userName = this.$route.query.userName;
    this.$store.commit("setUserId", userId ? userId : -1)
    this.$store.commit("setUserName", userName ? userName : "")
    userName = "Till"
    userId = 2
    if (userId && userName) {
      this.$http.post("http://" + backEndHost + ":" + backEndPort + "/api/v1/users/user",
          {moodleId: userId, moodleName: userName})
          .then(result => {
            getChaptersForUser.bind(this)(2, "Till")
            getNotes.bind(this)(2, "Till")
            getProblems.bind(this)(2, "Till")
          })
          .catch(err => console.log(err))
    } else {
      getChapters.bind(this)()
    }
  },
}).$mount('#app')