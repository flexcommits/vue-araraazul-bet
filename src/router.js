import Vue from 'vue'
import Router from 'vue-router'

import index from './components/index/index.vue'

Vue.use(Router)

const routes = [
    {
        path: '/',
        redirect: '/index'
    },
    {
        path: '/index',
        component: index
    }
]

export default new Router({
    routes
})