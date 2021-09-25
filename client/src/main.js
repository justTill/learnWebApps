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
import ToggleButton from 'vue-js-toggle-button'

Vue.use(ToggleButton)
Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.config.productionTip = false

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

function getProblems(isInitial) {
    let url = backEndUrl + "/api/v1/users/problems/"
    let key = this.$store.getters.ltiKey
    url = this.$store.getters.ltiKey ? url + "?ltik=" + key : url
    this.$http.get(url, {
        withCredentials: true
    }).then(result => {
        if (JSON.stringify(this.$store.getters.problems) !== JSON.stringify(result.data.problems)) {
            this.$store.commit("setProblems", result.data.problems)
            if (!isInitial) {
                this.$store.commit("setUpdatedProblems", true)
            }
        } else {
            if (!this.$store.getters.updatedProblems) {
                this.$store.commit("setUpdatedProblems", false)
            }
        }
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

function setSettingsFromCookies() {
    let codeTheme = getCookieValue("LearnWebAppsCodeTheme")
    let difficulty = getCookieValue("LearnWebAppsDifficulty")
    let codingHelp = getCookieValue("LearnWebAppsCodingHelp")
    if (codeTheme && (codeTheme === 'DARK' || codeTheme === 'LIGHT')) {
        this.$store.commit('setCodeTheme', codeTheme)
    }
    if (difficulty && (difficulty === 'EASY' || difficulty === 'MIDDLE' || difficulty === 'HARD')) {
        this.$store.commit('setDifficultyLevel', difficulty)
    }
    if (codingHelp && (codingHelp === 'true' || codingHelp === 'false')) {
        this.$store.commit('setCodeHelp', codingHelp === 'true')
    }
}

function getProblemsPeriodically() {
    setInterval(getProblems.bind(this, false), 1000 * 60 * 10)
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
        getProblems.bind(this)(true)
        setSettingsFromCookies.bind(this)()
        getProblemsPeriodically.bind(this)()
    },
}).$mount('#app')