import { createRouter, createWebHistory } from 'vue-router'
import TestComponent from '../components/test/TestComponent.vue'

const routes = [
  {
    path: '/',
    name: 'Test',
    component: TestComponent
  }
]

const router = createRouter({
  history: createWebHistory('/lesson/'),
  routes
})

export default router
