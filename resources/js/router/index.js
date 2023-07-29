import { createRouter, createWebHistory } from 'vue-router';

import Home from '../components/HomeComponent.vue';
import error_404 from '../page/404.vue';

const routers = [
    {
        path: '/',
        name: 'home',
        component: Home,
        children: []
    },
    {
        path: '/404',
        name: '404',
        component: error_404
    },
    {
        path: '/:pathMatch(.*)',
        redirect: '/404'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routers
})

export default router 