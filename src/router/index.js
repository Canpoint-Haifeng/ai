import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('../views/Layout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue')
      }
    ]
  },
  {
    path: '/paperIndex',
    name: 'PaperIndex',
    component: () => import('../views/paper-index/paper-index.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/lesson/'),
  routes
})

export default router
