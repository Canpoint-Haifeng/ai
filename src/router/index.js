import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

// Import route modules
import componentRoutes from '@/views/components/routes'
import searchResultRoutes from '@/views/search-result/routes'
import smartPaperRoutes from '@/views/smartPaper/routes'
import resourceUploadRoutes from '@/views/resource-upload/routes'

// Import AppStb component
const AppStb = () => import('@/views/components/appstb.vue')

const routes = [
  {
    path: '/',
    component: AppStb,
    redirect: { name: 'paperIndex' },
    children: [
      ...componentRoutes,
      ...searchResultRoutes,
      ...smartPaperRoutes,
      ...resourceUploadRoutes
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'paperIndex' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  // Update fullpath in store
  store.dispatch('setFullpath', to.name)
  next()
})

export default router
