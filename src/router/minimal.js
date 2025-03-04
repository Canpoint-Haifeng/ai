import { createRouter, createWebHistory } from 'vue-router'
import TestComponent from '@/components/TestComponent.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: TestComponent
  }
]

const router = createRouter({
  history: createWebHistory('/lesson/'),
  routes
})

export default router
