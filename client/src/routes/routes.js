import VueRouter from "vue-router";
import Vue from 'vue'
import notes from "@/components/notes";
import problems from "@/components/problems";
import learn from "@/components/learn";

Vue.use(VueRouter)

const routes = [
    {name: "notes", path: '/notes', component: notes},
    {name: "home", path: '/', component: learn},
    {name: "messages", path: '/messages', component: problems},
]

function hasQueryParams(route) {
    return !!Object.keys(route.query).length
}

const Router = new VueRouter({
    mode: 'history',
    routes
})

Router.beforeEach((to, from, next) => {
    if (!hasQueryParams(to) && hasQueryParams(from)) {
        console.log(to)
        next({name: to.name, query: from.query});
    } else {
        next()
    }
})

export const router = Router