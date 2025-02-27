// 整合接口地址
export const paperMakerAPI = {
  // ------------------- 试题篮相关------------------------
  // 获取教案数据列表
  BASKET_LIST: {
    // urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/questionBox/query',
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/index/queryAllLessons',
  },
  // 删除试题篮类型试题
  DELETE_TYPE_BASKET: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/questionBox/delete',
  },
  // 删除试题篮试题
  DELETE_BASKET: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/questionBox/remove',
  },
  // 清空试题篮试题
  EMPTY_BASKET: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/questionBox/clean',
  },
  // 换一题
  PAPERMAKER_CHANGEONE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/questionBox/changeOne',
  },
  // ------------------- 临时组卷相关------------------------
  // 获取组卷信息数据
  TEMP_PAPER_PREVIEW: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/testPaper/preview',
  },
  SCHOOL_PAPER_PRVIEW: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/school/paper/preview',
  },
  // 更新组卷主标题
  TEMP_PAPER_UPDATE_HEADLINE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/testPaper/updatePaperHeadline',
  },
  // 更新组卷保密标记
  TEMP_PAPER_UPDATE_SECRETSIGN: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/testPaper/updateSecretSign',
  },
  // 更新组卷副标题
  TEMP_PAPER_UPDATE_SUBTITLE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/testPaper/updatePaperSubtitle',
  },
  // 更新组卷信息
  TEMP_PAPER_UPDATE_PAPERINFO: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/testPaper/updatePaperInfo',
  },
  // 更新组卷注意事项栏
  TEMP_PAPER_UPDATE_PAYATTENTION: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/testPaper/updatePayAttention',
  },
  // 更新组卷分卷一标题
  TEMP_PAPER_UPDATE_GROUPONE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/testPaper/updatePaperGroupNameOne',
  },
  // 更新组卷分卷一说明
  TEMP_PAPER_UPDATE_GROUPDESCONE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/testPaper/updatePaperGroupDescOne',
  },
  // 更新组卷分卷二标题
  TEMP_PAPER_UPDATE_GROUPTWO: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/testPaper/updatePaperGroupNameTwo',
  },
  // 更新组卷分卷二说明
  TEMP_PAPER_UPDATE_GROUPDESCTWO: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/testPaper/updatePaperGroupDescTwo',
  },
  // 更新组卷风格
  TEMP_PAPER_UPDATE_STYLE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/testPaper/updatePaperInfo',
  },
  // 临时组卷分析
  TEMP_PAPER_ANALYZE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/testPaper/analyze',
  },
  // 下载预览组卷
  TEMP_PAPER_DOWNLOAD: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/paper/downloadPreviewPaper',
  },
  // ------------------- 题目相关 ------------------------
  // 更新组卷大题标题
  QUESTION_UPDATE_TYPENAME: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/testPaper/updateQuestionTypeName',
  },
  // 保存组卷所有小题分数
  QUESTION_SETTING_SCORE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/testPaper/settingScore',
  },
  // 更新组卷小题分数
  QUESTION_UPDATE_SCORE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/testPaper/updateQuestionScore',
  },
  // 初始化组卷小题排序
  QUESTION_INIT_ORDER: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/testPaper/initQuestionOrder',
  },
  // 更新组卷小题排序
  QUESTION_UPDATE_ORDER: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/testPaper/updateQuestionOrder',
  },
  // 更新组卷大题排序
  QUESTION_UPDATE_TYPEORDER: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/testPaper/updateQuestionTypeOrder',
  },
  // ------------------- 正式组卷相关------------------------
  // 保存组卷
  PAPER_SAVE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/paper/savePaper',
  },
  // 查询组卷
  PAPER_QUERY: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/paper/queryPaper',
  },
  // 查询组卷
  PAPER_UPDATE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/paper/updatePaper',
  },
  // 编辑组卷
  PAPER_EDIT: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/paper/editTestPaper',
  },
  // 下载已保存组卷
  PAPER_DOWNLOAD: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/paper/downloadPaper',
  },
  // 正式组卷分析
  PAPER_ANALYZE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/papers/paperAnalyze',
  },
  // 试题回收站
  QUESTION_RECYCLE_BIN: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/recycle/ques/view',
  },
}
