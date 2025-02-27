const URLINVOKE = import.meta.env.VITE_PAPER_GENERATOR + '/gateway/api/invoke' // 无需token,适用于登录、注册
// const URLCALL = import.meta.env.VITE_PAPER_GENERATOR + '/gateway/api/call' // 需要token，适用于一般性接口
// 整合选题接口地址
export const selectAPI = {
  // ------------------- 题目列表 ------------------------
  PAPER_LIST: {
    urlPath: '/paper/list',
  },
  // ------------------- 学段学科数据 ------------------------
  SUBJECT_LIST: {
    urlPath: '/subject/list/',
  },
  // ------------------- 应用试题接口相关 ------------------------
  /*
   * 获取试题列表(不带答案和解析)
   * @param currPage->页码(可选)
   * @param pageSize->每页条目数(可选)
   * @param token->token(可选)
   * @param period->学段code
   * @param subject->学科code
   */
  BACK_QUES_LIST: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/book/getBookQuestions',
  },
  /*
   * 列出试题[带答案和解析]
   * @param qids->试题ids
   */
  BACK_QUES_LIST_EXPLAIN: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/question/list/explain',
  },
  /*
   * 获取试题列表(不带答案和解析)
   * @param currPage->页码(可选)
   * @param pageSize->每页条目数(可选)
   * @param token->token(可选)
   * @param period->学段code
   * @param subject->学科code
   */
  BACK_QUES_LIST_INTER: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/question/list/intelligent',
  },
  /*
   * 获取试题列表(不带答案和解析)
   * @param qids->试题questionID列表
   * @param page->页码
   * @param pageSize->每页条目数
   */
  GET_QUES_LIST: {
    baseURL: URLINVOKE,
    urlPath: '/itembank-factory/ques/quesList',
    apiId: 100096,
  },
  /*
   * 根据ID列表获取试题(带答案和解析)
   * @param qids->试题questionID
   */
  GET_QUES_LIST_BY_IDS: {
    baseURL: URLINVOKE,
    urlPath: '/itembank/ques/byQids',
    apiId: 100097,
  },
  /*
   * 试题的被使用次数
   * @param qids->试题questionid列表
   */
  GET_QUES_USAGE_COUNT: {
    baseURL: URLINVOKE,
    urlPath: '/itembank-factory/ques/usageCount',
    apiId: 100098,
  },
  // ------------------- 选题(全品AI教研云相关接口) ------------------------
  /*
   * 添加到搜题蓝,新增试题
   * @param period->学段
   * @param subject->学科
   * @param type->题目类型
   * @param typeName->题目类型名称
   * @param subjective->是否为主观题 true-是 false-否
   * @param questionId->试题id
   */
  ADD_QUESTION_BOX: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/questionBox/add',
  },

  /*
   * 取消试题收藏
   * @param questionId->试题id
   * @param status->状态 0：取消收藏 1：添加收藏
   */
  COLLECT_QUESTION: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/personal/question/collect',
  },

  /*
   * 取消试卷收藏
   * @param paperId->试卷id
   * @param status->状态 0：取消收藏 1：添加收藏
   */
  COLLECT_PAPER: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/personal/cancelPaperStatus',
  },
  // -------------------图书管理相关接口 ------------------------
  /*
   * 查询教辅图书列表
   * @param source->对应的应用平台
   * @param grade->年级
   * @param belongCategory->图书品类
   * @param teachType->图书类型
   * @param year->年份
   * @param season->使用季节
   * @param pageSize->分页
   * @param pageNum->分页
   */
  BOOK_API_QUERY_TEACH_ALL: {
    baseURL: URLINVOKE,
    httpMethod: 2,
    urlPath: '/books/bookTeach/queryTeachsAll',
    apiId: 100148,
  },
  /*
   * 通过教材属性查询章节目录
   * @param stage->学段
   * @param subject->学科
   * @param versions->版本
   * @param grade->年级
   * @param volume->册别
   */
  BOOK_API_QUERY_CHAPTER: {
    baseURL: URLINVOKE,
    httpMethod: 1,
    urlPath: '/books/bookChapter/chapterByAttrs',
    apiId: 100111,
  },
  /*
   * 通过教材属性查询根级章节目录（懒加载）
   * @param stage->学段
   * @param subject->学科
   * @param versions->版本
   * @param grade->年级
   * @param volume->册别
   */
  BOOK_API_QUERY_CHAPTER_LAZY: {
    baseURL: URLINVOKE,
    httpMethod: 1,
    urlPath: '/books/bookChapter/chapterByAttrsLazy',
    apiId: 100205,
  },
  /*
   * 根据父章节code查询图书章节（懒加载）
   * @param chapterCodes->章节code
   */
  BOOK_API_QUERY_ALL_PARENT: {
    baseURL: URLINVOKE,
    httpMethod: 1,
    urlPath: '/books/bookChapter/getAllParentCode',
    apiId: 100141,
  },
  /*
   * 根据父章节code查询图书章节（懒加载）
   * @param chapterCode->章节code
   */
  BOOK_API_QUERY_CHAPTER_BY_PARENT: {
    baseURL: URLINVOKE,
    httpMethod: 1,
    urlPath: '/books/bookChapter/queryChapterByParent',
    apiId: 100206,
  },
  /*
   * 通过图书id查询图书根级章节集合(懒加载)
   * @param bookId->图书id
   * @param chapterType->图书类型 0教辅1教材
   */
  BOOK_API_QUERY_CHAPTER_BOOKS_LAZY: {
    baseURL: URLINVOKE,
    httpMethod: 1,
    urlPath: '/books/bookChapter/chapterListLazy',
    apiId: 100204,
  },
  /*
   * 通过教辅ID查询教辅图书信息
   * @param id->教辅图书ID
   */
  BOOK_API_QUERY_TEACH_DETAIL_BOOK_ID: {
    baseURL: URLINVOKE,
    httpMethod: 1,
    urlPath: '/books/bookTeach/queryTeachsDetail',
    apiId: 100146,
  },
  /*
   * 通过图书id查询图书章节集合
   * @param stage->教材学段
   * @param subject->教材学科
   * @param versions->教材版本
   * @param grade->教材年级
   * @param volume->教材册别
   */
  BOOK_API_QUERY_CHAPTER_BOOK_ID: {
    baseURL: URLINVOKE,
    httpMethod: 1,
    urlPath: '/books/bookChapter/chapterList',
    apiId: 100117,
  },
  /*
   * 查询图书试题列表
   * @param teachId->图书id
   * @param chapterIds->章节Id字符串(用逗号连接)
   */
  BOOK_API_QUERY_QUESTIONS_BOOK_ID: {
    baseURL: URLINVOKE,
    httpMethod: 1,
    urlPath: '/books/bookTeach/queryTeachQuestions',
    apiId: 100167,
  },
}
