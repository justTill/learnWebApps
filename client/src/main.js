import Vue from 'vue'
import App from './App.vue'
import {router} from '@/./routes/routes'
import {store} from '@/stores/store.js'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import {backEndUrl} from './envVariables'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.config.productionTip = false
Vue.use(VueCodemirror)

function getChapters() {
    let url = backEndUrl + "/api/v1/chapters/"
    let key = this.$store.getters.ltiKey
    url = this.$store.getters.ltiKey ? url + "?ltik=" + key : url
    this.$http.get(url, {
        withCredentials: true
    }).then(result => {
        this.$store.commit("setChapters", result.data.chapters)
    }).catch(err => {
        console.log(err)
        console.log(backEndUrl)
    })
}

function getNotes() {
    let url = backEndUrl + "/api/v1/users/notes/"
    let key = this.$store.getters.ltiKey
    url = this.$store.getters.ltiKey ? url + "?ltik=" + key : url
    this.$http.get(url, {
        withCredentials: true
    }).then(result => {
        this.$store.commit("setNotes", result.data.notes)
    }).catch(err => {

    })
}

function checkIfLtiKeyIsValid() {
    let key = this.$store.getters.ltiKey
    if (key) {
        let url = backEndUrl + "/api/v1/lti/key/healthCheck/"
        url = this.$store.getters.ltiKey ? url + "?ltik=" + key : url
        this.$http.get(url, {
            withCredentials: true
        }).then(result => {
            if (result.data && result.data.valid) {
                this.$store.commit("setUserName", result.data.userName)
            }
        }).catch(err => {

        })
    }
}

function getProblems() {
    let url = backEndUrl + "/api/v1/users/problems/"
    let key = this.$store.getters.ltiKey
    url = this.$store.getters.ltiKey ? url + "?ltik=" + key : url
    this.$http.get(url, {
        withCredentials: true
    }).then(result => {
        this.$store.commit("setProblems", result.data.problems)
    }).catch(err => {

    })
}

new Vue({
    render: h => h(App),
    router,
    store,
    beforeCreate() {
        let key = this.$route.query.ltik
        this.$store.commit("setLtiKey", key ? key : "")
        checkIfLtiKeyIsValid.bind(this)()
        getChapters.bind(this)()
        getNotes.bind(this)()
        getProblems.bind(this)()
    },
}).$mount('#app')