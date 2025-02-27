/**
 * Search routes module
 */

// Import components using lazy loading
const SearchQuestion = () => import('@/views/search-result/search-question.vue')
const SearchPaper = () => import('@/views/search-result/search-paper.vue')

export default [
  {
    path: 'search/question',
    name: 'searchQuestion',
    component: SearchQuestion
  },
  {
    path: 'search/paper',
    name: 'searchPaper',
    component: SearchPaper
  }
]
