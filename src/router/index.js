import { createRouter, createWebHistory } from 'vue-router'
import { withSuspense } from './suspense-helper'
import IndexSkeleton from '@/components/Skeleton/IndexSkeleton.vue'
import PaperDetailSkeleton from '@/components/Skeleton/PaperDetailSkeleton.vue'
import PaperMakerSkeleton from '@/components/Skeleton/PaperMakerSkeleton.vue'

// Import route modules
import componentsRoutes from '@/views/components/routes'
import resourceUploadRoutes from '@/views/resource-upload/routes'
import searchResultRoutes from '@/views/search-result/routes'
import smartPaperRoutes from '@/views/smartPaper/routes'

const routes = [
  {
    path: '/',
    redirect: '/paper/index'
  },
  {
    path: '/paper/index',
    name: 'paperIndex',
    component: withSuspense(() => import('@/views/paper/index.vue'), IndexSkeleton),
    meta: {
      title: '首页',
      keepAlive: true
    }
  },
  {
    path: '/paper/detail',
    name: 'paperDetail',
    component: withSuspense(() => import('@/views/paper/detail.vue'), PaperDetailSkeleton),
    meta: {
      title: '试卷详情',
      keepAlive: true
    }
  },
  {
    path: '/paper/maker',
    name: 'paperMaker',
    component: withSuspense(() => import('@/views/paper/maker.vue'), PaperMakerSkeleton),
    meta: {
      title: '组卷',
      keepAlive: true
    }
  },
  ...componentsRoutes,
  ...resourceUploadRoutes,
  ...searchResultRoutes,
  ...smartPaperRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
