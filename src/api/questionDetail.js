// const URLINVOKE = import.meta.env.VITE_PAPER_GENERATOR + '/gateway/api/invoke' // 无需token,适用于登录、注册

const URLCALL = import.meta.env.VITE_PAPER_GENERATOR + '/gateway/api/call' // 需要token，适用于一般性接口

export const questionAPI = {
  // ------------------- 试题相关 ------------------------
  // 查询试题详情
  QUESTION_DETAIL: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/paperCenter/getQuestionInfo',
  },
  // 提交试题纠错
  QUESTION_CORRECTION: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/paperCenter/addQuestionCorrection',
  },
  // 查询试题类题推荐
  QUESTION_RELATION: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/question/getRelationQuestion',
  },
  // 查询试题答案和解析
  QUESTION_EXPLAIN: {
    baseURL: URLCALL,
    urlPath: '/itembank/ques/showExplain',
    apiId: 100101,
  },
  // 查询试题列表
  QUESTION_SEARCH_LIST: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/paperCenter/getPaperQuestions',
  },
  // 试题评分
  QUESTION_TATESCORE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/paperCenter/addQuestionScore',
  },
  // 批量新增试题
  QUESTION_BATCH_ADD: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/questionBox/batchAdd',
  },

  // 每周好题
  QUESITON_GREATRECOMMEND_LIST: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/greatQuestionRecommend/list',
  },
  // 每周好题 详情
  QUESITON_GREATRECOMMEND_EXPLAIN: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/greatQuestionRecommend/list/explain',
  },
  // 首页每周好题
  QUESITON_GREATRECOMMEND_HOME: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/greatQuestionRecommend/home/question',
  },

  // yp 2022/7/13 查询学段学科下的选题维度配置
  QUESIOTN_SELECT_CONFIGTYPE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/questSelectTypeConfig/getQuestConfigType',
  },
  QUESIOTN_QUESTIONSHARE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/questionShare/createQuestCode',
  },
  QUESIOTN_GETQUESTIONSHARELIST: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/questionShare/getQuestionShareList',
  },
  QUESIOTN_QUESTIONSHARE_QUERYISLIKE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/questionShare/queryIsLike',
  },
  QUESIOTN_GREATQUESTIONLIKE_GETLIKE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/greatQuestionLike/getLike',
  },
  QUESIOTN_GREATQUESTIONLIKE_CANCELLIKE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/greatQuestionLike/cancelLike',
  },
}
