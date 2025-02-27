const MyPaperTeaching = (r) =>
  require.ensure([], () => r(require('./teaching')), 'MyPaperTeaching')
export default [
  {
    path: 'preparation/myTeaching',
    name: 'MyPaperTeaching',
    component: MyPaperTeaching,
  },
]
