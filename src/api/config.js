/**
 * 请求地址全部写在这里，定成常量，在各页面获取
 **/
import { paperMakerAPI } from './paperMaker'
import { paperCenterAPI } from './paperCenter'
import { questionAPI } from './questionDetail'
import { usersAPI } from './paperUsers'
import { selectAPI } from './selectionQuestion'
import { paperMyResource } from './paperMyResource'
import { paperSchool } from './paperSchool'
import { booksAPI } from './books'
import { activiyAPI } from './activity'
import { userTheme } from './userTheme'
import { plazaAPI } from './plaza'
import { commonAPI } from './commonApi'

// Export the BASE_URL
export const BASE_URL = import.meta.env.VITE_BASE_URL || '' // 测试服

// const URLINVOKE = import.meta.env.VITE_PAPER_GENERATOR + '/gateway/api/invoke' // 无需token,适用于登录、注册
const URLINVOKE = '/lesson-app/aaaaaaaaa' // 无需token,适用于登录、注册

const URLCALL = import.meta.env.VITE_PAPER_GENERATOR + '/api/call' // 需要token，适用于一般性接口

const URLLOGINLOG = import.meta.env.VITE_PAPER_GENERATOR + '/login'

// 请求路径

export const API = {
  ...paperMakerAPI,
  ...paperCenterAPI,
  ...questionAPI,
  ...selectAPI,
  ...usersAPI,
  ...paperMyResource,
  ...paperSchool,
  ...booksAPI,
  ...activiyAPI,
  ...userTheme,
  ...plazaAPI,
  ...commonAPI,
  // ------------------- 注册相关 ------------------------
  // 阿里云滑动验证
  ALIYUN_VERIFY: {
    baseURL: import.meta.env.VITE_PAPER_GENERATOR + '/api/invoke' ,
    urlPath: '/auth/ext/v1/register/aliyun/slide/verify',
    apiId: 100078,
  },
  // 注册_1生成并发送验证码
  VCODE: {
    baseURL: import.meta.env.VITE_PAPER_GENERATOR + '/api/invoke' ,
    urlPath: '/auth/ext/v1/register/vCode',
    apiId: 100059,
  },
  // 注册_2校验验证码
  VCODE_VALIDATE: {
    baseURL: import.meta.env.VITE_PAPER_GENERATOR + '/api/invoke' ,
    urlPath: '/auth/ext/v1/register/vcode-validate',
    apiId: 100060,
  },
  // 注册账户
  REGISTER: {
    baseURL: import.meta.env.VITE_PAPER_GENERATOR + '/api/invoke' ,
    urlPath: '/auth/ext/v1/register',
    apiId: 100062,
  },
  // ------------------- 登录相关 ------------------------
  // 登录_用户登录
  LOGIN: {
    baseURL: URLINVOKE,
    urlPath: '/auth/v1/ext/login',
    urlLocalPath: import.meta.env.VITE_PAPER_GENERATOR + '/login',
    apiId: 100050,
  },
  // 登录_生成uuid并返回给前端
  UUID: {
    baseURL: URLINVOKE,
    urlPath: '/auth/v1/ext/uuid',
    apiId: 100048,
  },
  // 登录_生成图形验证码
  CAPTCHA: {
    baseURL: URLINVOKE,
    urlPath: '/auth/v1/ext/captcha.jpg',
    apiId: 100049,
  },
  // 用户登出
  LOGOUT: {
    baseURL: URLCALL,
    urlPath: '/auth/ext/v1/logout',
    apiId: 100099,
  },
  // 发送手机验证码
  SENDVCODE: {
    baseURL: import.meta.env.VITE_PAPER_GENERATOR + '/api/invoke' ,
    urlPath: '/auth/v1/ext/mobile/send_vcode',
    apiId: 100362,
  },
  // 验证码登录
  VCODELOGIN: {
    baseURL: import.meta.env.VITE_PAPER_GENERATOR + '/api/invoke' ,
    urlPath: '/auth/ext/v1/mobile/vcode_login',
    apiId: 100363,
  },
  // 微信登录
  WECHATLOGIN: {
    baseURL: URLLOGINLOG,
    urlPath: '/auth/ext/v1/wechat/login',
    apiId: 100364,
  },
  // ------------------- 用户信息相关 ------------------------
  // 校验token有效期
  TOKEN_VERIFY: {
    baseURL: URLINVOKE,
    urlPath: '/auth/ext/v1/user/token/verify',
    apiId: 100082,
  },
  // 通过token获取用户基本信息
  BASIC_INFO_RETRIEVE: {
    baseURL: URLCALL,
    urlPath: '/auth/ext/v1/user/basic/info/retrieve',
    apiId: 100081,
  },
  // 单点登录验证兼获取用户信息
  GET_SSO_VERIFY: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/ssoVerify',
  },
  // 查询服务列表
  GET_SERVICE_LIST: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATORS + '/paperService/serviceSelect',
  },
  GET_ALL_VIPSERVICE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/sys/user/vipService',
  },
  // 激活账户
  SERVICE_ACTIVE_ACCOUNT: {
    urlPath: import.meta.env.VITE_PAPER_GENERATORS + '/user/activateAccount',
  },
  // 修改默认服务
  SERVICE_DEFAULT: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATORS + '/paperService/defaultServer',
  },
  // 查询默认学科信息
  GET_DEFAULT_SUBJECT: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/index/getDefaultSubject',
  },
  // 更新默认学科信息
  UPDATE_DEFAULT_SUBJECT: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/index/addDefaultSubject',
  },
  // 查询默认学科信息
  GET_CONFIG_SUBJECT: {
    urlPath: import.meta.env.VITE_PAPER_GENERATORS + '/config/detail',
  },
  // 查询学科及教材信息
  GET_USER_SUBJECT: {
    baseURL: URLINVOKE,
    httpMethod: 2,
    urlPath: '/user/v1/ext/user/usersubject/query',
    apiId: 100176,
  },
  // 修改 用户信息
  POST_MODIFY_USERINFO: {
    baseURL: URLINVOKE,
    httpMethod: 1,
    urlPath: '/user/ext/v1/user/update-user-info',
    apiId: 100539,
  },
  // ------------------- 字典相关 ------------------------
  // 获取字典任意几级数据
  GET_DICT_BY_LEVEL: {
    baseURL: URLINVOKE,
    urlPath: '/cfg-dict/biz/v1/dictionaryapi/get-dict-by-level',
    apiId: 100085,
  },
  /*
   * 通过字典CODE获取该CODE下面所有子级数据
   * @param categoryId->分组类别id(查大分类时传)
   * @param code->字典数据配置编号id(为唯一id不重复的编号)(查子级的下级传)
   * @param level->需要查询的层级,多个层级用逗号隔开
   */
  GET_DICT_ARBITRARILY_DICTID: {
    baseURL: URLINVOKE,
    urlPath: '/cfg-dict/v1/biz/dictionaryapi/get-arbitrarily-dict',
    apiId: 100395,
  },
  /*
   * 获取根节点下的子节点信息列表
   * @param categoryId->分组类别id(查大分类时传)
   * @param dictId->字典数据配置编号id(为唯一id不重复的编号)(查子级的下级传)
   */
  GET_DICT_BY_DICTID: {
    baseURL: URLINVOKE,
    urlPath: '/cfg-dict/v1/biz/dictionaryapi/get-dict-by-dictid',
    apiId: 100012,
  },
  /*
   * 根据categoryId获取根节点下所有的子节点
   * @param categoryId->分组类别id(查大分类时传)
   */
  GET_ALL_BY_CID: {
    baseURL: URLINVOKE,
    urlPath: '/cfg-dict/biz/v1/dictionaryapi/list-all-dicts',
    apiId: 100084,
  },
  /*
   * 根据dictId获取字典信息详情
   * @param dictId->字典数据配置编号id(为唯一id不重复的编号)(查子级的下级传)
   */
  GET_DICT_BY_DICTDETAIL: {
    baseURL: URLINVOKE,
    urlPath: '/cfg-dict/v1/biz/dictionaryapi/get-dict-by-dictid',
    apiId: 100008,
  },
  /*
   * 根据codes获取字典数据以及父级数据
   * @param categoryId->分组类别id(查大分类时传)
   * @param code->字典数据配置编码
   * @param level->层级
   */
  GET_PARENT_DICT: {
    baseURL: URLINVOKE,
    urlPath: '/cfg-dict/v1/biz/dictionaryapi/get-parent-dict',
    apiId: 100006,
  },
  /*
   * 根据code获取字典数据以及子级信息
   * @param categoryId->分组类别id(查大分类时传)
   * @param code->字典数据配置编码
   */
  GET_CHILD_DICT: {
    baseURL: URLINVOKE,
    urlPath: '/cfg-dict/v1/biz/dictionaryapi/get-child-dict',
    apiId: 100007,
  },
  // ------------------- 文档上传相关 ------------------------
  UPLOAD_BATCH: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/oss/file/upload/batch',
  },
  GET_CODE_LIKE_NAME: {
    baseURL: URLINVOKE,
    urlPath: '/cfg-dict/v1/biz/dictionaryapi/get-code-like-name',
    apiId: 100214,
  },
  // 根据cid 和 codes 获取names
  GET_NAME_BY_CODES: {
    baseURL: URLINVOKE,
    urlPath: 'cfg-dict/biz/v1/dictionaryapi/get-name-by-codes',
    apiId: 100100,
  },
  GET_AUDIOS_DATA: {
    baseURL: URLINVOKE,
    urlPath: '/videos/api/v1/queryAudiosData',
    apiId: 100386,
  },
  GET_AUDIOS_DATA_DEV: {
    baseURL: URLINVOKE,
    urlPath: '/videos/v2/ext/vod/get-resource-detail',
    apiId: 101414,
  },
  // 获取知识点集合
  GET_LISTKNOWLEDGE: {
    baseURL: URLINVOKE,
    urlPath: '/books/chapterKnowledge/listKnowledge',
    apiId: 100168,
  },
  // 教师组卷上传保存
  APPID_SYNCUPLOADFILE: {
    baseURL: URLINVOKE,
    urlPath: '/cloudprint/teacher/grouppaper/sync-upload-file',
    apiId: 101598,
  },
  // 微信小程序获取 二维码
  wxCodeLogin: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/sys/user/wxCodeLogin',
  },
  queryWxCodeTick: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/sys/user/queryWxCode',
  },
  CONFIG_ADDCHOOSECONFIG: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/sys/user/addChooseConfig',
  },
  // 首页
  PAGEINDEX_BANNER_LIST: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/banner/getIndexBannerList',
  },
  PAGEINDEX_VIDEO_LIST: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/banner/getIndexVideoList',
  },
  //  互动广场
  PAGE_MYTALK_COMMENTCOLLECT: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/myActivityTalk/getMyTalkCommentCollectPage',
  },
  PAGE_GET_TALKCOLLECT_PAGE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/myActivityTalk/getMyActivityTalkCollectPage',
  },

  PAGE_GETMYTALK_COMMENTPAGE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/myActivityTalk/getMyTalkCommentPage',
  },
  PAGE_GET_MYTALKS: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/myActivityTalk/getMyTalks',
  },
  PAGE_DELETE_MYTALK: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/myActivityTalk/deleteMyTalk',
  },

  PAGE_MY_COMMENTLIST: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/greatQuestionComment/myCommentList',
  },

  PAGE_DEL_MYCOMMENT: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/myActivityTalk/delMyTalkComment',
  },

  PAGE_EDIT_ACTIVITYTALK: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/activityTalk/editActivityTalk',
  },

  PAGE_GET_LABELS: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/activityTalk/getFrontEndLabels',
  },

  PAGE_GET_MYTALK_DETAIL: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/myActivityTalk/getMyTalkDetail',
  },
  PAGE_DEL_ACTIVITY_COLLECT: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/myActivityTalk/delMyActivityTalkCollect',
  },

  PAGE_DEL_TALK_COLLECT: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/myActivityTalk/delMyTalkCommentCollect',
  },
  PAGE_MY_QUESTIONLIST: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/greatQuestionRecommend/myGreatQuestionList',
  },
  PAGE_MY_RECOMMEND_TOHIDE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/greatQuestionRecommend/toHide',
  },

  PAGE_MYLIKE_LIST: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/greatQuestionLike/myLikeList',
  },
  PAGE_EDIT_QUESTION: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/greatQuestionRecommend/editGreatQuestion',
  },

  PAGE_GETTALK_LIKEPAGE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/myActivityTalk/getTalkCommentLikePage',
  },

  PAGE_DEL_TALCOMMENT: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/myActivityTalk/delTalkCommentLike',
  },

  PAGE_MYCOMMENT_LIST: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/greatQuestionComment/myCommentList',
  },
  PAGE_DEL_GREATQUE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/greatQuestionRecommend/delGreatQue',
  },
  PAGE_DEL_COMMENT: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/greatQuestionComment/delComment',
  },
  PAGE_CANCEL_LIKE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/greatQuestionLike/cancelLike',
  },
  PAGE_CANCLE_NEWSTATE: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/greatQuestionRecommend/cancleNewState',
  },
  PAGE_USER_QUERY_MSGLIST: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/userMessage/queryMsgList',
  },
  PAGE_EXCHANGE_GOODS: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/exchange/store/exchangeGoods',
  },

  PAGE_READALL_NEWMSG: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/userMessage/readAllNewMsg',
  },
  PAGE_ISRECEIVE_NEWMSG: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/userMessage/isReceiveNewMsg',
  },

  PAGE_FILL_RECEIVEINFO: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/luckDraw/fillReceiveInfo',
  },

  PAGE_COLLECT_UPLOAD: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR + '/collectUploadInfo/uploadResource',
  },

  PAGE_QUERY_UPLOAD_LIST: {
    urlPath:
      import.meta.env.VITE_PAPER_GENERATOR +
      '/collectUploadInfo/queryUploadList',
  },

  PAGE_COLLECT_TASK_LIST: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/collectTask/list',
  },

  PAGE_COLLECT_TASK_INFO: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/collectTask/info',
  },

  UPLOAD_COLLECT_RESOURCE: {
    urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/collectUploadInfo/uploadCollectResource',
  },
  

}
