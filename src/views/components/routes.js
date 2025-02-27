import ChapterSelection from '../chapter-selection/routes'
import MyPreparation from '../myPreparation/routes'
import LessonPreparation from '../lessonPreparation/routes'
import BooksChoose from '../books-choose/routes'
import ResourceUpload from '../resource-upload/routes'
import SearchResult from '../search-result/routes'

import BreakdownGroupPaper from '../breakdown-group-paper/routes'
import MyResources from '../my-resources/routes'
import PaperCenter from '../paper-center/routes'
import PaperUpload from '../paper-upload/routes'


import MySmartPaper from '../smartPaper/routes'

const AppStb = () => import(/* webpackChunkName: "index" */ './appstb.vue')
const PlazaStb = () => import(/* webpackChunkName: "index" */ './plazastb.vue')
const PaperIndex = () =>
  import(/* webpackChunkName: "paperIndex" */ '../paper-index/paper-index.vue')
const PaperDetail = () =>
  import(/* webpackChunkName: "paperDetail" */ '../paper-detail/paper-detail.vue')
const PaperPaperParallel = () =>
  import(/* webpackChunkName: "paperPaperParallel" */ '../paper-paperParallel/paper-paperParallel.vue')
const QuestionDetail = () =>
  import(
    /* webpackChunkName: "questionDetail" */ '../question-detail/question-detail.vue'
  )
const QuestionInfo = () =>
  import(
    /* webpackChunkName: "questionInfo" */ '../question-info/question-info.vue'
  )
const PaperMaker = () =>
  import(/* webpackChunkName: "paperMaker" */ '../paper-maker/paper-maker.vue')
// const PaperView = () => import(/* webpackChunkName: "paperView" */ '../paper-view/paper-view.vue')
const Agreement = () =>
  import(/* webpackChunkName: "agreement" */ '../agreement/agreement.vue')

const GoodQuestion = () =>
  import(/* webpackChunkName: "agreement" */ '../question/goodquestion.vue')

const VipAgreement = () =>
  import(/* webpackChunkName: "agreement" */ '../agreement/vipagreement.vue')

const CollectExplain = () =>
  import(/* webpackChunkName: "agreement" */ '../agreement/collectExplain.vue')

const InfomationAuth = () =>
  import(/* webpackChunkName: "agreement" */ '../agreement/infomationAuth.vue')

export default [
  {
    path: '/',
    name: 'appstb',
    component: AppStb,
    redirect: { name: 'index' },
    children: [
      ...ChapterSelection,
      ...MyPreparation,
      ...LessonPreparation,
      ...ResourceUpload,
      ...SearchResult,
      ...BooksChoose,
      ...BreakdownGroupPaper,
      ...MyResources,
      ...PaperUpload,
      ...MySmartPaper,
      ...PaperCenter,
      {
        path: 'index',
        name: 'paperIndex',
        component: PaperIndex,
      },
      // {
      //   path: 'paper/center',
      //   name: 'paperCenter',
      //   component: PaperCenter,
      // },
      {
        path: 'paper/detail',
        name: 'paperDetail',
        component: PaperDetail,
        meta: { disabledNav: true },
      },
      {
        path: 'paper/paperParallel',
        name: 'PaperPaperParallel',
        component: PaperPaperParallel,
        meta: { disabledNav: true },
      },
      {
        path: 'question/detail',
        name: 'questionDetail',
        component: QuestionDetail,
        meta: { disabledNav: true },
      },
      {
        path: 'question/Info',
        name: 'QuestionInfo',
        component: QuestionInfo,
        meta: { disabledNav: true },
      },
      {
        path: 'paper/maker',
        name: 'paperMaker',
        component: PaperMaker,
        meta: { disabledNav: true },
      },
      // {
      //   path: 'paper/view',
      //   name: 'paperView',
      //   component: PaperView,
      //   meta: { disabledNav: true }
      // },
      {
        path: 'agreement',
        name: 'agreement',
        component: Agreement,
      },
      {
        path: 'collectExplain',
        name: 'collectExplain',
        component: CollectExplain,
      },
      {
        path: 'vipagreement',
        name: 'vipagreement',
        component: VipAgreement,
      },
      {
        path: 'question/goodquestions',
        name: 'GoodQuestion',
        component: GoodQuestion,
      },
      {
        path: 'infomationAuth',
        name: 'infomationAuth',
        component: InfomationAuth,
      },
      {
        path: '/manualPrepare',
        name: 'manualPrepare',
        component: () => import('@/views/teachingPlanEdit/manual.vue'),
      },
      {
        path: '/teachingPlanEdit',
        name: 'teachingPlanEdit',
        component: () => import('@/views/teachingPlanEdit/teachingPlan.vue'),
      },
    ],
  },
]
