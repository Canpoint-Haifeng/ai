// Import components
const PaperIndex = () => import('@/views/paper-index/paper-index.vue')

// Define routes
export default [
  {
    path: 'paperIndex',
    name: 'paperIndex',
    component: PaperIndex
  }
]
