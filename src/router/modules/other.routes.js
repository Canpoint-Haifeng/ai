/**
 * Other routes module
 */

export default [
  {
    path: 'agreement',
    name: 'agreement',
    component: () => import('@/views/agreement/agreement.vue')
  },
  {
    path: 'collectExplain',
    name: 'collectExplain',
    component: () => import('@/views/agreement/collectExplain.vue')
  },
  {
    path: 'vipagreement',
    name: 'vipagreement',
    component: () => import('@/views/agreement/vipagreement.vue')
  },
  {
    path: 'question/goodquestions',
    name: 'GoodQuestion',
    component: () => import('@/views/question/goodquestion.vue')
  },
  {
    path: 'infomationAuth',
    name: 'infomationAuth',
    component: () => import('@/views/agreement/infomationAuth.vue')
  },
  {
    path: '/manualPrepare',
    name: 'manualPrepare',
    component: () => import('@/views/teachingPlanEdit/manual.vue')
  },
  {
    path: '/teachingPlanEdit',
    name: 'teachingPlanEdit',
    component: () => import('@/views/teachingPlanEdit/teachingPlan.vue')
  }
]
