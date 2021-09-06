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
    this.$http.get(backEndUrl + "/api/v1/chapters/", {
        withCredentials: true
    }).then(result => {
        this.$store.commit("setChapters", result.data.chapters)
    }).catch(err => {
        console.log(err)
        console.log(backEndUrl)
    })
}

function getNotes() {
    this.$http.get(backEndUrl + "/api/v1/users/notes/", {
        withCredentials: true
    }).then(result => {
        this.$store.commit("setNotes", result.data.notes)
    }).catch(err => {

    })
}

function getProblems() {
    this.$http.get(backEndUrl + "/api/v1/users/problems/", {
        withCredentials: true
    }).then(result => {
        this.$store.commit("setProblems", result.data.problems)
    }).catch(err => {

    })
}

function getCookieValue(name) {
    let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match && match[2]) {
        return match[2]
    }
    return null
}
new Vue({
    render: h => h(App),
    router,
    store,
    beforeCreate() {
        let userName = getCookieValue("learnAppUsersGivenName")
        this.$store.commit("setUserName", userName ? userName : "default")
        getChapters.bind(this)()
        getNotes.bind(this)()
        getProblems.bind(this)()
    },
}).$mount('#app')