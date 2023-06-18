// Composables
import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
