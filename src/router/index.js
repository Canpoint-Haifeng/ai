import { createRouter, createWebHistory } from 'vue-router'
import TestComponent from '@/components/test/TestComponent.vue'

// Define routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: TestComponent
  }
]

// Create router instance
const router = createRouter({
  history: createWebHistory('/lesson/'),
  routes
})

export default router
