const BreakdownGroupPaper = (r) =>
  require.ensure(
    [],
    () => r(require('./breakdown-group-paper')),
    'BreakdownGroupPaper',
  )
const myBreakdownGroup = (r) =>
  require.ensure(
    [],
    () => r(require('./my-breakdown-group')),
    'myBreakdownGroup',
  )
const nextStepBreakdown = (r) =>
  require.ensure(
    [],
    () => r(require('./next-step-breakdown')),
    'nextStepBreakdown',
  )
const editBreakdownGroup = (r) =>
  require.ensure(
    [],
    () => r(require('./edit-breakdown-group')),
    'editBreakdownGroup',
  )
const paperBreakdownGroup = (r) =>
  require.ensure(
    [],
    () => r(require('./paper-breakdown-group')),
    'paperBreakdownGroup',
  )
export default [
  {
    path: 'paper/intelligence/grouppaper',
    name: 'BreakdownGroupPaper',
    component: BreakdownGroupPaper,
  },
  {
    path: 'paper/intelligence/mybreakdowngroup',
    name: 'myBreakdownGroup',
    component: myBreakdownGroup,
    meta: {
      apiActiveMenu: '/paper/intelligence/grouppaper',
    },
  },
  {
    path: 'paper/intelligence/nextstepbreakdown',
    name: 'nextStepBreakdown',
    component: nextStepBreakdown,
    meta: {
      apiActiveMenu: '/paper/intelligence/grouppaper',
    },
  },
  {
    path: 'paper/intelligence/editbreakdowngroup',
    name: 'editBreakdownGroup',
    component: editBreakdownGroup,
    meta: {
      apiActiveMenu: '/paper/intelligence/grouppaper',
      disabledNav: true,
    },
  },
  {
    path: 'paper/intelligence/paperbreakdowngroup',
    name: 'paperBreakdownGroup',
    component: paperBreakdownGroup,
    meta: {
      apiActiveMenu: '/paper/intelligence/grouppaper',
      disabledNav: true,
    },
  },
]
