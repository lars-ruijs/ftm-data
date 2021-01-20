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
