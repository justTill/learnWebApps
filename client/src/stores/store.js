import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        userId: 0,
        userName: ""
    },
    mutations: {
        setUserId(state, id) {
            state.userId = id
        },
        setUserName(state, name) {
            state.userName = name
        },
    }
})