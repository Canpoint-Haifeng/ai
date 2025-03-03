/**
 * Paper routes module
 */

// Import components using lazy loading
const PaperIndex = () => import('@/views/paper-index/paper-index.vue')
const PaperDetail = () => import('@/views/paper-detail/paper-detail.vue')
const PaperMaker = () => import('@/views/paper-maker/paper-maker.vue')
const PaperPaperParallel = () => import('@/views/paper-paperParallel/paper-paperParallel.vue')
const TestComponent = () => import('@/components/TestComponent.vue')
const SimplePaperIndex = () => import('@/views/paper-index/SimplePaperIndex.vue')
const GradualPaperIndex = () => import('@/views/paper-index/GradualPaperIndex.vue')

export default [
  {
    path: 'test',
    name: 'test',
    component: TestComponent
  },
  {
    path: 'simple-paper-index',
    name: 'simplePaperIndex',
    component: SimplePaperIndex
  },
  {
    path: 'gradual-paper-index',
    name: 'gradualPaperIndex',
    component: GradualPaperIndex
  },
  {
    path: 'paperIndex',
    name: 'paperIndex',
    component: PaperIndex
  },
  {
    path: 'paper/detail',
    name: 'paperDetail',
    component: PaperDetail,
    meta: { disabledNav: true }
  },
  {
    path: 'paper/maker',
    name: 'paperMaker',
    component: PaperMaker,
    meta: { disabledNav: true }
  },
  {
    path: 'paper/paperParallel',
    name: 'PaperPaperParallel',
    component: PaperPaperParallel,
    meta: { disabledNav: true }
  }
]
