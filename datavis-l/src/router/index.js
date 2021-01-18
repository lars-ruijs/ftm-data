import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Spending from '../views/Spending.vue'
import Target from '../views/Target.vue'
import MapTarget from '../views/MapTarget.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }, 
  {
    path: '/spending',
    name: 'Spending',
    component: Spending
  },
  {
    path: '/target',
    name: 'Target',
    component: Target
  },
  {
    path: '/map',
    name: 'MapTarget',
    component: MapTarget
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
