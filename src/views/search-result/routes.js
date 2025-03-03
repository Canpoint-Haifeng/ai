const SearchQuestion = () => import(/* webpackChunkName: "searchQuestion" */ './search-question.vue')
const SearchPaper = () => import(/* webpackChunkName: "searchPaper" */ './search-paper.vue')
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
