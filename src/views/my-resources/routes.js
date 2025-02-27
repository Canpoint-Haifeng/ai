const MyResources = (r) =>
  require.ensure([], () => r(require('./my-resources')), 'MyResources')
const MyPapers = (r) =>
  require.ensure([], () => r(require('./children/papers')), 'MyResources')
const MyQues = (r) =>
  require.ensure([], () => r(require('./children/ques')), 'MyResources')
const MyCollect = (r) =>
  require.ensure([], () => r(require('./children/collect')), 'MyResources')
const EditWord = (r) =>
  require.ensure([], () => r(require('./children/editword')), 'MyResources')
const CuteQues = (r) =>
  require.ensure([], () => r(require('./children/executeques')), 'MyResources')
const myBooks = (r) =>
  require.ensure([], () => r(require('./children/my-books')), 'MyResources')

const myShare = (r) =>
  require.ensure([], () => r(require('./children/my-share')), 'MyResources')

export default [
  {
    path: 'paper/resources',
    name: 'MyResources',
    redirect: '/paper/resources/papers',
    component: MyResources,
    children: [
      {
        path: 'papers',
        name: 'resourcesPaper',
        component: MyPapers,
        meta: {
          apiActiveMenu: '/paper/resources/papers', // 接口文档的子菜单高亮
          subActive: '/paper/resources/papers',
        },
      },
      {
        path: 'editword',
        name: 'resourcesEditword',
        component: EditWord,
        meta: {
          apiActiveMenu: '/paper/resources/papers', // 接口文档的子菜单高亮
          subActive: '/paper/resources/papers',
        },
      },
      {
        path: 'cuteques',
        name: 'resourcescuteQues',
        component: CuteQues,
        meta: {
          apiActiveMenu: '/paper/resources/papers', // 接口文档的子菜单高亮
          subActive: '/paper/resources/papers',
        },
      },
      {
        path: 'ques',
        name: 'myQues',
        component: MyQues,
        meta: {
          apiActiveMenu: '/paper/resources/ques', // 接口文档的子菜单高亮
          subActive: '/paper/resources/ques',
        },
      },
      {
        path: 'collect',
        name: 'myCollect',
        component: MyCollect,
        meta: {
          apiActiveMenu: '/paper/resources/collect', // 接口文档的子菜单高亮
          subActive: '/paper/resources/collect',
        },
      },
      {
        path: 'books',
        name: 'myBookslist',
        component: myBooks,
        meta: {
          apiActiveMenu: '/paper/resources/books', // 接口文档的子菜单高亮
          subActive: '/paper/resources/books',
        },
      },
      // {
      //   path: 'share',
      //   name: 'myShare',
      //   component: myShare,
      //   meta: {
      //     apiActiveMenu: '/paper/resources/share', // 接口文档的子菜单高亮
      //     subActive: '/paper/resources/share',
      //   },
      // },
    ],
  },
]
