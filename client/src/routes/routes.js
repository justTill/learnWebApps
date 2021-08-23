import VueRouter from "vue-router";
import Vue from 'vue'
import notes from "@/components/notes";
import problems from "@/components/problems";
import learn from "@/components/learn";

Vue.use(VueRouter)

const routes = [
    {path: '/notes', component: notes},
    {path: '/', component: learn},
    {path: '/messages/', component: problems},
]

export const router = new VueRouter({
    mode: 'history',
    routes
})