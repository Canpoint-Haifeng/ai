export default [
  {
    path: 'smartPaper/prePare',
    name: 'prePare',
    component: () => import('./prePare.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: 'smartpaper/chapter',
    name: 'chapter',
    component: () => import('./chapter.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: 'smartpaper/knowledge',
    name: 'knowledge',
    component: () => import('./knowledge.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: 'smartpaper/special',
    name: 'special',
    component: () => import('./special.vue'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: 'smartpaper/paperView',
    name: 'paperView',
    component: () => import('./PaperView.vue'),
  },
]
