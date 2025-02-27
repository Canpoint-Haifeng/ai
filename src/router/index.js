import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

// Import all route modules from centralized location
import routes from './modules'

// Import AppStb component
const AppStb = () => import('@/views/components/appstb.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AppStb,
      redirect: { name: 'paperIndex' },
      children: routes
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: 'paperIndex' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // Update fullpath in store
  store.dispatch('setFullpath', to.name)
  next()
})

export default router
