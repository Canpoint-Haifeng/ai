const LessonPreparation = r =>
  require.ensure([], () => r(require('./index')), 'LessonPreparation')
export default [
  {
    path: 'lessonPreparation',
    name: 'LessonPreparation',
    component: LessonPreparation,
  }
]
