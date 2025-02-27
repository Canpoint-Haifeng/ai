export default [
  {
    path: 'smartpaper/chapter',
    name: 'chapter',
    component: () => import('./chapter'),
    meta: {
      keepAlive: true,
    },
  },
  {
    path: 'smartpaper/knowledge',
    name: 'knowledge',
    component: () => import('./knowledge'),
    meta: {
      keepAlive: true,
    },
    //按知识点
  },
  {
    path: 'smartpaper/special',
    name: 'special',
    component: () => import('./special'),
    meta: {
      keepAlive: true,
    },
    // 按专题
  },
  {
    path: 'smartpaper/paperView',
    name: 'paperView',
    component: () => import('./PaperView'),
    //按章节
  },
]
