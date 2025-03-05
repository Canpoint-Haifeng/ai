/**
 * Smart Paper routes module
 */

export default [
  {
    path: '/smartPaper/prePare',
    name: 'prePare',
    component: () => import('@/views/smartPaper/prePare.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/smartpaper/chapter',
    name: 'chapter',
    component: () => import('@/views/smartPaper/chapter.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/smartpaper/knowledge',
    name: 'knowledge',
    component: () => import('@/views/smartPaper/knowledge.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/smartpaper/special',
    name: 'special',
    component: () => import('@/views/smartPaper/special.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: '/smartpaper/paperView',
    name: 'paperView',
    component: () => import('@/views/smartPaper/PaperView.vue'),
  }
]
