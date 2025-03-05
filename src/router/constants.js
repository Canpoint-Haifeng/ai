/**
 * Router constants
 * Centralized management of route paths and names
 */

export const ROUTE_NAMES = {
  // Paper routes
  PAPER_INDEX: 'paperIndex',
  PAPER_DETAIL: 'paperDetail',
  PAPER_MAKER: 'paperMaker',
  PAPER_PARALLEL: 'PaperPaperParallel',
  
  // Search routes
  SEARCH_QUESTION: 'searchQuestion',
  SEARCH_PAPER: 'searchPaper',
  
  // Smart Paper routes
  PREPARE: 'prePare',
  CHAPTER: 'chapter',
  KNOWLEDGE: 'knowledge',
  SPECIAL: 'special',
  PAPER_VIEW: 'paperView',
  
  // Resource routes
  RESOURCE_UPLOAD: 'resourceUpload',
  
  // Other routes
  AGREEMENT: 'agreement',
  COLLECT_EXPLAIN: 'collectExplain',
  VIP_AGREEMENT: 'vipagreement',
  GOOD_QUESTION: 'GoodQuestion',
  INFOMATION_AUTH: 'infomationAuth',
  MANUAL_PREPARE: 'manualPrepare',
  TEACHING_PLAN_EDIT: 'teachingPlanEdit'
}

export const ROUTE_PATHS = {
  // Paper routes
  PAPER_INDEX: '/paperIndex',
  PAPER_DETAIL: '/paper/detail',
  PAPER_MAKER: '/paper/maker',
  PAPER_PARALLEL: '/paper/paperParallel',
  
  // Search routes
  SEARCH_QUESTION: '/search/question',
  SEARCH_PAPER: '/search/paper',
  
  // Smart Paper routes
  PREPARE: '/smartPaper/prePare',
  CHAPTER: '/smartpaper/chapter',
  KNOWLEDGE: '/smartpaper/knowledge',
  SPECIAL: '/smartpaper/special',
  PAPER_VIEW: '/smartpaper/paperView',
  
  // Resource routes
  RESOURCE_UPLOAD: '/resource/upload',
  
  // Other routes
  AGREEMENT: '/agreement',
  COLLECT_EXPLAIN: '/collectExplain',
  VIP_AGREEMENT: '/vipagreement',
  GOOD_QUESTION: '/question/goodquestions',
  INFOMATION_AUTH: '/infomationAuth',
  MANUAL_PREPARE: '/manualPrepare',
  TEACHING_PLAN_EDIT: '/teachingPlanEdit'
}
