// Composables
import {createRouter, createWebHistory} from 'vue-router'
import * as process from "process";

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Demo.vue'),
  },
  {
    path: '/delegate',
    name: 'delegate',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Delegate.vue'),
  },
  {
    path: '/trade',
    name: 'trade',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Trade.vue'),
  },
  {
    path: '/paperTrade',
    name: 'paperTrade',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Demo.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Dashboard.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
