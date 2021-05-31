import about from "@/components/about";
import test from "@/components/Test";
import hello from "@/components/HelloWorld";
import App from "@/App";

export const routes = [
    {path: '/', component: App},
    {path: '/about', component: about},
    {path: '/test/:name/:id', name: "test", component: test, props: true},
    {path: '/hello', component: hello},
]
