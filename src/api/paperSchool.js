// 我的 资源
export const paperSchool = {
  // 校本库 试卷列表
  SCHOOL_PAPER_LIST: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/school/resources/paper/list',
  },
  SCHOOL_PAPER_SHARE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/school/resources/paper/shared',
  },
  SCHOOL_QUES_LIST: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/school/resources/ques/list',
  },
  SCHOOL_QUES_GETQUESINFO: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/question/getQuestionInfo',
  },
  // 获取 校本的权限
  SCHOOL_schoolVerify: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/sys/user/schoolVerify',
  },

  // 校本图书列表
  SCHOOL_BOOK_LIST: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/school/book/querySchoolBook',
  },
  // 校本图书设置常用不常用
  SET_ISCOMMON: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/myselfBook/isCommon',
  },
}
