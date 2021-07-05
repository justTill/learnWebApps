import Vue from 'vue'
import App from './App.vue'
import {router} from '@/./routes/routes'
import {store} from '@/stores/store.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {backEndHost, backEndPort} from './envVariables'

Vue.use(VueAxios, axios)
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
    this.$http.get("http://" + backEndHost + ":" + backEndPort + "/api/v1/chapters/?moodleId=" + 2 + "&moodleName=" + "Till")
        .then(result => console.log(result.data))
        .catch(err => console.log(err))
  },
}).$mount('#app')