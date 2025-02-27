// 整合接口地址
export const usersAPI = {
  // ------------------- 个人中心相关接口 ------------------------

  /**
   *
   修改用户信息
   */
  USER_IMPROVEPERSONALDATA: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/gateway/improvePersonalData',
  },

  /**
   * /paper-generator/user/pointsInfo/personalPoints
   * 个人积分信息
   *
   */
  USER_PERSONALPOINTS: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/user/pointsInfo/personalPoints',
  },
  USER_POINTS_RECEIVEREWARD: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/user/pointsInfo/receiveReward',
  },

  /*
  我的资产
  */
  USER_USERASSETS_LIST: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/userAssets/getUserAssetsList',
  },
  /**
   * 收支明细
   * /paper-generator/user/pointsInfo/pointsRecord
   */
  USER_POINTSRECORD: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/user/pointsInfo/pointsRecord',
  },

  /**
   * 抽奖 奖品
   * /paper-generator/luckDraw/goods
   */
  USER_LUCKDRAW_GOODS: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/luckDraw/goods',
  },
  USER_LUCKDRAW_LOGS: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/luckDraw/logs',
  },
  USER_LUCKDRAW_DRAW: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/luckDraw/draw',
  },
  /**
   * 商品市场
   *
   */
  USER_STORE_GOODSLIST: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/exchange/store/goodsList',
  },
  USER_STORE_EXCHANGEGOODS: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/exchange/store/exchangeGoods',
  },
  USER_CARDVOUCHERCOUNT: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/mygoods/cardVoucherCount',
  },
  USER_MYGOODS_LIST: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/mygoods/list',
  },
  // 积分VIP激活
  USER_POINTS_VIPACTIVATE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/mygoods/pointsVipActivate',
  },
  /**
   * 周签到
   *
   */
  USER_QUERYSIGNTASK: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/pointsUserRulesRecord/querySignTask',
  },
  USER_POINTSUSERRULESRECORD_TOSIGN: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/pointsUserRulesRecord/toSign',
  },
  USER_REPLENISHTOSIGN: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/pointsUserRulesRecord/replenishToSign',
  },
  USER_WECHATGZH_GETQRCODE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/wechatGzh/getQrCode',
  },
  USER_WECHATGZH_ISATTENTION: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/pointsUserRulesRecord/isAttention',
  },
  // 每日分享
  USER_CREATESHAREQRCODE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/groupUpTask/createShareQRCode',
  },
  /***
   * 成长任务
   * */
  USER_POINTSUSERRULESRECORD_QUERYTASKLIST: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/pointsUserRulesRecord/queryTaskList',
  },

  /**
   * 用户任务
   * /paper-generator/groupUpTask/watchVideo
   */
  USER_TASK_WATCHVIDEO: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/groupUpTask/watchVideo',
  },
  /*
   *  查询余额最近交易订单
   * @param currPage->当前页
   * @param pageSize->每页显示条数
   */
  MY_LAST_TRADE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/personal/getMyLastTrade',
  },
  /*
   *  查询我的支付
   * @param timeBegin->开始时间
   * @param timeEnd->timeEnd
   * @param orderType-> 类型 1.充值 2.资源下载
   * @param currPage->当前页
   * @param pageSize->每页显示条数
   */
  MY_PAYMENT: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/personal/getMyPayment',
  },
  /*
   *  查询订单详情
   * @param orderNumMerchant->订单号
   */
  MY_ORDER_DETAIL: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/order/orderDetails',
  },
  /*
   * 查询我的上传
   * @param timeBegin->开始时间
   * @param timeEnd->timeEnd
   * @param status->状态: 0-待审核 1-已通过 2-退稿
   * @param currPage->当前页
   * @param pageSize->每页显示条数
   */
  UPLOAD_PAPER: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/personal/getUploadPaper',
  },
  /*
   * 上传审核详情
   * @param fileId->状态: 0-待审核 1-已通过 2-退稿
   * @param status->当前页
   */
  UPLOAD_APPROVE_DETAIL: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/personal/UploadApprovalDetail',
  },
  /*
   * 查询我的下载(试卷下载)
   * @param timeBegin->开始时间
   * @param timeEnd->结束时间
   * @param currPage->当前页
   * @param pageSize->每页显示条数
   */
  DOWNLOAD_MY_PAPER: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/personal/getMyPaperDownloads',
  },
  /*
   * 查询我的下载(组卷下载)
   * @param timeBegin->开始时间
   * @param timeEnd->结束时间
   * @param currPage->当前页
   * @param pageSize->每页显示条数
   */
  DOWNLOAD_PAPER: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/personal/getPaperDownload',
  },

  /*
   * 查询我的收藏(组卷收藏)
   * @param timeBegin->开始时间
   * @param timeEnd->结束时间
   * @param currPage->当前页
   * @param pageSize->每页显示条数
   */
  COLLECTION_PAPER: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/personal/getPaperCollection',
  },

  /*
   * 取消组卷收藏
   * @param paperId->试卷id
   * @param status->状态 0：取消收藏 1：添加收藏
   */
  COLLECTION_CANCEL_PAPER: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/personal/cancelPaperStatus',
  },

  /*
   * 查询我的收藏(试卷收藏)
   * @param timeBegin->开始时间
   * @param timeEnd->结束时间
   * @param currPage->当前页
   * @param pageSize->每页显示条数
   */
  COLLECTION_EXAMPAPER: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/personal/getExamPaperCollection',
  },

  /*
   * 取消试卷收藏
   * @param paperId->试卷id
   * @param status->状态 0：取消收藏 1：添加收藏
   */
  COLLECTION_CANCEL_EXAMPAPER: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/personal/cancelExamPaperStatus',
  },

  /*
   * 查询我的收藏(试题收藏)
   * @param timeBegin->开始时间
   * @param timeEnd->结束时间
   * @param currPage->当前页
   * @param pageSize->每页显示条数
   */
  COLLECTION_QUESTION: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/personal/getPaperItemCollection',
  },

  /*
   * 取消试题收藏
   * @param questionId->试题id
   * @param status->状态 0：取消收藏 1：添加收藏
   */
  COLLECTION_CANCEL_QUESTION: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/personal/cancelPaperItemStatus',
  },

  /*
   * 查询我的纠错
   * @param timeBegin->开始时间
   * @param timeEnd->结束时间
   * @param currPage->当前页
   * @param pageSize->每页显示条数
   */
  MY_CORRECTION: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/personal/getPaperItemCorrection',
  },
  MY_FEEDBACK_GETMYFEEDBACK: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/feedback/getMyFeedback',
  },
  /*
   * 查询试题纠错处理详情
   * @param errorId->试题id
   */
  CORRECTION_DETAIL: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/personal/getCorrectionDetails',
  },
  /*
   * 查询我的组卷信息
   * @param timeBegin->开始时间
   * @param timeEnd->结束时间
   * @param currPage->当前页
   * @param pageSize->每页显示条数
   */
  GENERATION_PAPER: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/personal/getPaperGeneration',
  },
  /*
   * 复制试卷
   * @param paperIdEnc->组卷id
   * @param source->来源
   */
  COPY_MY_PAPER: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/paper/copyPaper',
  },
  /*
   * 删除我的组卷信息
   * @param paperId->组卷id
   */
  DELETE_MY_PAPER: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/personal/deleteTestPaper',
  },

  // 删除自用试卷 NotNull(message = "参数不能为空") Long paperInfoId
  DELETE_SCHOOL_PAPER: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/school/paper/delPaper ',
  },

  // 查询用户开通服务信息 (无参数)
  GET_SERVICE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/personal/getService',
  },

  // 获取 vip
  MY_VIP_TYPELIST: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/vip/typeList',
  },
  // 购买vip 请求订单
  MY_CREATE_VIP_ORDER: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/vip/createVipOrder',
  },
  // post请求  开通vip套餐
  MY_Vip_Open: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/vip/open',
  },

  // 统用页面和 数据 配置
  MY_PAGECONTENT_BY_ID: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/pageContent/getPageContentById',
  },

  // lf 2022/07/13 默认的应用的配置
  // /homePageConfig/user/noToken/defaultConfigs
  MY_NOTOKEN_DEFAULTCONFIGS: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/homePageConfig/user/noToken/defaultConfigs',
  },

  MY_HOMEPAGECONFIG_USER_DEFAULTCONFIGS: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/homePageConfig/user/defaultConfigs',
  },

  // lf 2022/07/13 更多配置
  // homePageConfig/user/allConfigs
  MY_HOMEPAGECONFIG_USER_ALLCONFIGS: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/homePageConfig/user/allConfigs',
  },
  MY_HOMEPAGECONFIG_USER_RESUMEDEFAULT: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/homePageConfig/user/resumeDefault',
  },
  SYS_USER_USERRANK: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/sys/user/userRank',
  },
  SYS_HOMEPAGECONFIG_USER_ADDCONFIG: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/homePageConfig/user/addConfig',
  },
  SYS_HOMEPAGECONFIG_USER_REDUCECONFIG: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/homePageConfig/user/reduceConfig',
  },
  SYS_SHAREPAPER_GETMYLIKEANDREWARD: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/sharePaper/getMyLikeAndReward',
  },
}
