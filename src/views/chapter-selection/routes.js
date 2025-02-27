const ChapterSelection = r => require.ensure([], () => r(require('./chapter-selection-new')), 'ChapterSelection')
export default [
  {
    path: 'paper/chapter/selection',
    name: 'chapterSelection',
    component: ChapterSelection
  }
]
