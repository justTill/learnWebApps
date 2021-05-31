import Vue from 'vue'
import App from './App.vue'
import {router} from '@/./routes/routes'
import {store} from '@/stores/store.js'

Vue.config.productionTip = false


let vm = new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate() {
    let userId = this.$route.query.userId;
    let userName = this.$route.query.userName;
    this.$store.commit("setUserId", userId ? userId : -1)
    this.$store.commit("setUserName", userName ? userName : "")
    console.log("do stuff like collect data")
  }
}).$mount('#app')

