import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Register from "@/views/Register";
import Login from "@/views/Login";
import ArtworkDetail from "@/views/ArtworkDetail";
import UserCenter from "@/views/UserCenter";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/register',
        name: 'Register',
        component: Register
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/artwork/:id',
        name: 'ArtworkDetail',
        component: ArtworkDetail
    },
    {
        path: '/user-center',
        name: 'UserCenter',
        component: UserCenter
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
