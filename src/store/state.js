const state = {
  // 个人信息
  userInfo: {},
  // 当前学段学科
  currSubject: {},
  allVipDict: {}, // 所有的vip 数据
  // 试题篮数据
  basketData: {},
  // 教材版本
  bookCurrent: {},
  // 年级
  gradeCurrent: {},
  // 上下册
  volumeCurrent: {},
  // 章节
  chapterCode: '',
  // 选中的服务信息
  serviceInfo: {},
  // 禁用顶部学科切换状态
  currDisabledNav: false,
  // 权限服务
  // 校本权限
  schoolVerify: null,
  // 细目表信息
  paperGroupCatalogue: null,
  // 后台配置教材版本list
  // configVersionList: null,
  // 后台默认配置Ooj
  // configObj: null,
  // // 后台配置年级册别list
  // configVolume: {},
  // // 后台配置教材章节
  // configBookText: {},
  // 知识点
  knowledgeData: null,
  // 学段知识点关联id
  knowledgeId: {},
  // 缓存 字典
  cacheDict: {},
  // 重新上传 临时存储 paperinfo 数据data
  reUploadPaper: null,
  // 当前页面的路径
  fullpath: '',
  // 积分 全局管理
  canpointPoints: {},
  dict: {}, // 数据字典 树形列表 {cid:[]}
  dictIndex: {}, // list 索引列表 {cid:{cod:{}},}
  categoryIndex: {}, // 分类 索引列表 {cid:{}}
  gnoreHighRegionList: ['1311', '1319'], //  '1311','1313',1318
  userTheme: {}, // 用户 主题 切换
  messageReadStatu: '',
  versionGrade: [],
}

export default state
