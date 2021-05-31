import about from "@/components/about";
import test from "@/components/Test";
import hello from "@/components/HelloWorld";
import VueRouter from "vue-router";
import Vue from 'vue'

Vue.use(VueRouter)

const routes = [
    {path: '/about', component: about},
    {path: '/test/', component: test},
    {path: '/hello', component: hello},
]

export const router = new VueRouter({
    routes
})