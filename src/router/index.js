import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

// Import AppStb component
const AppStb = () => import('@/views/components/appstb.vue')

const router = createRouter({
  history: createWebHistory('/lesson'),
  routes: [
    {
      path: '/',
      component: AppStb,
      children: [
        {
          path: '',
          redirect: '/paper/index'
        },
        {
          path: 'paper/index',
          name: 'paperIndex',
          component: () => import('@/views/paper-index/paper-index.vue')
        },
        {
          path: 'test',
          name: 'test',
          component: () => import('@/components/TestComponent.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/paper/index'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (store.dispatch) {
    store.dispatch('setFullpath', to.name)
  }
  next()
})

export default router
