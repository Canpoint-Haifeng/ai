const PaperUpload = r => require.ensure([], () => r(require('./paper-upload')), 'PaperUpload')
export default [
  {
    path: 'paper/upload',
    name: 'PaperUpload',
    component: PaperUpload
    // meta: { disabledNav: true }
  }
]
