const chooseSelection = r => require.ensure([], () => r(require('./choose-selection')), 'chooseSelection')
export default [
  {
    path: 'paper/books/choose',
    name: 'chooseSelection',
    component: chooseSelection
  }
]
