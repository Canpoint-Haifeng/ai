const URLINVOKE = import.meta.env.VITE_PAPER_GENERATOR + '/gateway/api/invoke' // 无需token,适用于登录、注册

// const URLCALL = import.meta.env.VITE_PAPER_GENERATOR + '/gateway/api/call' // 需要token，适用于一般性接口

export const paperCenterAPI = {
  // ------------------- 试卷管理相关 ------------------------

  // 获取已入库试卷中心列表
  MANAGE_PAPER_LIST: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/paperCenter/getAllPaper',
  },
  // 搜索同步教案
  MANAGE_PAPER_TONG_LIST: {
    baseURL: URLINVOKE,
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/paperCenter/getPapersData',
    apiId: 100144,
  },
  // 获取已入库试卷详情/试卷预览
  MANAGE_PAPER_PREVIEW: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/paper/paperInfo',
  },
  // 没有 token 查询试卷
  NOTOKEN_PAPER_QUERY: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/papers/noToken/paperPreview',
  },
  // 试卷类型分析
  MANAGE_PAPER_ANALYZE_TYPE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/papers/typeChartList',
  },
  // 试卷知识点分析
  MANAGE_PAPER_ANALYZE_POINT: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/papers/pointChartList',
  },
  // 试卷难易度分析
  MANAGE_PAPER_ANALYZE_DIFFICULT: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/papers/difficultChartList',
  },
  // 试卷 细目表分析
  MANAGE_PAPER_ANALYZE_GROUP: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/paperGroupCatalogue/paperCatalogue',
  },
  // 获取试卷收藏状态
  MANAGE_PAPER_COLLECT_STATUS: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/paperCenter/getPaperTabStatus',
  },
  // 试卷收藏
  MANAGE_PAPER_COLLECT: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/personal/cancelExamPaperStatus',
  },
  // 试卷下载
  MANAGE_PAPER_DOWNLOAD: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/download/paper',
  },
  // ------------------- 订单支付相关 ------------------------
  // 已经弃用，已经被重写
  PRODUCT_ORDER: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/order/createOrder',
  },
  // 查询 用户下载券数量
  QUERY_USABLE_COUPON: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/download/coupon/usableCoupon',
  },
  // 查询试卷下 是否 含有 音频文件
  QUERY_PERSONAL_ISHAVEAUDIO: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/personal/isHaveAudio',
  },
  // 查询订单状态
  QUERY_ORDER: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/order/queryPaperOrder',
  },
  // 创建订单
  CREATE_ORDER: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/order/createOrder',
  },
  // 获取微信支付二维码
  WECHAT_PAY: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/pay/weChatPay',
  },
  // 查询微信支付结果
  WECHAT_PAY_RESULT: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/pay/weChatPayResult',
  },
  // 余额全品币支付
  BALANCE_PAY: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/pay/balancePay',
  },
  // 继续支付
  CONTINUE_PAY: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/order/continuePay',
  },
  //  内容 策划平台 试题集查询
  MATERIAL_VIEWEXAM: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/material/viewExam',
  },
  // material/noToken/viewExam
  MATERIAL_NOTOKEN_VIEWEXAM: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/material/noToken/viewExam',
  },

  // 查询 基础反馈
  FEEDBACK_GETBASEQUESTIONCONFIGLIST: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/feedback/getBaseQuestionConfigList',
  },
  //  添加基础反馈
  FEEDBACK_ADDBASEQUESTIONINFO: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/feedback/addBaseQuestionInfo',
  },
  // 新增深度反馈
  FEEDBACK_ADDDEEPQUESTIONINFO: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/feedback/addDeepQuestionInfo',
  },
  COMMENT_UPLOAD_FILE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/upload/file',
  },
  FEEDPAPER_SHAREPAPER: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/sharePaper/createPaperCode',
  },
  // yp 2022/8/30 编辑试卷分享状态
  CENTER_SHAREPAPER_EDITSHARESTATUS: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/sharePaper/editShareStatus',
  },
  // 保存试卷时 调用后台接口
  CENTER_SHAREPAPER_CHECKTOEDITSHAREPAPER: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/sharePaper/checkToEditSharePaper',
  },
  // 取消试题 分享状态
  CENTER_QUESTIONSHARE_CANCELSHAREQUESTION: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/questionShare/cancelShareQuestion',
  },
  PAPERS_GETPAPERAUDIO: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/papers/getPaperAudio',
  },
}
