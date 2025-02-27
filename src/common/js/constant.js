const constant = {
  /* eslint-disable */
  phoneReg: /^1[3456789]{1}\d{9}$/,
  // phoneReg: /^0{0,1}(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]|19[0-9])[0-9]{8}$/,
  // /^1\d{10}$/  phoneRe: /^1[3456789]{1}\d{9}$/;
  emilReg:
    /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
  accountReg:
    /^1(3|4|5|7|8)\d{9}|([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/,
  vfcodeReg: /^[0-9$%]{4}$/i,
  passwordReg: /^[a-zA-Z0-9$%]{6,18}$/i,
  nameReg: /^([a-zA-Z\u4e00-\u9fa5])[a-zA-Z0-9_\u4e00-\u9fa5\s]+$/,
  urlReg:
    /^(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?$/,
  searchNameReg:
    /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]·！#￥（——）：；“”‘、，|《。》？、【】[\]]/,
  inputNameReg: /[`~!@#$%^&*+=|\\\\<>/?~！@#￥%……&*+|【】‘”“’？]/,
  bookNameReg:
    /^[a-zA-Z0-9_+\u4e00-\u9fa5\d\.、\◎*：，”“·()（）《》【】\_\-——\-]+$/, // ◎*：，”“·（）——《》
  scoreReg: /^\d+$/, // 正整数 + 0
  /* eslint-enable */
  SUCCESS_CODE: 200,
  PARAMS_ERROR_CODE: -1,
  AUTH_TOKEN_ERROR_CODE: 401,
  AUTH_FORBID_ERROR_CODE: 402,
  AUTH_AUTH_ERROR_CODE: 403, // vip 功能没有权限了 需要弹出 vip 服务框
  AUTH_AUTH_ERROR_SPECIAL_CODE: 405, // vip 显示特殊的msg
  AUTH_AUTH_PAGE_ERROR: 406, // 页面没有全都回到首页去
  AUTH_TOKEN_OVER_CODE: 10010,
  AUTH_TOKEN_CALLBACK_CODE: 10012,
  SYSTEM_ERROR_CODE: 500,
  TOKEN:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyR3VpZCI6IlZsWlpkVWhGTDBWa2NuVmlSVzFtTDJGbU5VVm1RVDA5IiwiZXhwIjoxNjg5MDQ3NDk5fQ.g6bqULsBV5fJ6UxJ_pEyp-G_RscNEX5ePsucRIx_4Ss',
  allowedContent:
    'hr[*]{*}(*);a[*]{*}(*);img[*]{*}(*);div[*]{*}(*);table[*]{*}(*);tbody[*]{*}(*);tr[*]{*}(*);td[*]{*}(*);ul[*]{*}(*);li[*]{*}(*);span[*]{*}(*);point2;br;brack;fill;longFill;cloze;tab;strong;b;em;i;u;s;strike;sub;sup',
  // TOKEN: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyR3VpZCI6IllUVldUMWRXVFRoNU9Xa3lRMmgxWVdkclZsSnZVVDA5IiwiZXhwIjoxNjExNjI5MzM2fQ.AYIj5lwBYqXvCYR0zb7KXu9DCa2H7-8HH5DPcBujT2g'
}
const cfgDict = {
  // ------------------- 全品AI教研云应用常量 ------------------------
  appId: 1000031,
  appIdEnc: '87693803f09b06eb',
  // ------------------- 用户基础数据 ------------------------
  // 学段年级
  CID_USER_PERIOD_GRADE: 100200,
  // 学段学科
  CID_USER_PERIOD_SUBJECT: 100205,
  // 地区信息
  CID_USER_AREA: 100016,
  // ------------------- 图书属性 ------------------------
  // 图书版本
  CID_BOOK_VERSION: 100174,
  // 图书年份
  CID_BOOK_YEARS: 100172,
  // 图书季节
  CID_BOOK_SEASON: 100171,
  // 图书品类
  CID_BOOK_CATEGORY: 100170,
  // 学段学科-图书品类
  CID_PS_BOOK_CATEGORY: 100306,
  // 图书类型
  CID_BOOK_TYPE: 100169,
  // 图书册别
  CID_BOOK_VOLUME: 100168,
  // 学段 学科 图书 类型
  CID_DIGITAL_BOOK_TYPES: 100445,
  // ------------------- 试卷属性 ------------------------
  // 学段-试卷类型
  CID_PAPER_PERIOD_TYPE: 100180,
  // 使用年份
  CID_PAPER_YEARS: 100208,
  // 试题年份
  CID_QUESTION_YEARS: 100209,
  // ------------------- 题目属性 ------------------------
  // 学段学科跟题目类型关联
  CID_QUESTION_STRUCTURE: 100182,
  // 学段学科跟题目类型关联
  CID_QUESTION_PERIOD_SUBJECT_TYPE: 100185,
  // 学段学科跟题目来源关联
  CID_QUESTION_PERIOD_SUBJECT_SOURCE: 100196,
  // 题目预估难度
  CID_QUESTION_DIFF: 100186,
  // 初中题目来源
  CID_QUESTION_SOURCE: 100195,
  // 试题报错类型
  CID_QUESTION_ERROR_TYPE: 100372,
  // ------------------- 知识点属性 ------------------------
  // 学段学科跟知识点关联
  CID_KNOWLEDGE_PERIOD_SUBJECT: 100198,
  // ------------------- 教材相关属性 ------------------------
  // 学段-学科-版本-年级-册
  CID_COURSEBOOKS_VERSION: 100201,

  // ------------------- 试题结构相关 ------------------------
  questionStructure: {
    11: {
      code: 11,
      name: '单选题',
      template: 'radio-temp',
      mulit: false,
      identical: false,
      hearing: false,
    },
    12: {
      code: 12,
      name: '多选题',
      template: 'mulchoice-temp',
      mulit: false,
      identical: false,
      hearing: false,
    },
    13: {
      code: 13,
      name: '填空题',
      template: 'filling-temp',
      mulit: false,
      identical: false,
      hearing: false,
    },
    14: {
      code: 14,
      name: '判断题',
      template: 'judge-temp',
      mulit: false,
      identical: false,
      hearing: false,
    },
    15: {
      code: 15,
      name: '简答题',
      template: 'short-answer-temp',
      mulit: false,
      identical: false,
      hearing: false,
    },
    16: {
      code: 16,
      name: '多题综合类',
      template: 'integrated-temp',
      mulit: true,
      identical: false,
      hearing: false,
    },
    17: {
      code: 17,
      name: '多题综合类（同一知识点）',
      template: 'integrated-temp',
      mulit: true,
      identical: true,
      hearing: false,
    },
    18: {
      code: 18,
      name: '解答题',
      template: 'short-answer-temp',
      mulit: false,
      identical: false,
      hearing: false,
    },
    19: {
      code: 19,
      name: '听力多题',
      template: 'integrated-temp',
      mulit: true,
      identical: true,
      hearing: true,
    },
    20: {
      code: 20,
      name: '听力单题-填空题',
      template: 'filling-temp',
      mulit: false,
      identical: false,
      hearing: true,
    },
    21: {
      code: 21,
      name: '听力单题-判断题',
      template: 'judge-temp',
      mulit: false,
      identical: false,
      hearing: true,
    },
    22: {
      code: 22,
      name: '听力单题-选择题',
      template: 'radio-temp',
      mulit: false,
      identical: false,
      hearing: true,
    },
    23: {
      code: 23,
      name: '完形填空',
      template: 'cloze-filling-temp',
      mulit: true,
      identical: true,
      hearing: false,
    },
    24: {
      code: 24,
      name: '综合类填空',
      template: 'synthetical-filling-temp',
      mulit: true,
      identical: true,
      hearing: false,
    },
    25: {
      code: 25,
      name: '七选五类',
      template: 'choice-sevens-temp',
      mulit: true,
      identical: true,
      hearing: false,
    },
    26: {
      code: 26,
      name: '作文',
      template: 'short-answer-temp',
      mulit: false,
      identical: false,
      hearing: false,
    },
    27: {
      code: 27,
      name: '选择填充题',
      template: 'filling-choice-temp',
      mulit: false,
      identical: false,
      hearing: false,
    },
    28: {
      code: 28,
      name: '四选二类',
      template: 'choice-four-temp',
      mulit: false,
      identical: false,
      hearing: false,
    },
    30: {
      code: 30,
      name: '改错模板',
      template: 'short-answer-temp',
      mulit: false,
      identical: false,
      hearing: false,
    },
    31: {
      code: 31,
      name: '同类选择题模板',
      template: 'cloze-filling-temp',
      mulit: true,
      identical: true,
      hearing: false,
    },
    32: { code: 32, name: '听力模版2', template: 'short-answer-temp', mulit: false, identical: false, hearing: true },
    33: { code: 33, name: '听力多小题模版', template: 'integrated-temp', mulit: true, identical: false, hearing: true }
  },
  questionShowPart: {
    // [hearing听力, stem题干,opt选项,child子试题，answer答案a，analysis解析ay，attr属性at]
    // ant答案渲染模式:0获取没有：(1,普通 ,单选择)(2:填空（备选 答案）)(3：判断题)（4，多选 至少2-4）
    // some 统一知识点 attribute 放在 tag中
    // nochStem 1:小题 没有题干 :完形填空  -比如 7选5类 2:没有题干 和选项 只有答案
    // nocha：小题没有 标定属性
    // opt选项:o ,answer答案:a  0：不需要选项 和答案  1：需要选项和答案 2：根据 seven_answer seven_option 的选项和答案数量
    // 0 不显示 1：显示 2：(条件显示 level==1) 3:(条件显示 level!=1)
    // nns: not need stem :1，自己的内容 不验证 题干和 选项 答案
    11: { name: '单选题', h: 0, s: 1, o: 1, c: 0, a: 1, ay: 1, at: 1 },
    12: { name: '多选题', h: 0, s: 1, o: 1, c: 0, a: 1, ay: 1, at: 1, ant: 4 },
    13: { name: '填空题', h: 0, s: 1, o: 0, c: 0, a: 1, ay: 1, at: 1, ant: 2 },
    14: { name: '判断题', h: 0, s: 1, o: 0, c: 0, a: 1, ay: 1, at: 1, ant: 3 },
    15: { name: '简答题', h: 0, s: 1, o: 0, c: 0, a: 1, ay: 1, at: 1 },
    16: {
      name: '多题综合类',
      h: 0,
      s: 1,
      nns: 1,
      o: 0,
      c: 1,
      a: 0,
      ay: 0,
      at: 0,
    },
    17: {
      name: '多题综合类（同一知识点）',
      nns: 1,
      h: 0,
      s: 1,
      o: 0,
      c: 1,
      a: 0,
      ay: 0,
      at: 2,
      some: 1,
    },
    18: { name: '解答题', h: 0, s: 1, o: 0, c: 0, a: 1, ay: 1, at: 1 },
    19: {
      name: '听力题',
      h: 1,
      s: 1,
      nns: 1,
      o: 0,
      c: 1,
      a: 0,
      ay: 0,
      at: 2,
      nochStem: 1,
      some: 1,
    },
    20: {
      name: '听力单题-填空题',
      h: 0,
      s: 1,
      o: 0,
      c: 0,
      a: 1,
      ay: 1,
      at: 1,
      ant: 2,
    },
    21: { name: '听力单题-判断题', h: 0, s: 1, o: 0, c: 0, a: 1, ay: 1, at: 1 },
    22: { name: '听力单题-选择题', h: 0, s: 1, o: 1, c: 0, a: 1, ay: 1, at: 1 },
    23: {
      name: '完形填空',
      h: 0,
      s: 1,
      o: 0,
      c: 1,
      a: 0,
      ay: 0,
      at: 2,
      nochStem: 1,
      some: 1,
    },
    24: {
      name: '综合类填空',
      h: 0,
      s: 1,
      o: 0,
      c: 1,
      a: 0,
      ay: 0,
      at: 2,
      nochStem: 2,
      some: 1,
    },
    25: {
      name: '7选5类',
      h: 0,
      s: 1,
      o: 1,
      c: 1,
      a: 0,
      ay: 0,
      at: 2,
      nochStem: 2,
      some: 1,
    },
    26: { name: '作文', h: 0, s: 1, o: 0, c: 0, a: 1, ay: 1, at: 1 },
    27: {
      name: '选择填充题',
      h: 0,
      s: 1,
      o: 1,
      c: 0,
      a: 1,
      ay: 1,
      at: 1,
      ant: 2,
    },
    28: {
      name: '四选二类',
      h: 0,
      s: 1,
      o: 1,
      c: 0,
      a: 1,
      ay: 1,
      at: 1,
      ant: 2,
    },
    29: {
      name: '单词辨音模板',
      h: 0,
      s: 1,
      o: 0,
      c: 0,
      a: 1,
      ay: 1,
      at: 1,
      ant: 2,
    },
    30: { name: '改错模板', h: 0, s: 1, o: 0, c: 0, a: 1, ay: 1, at: 1 },
    31: {
      name: '同类选择题模板',
      h: 0,
      s: 1,
      o: 0,
      c: 1,
      a: 0,
      ay: 1,
      at: 2,
      nochStem: 1,
      some: 1,
    },
    32: { name: '听力题-解答题', h: 1, s: 1, o: 0, c: 0, a: 1, ay: 1, at: 1, ant: 1 },
    33: { name: '听力题', h: 1, s: 1, nns: 1, o: 0, c: 1, a: 0, ay: 0, at: 0, nochStem: 1 }
  },
  //  渲染 可能 有分析的 题目结构 23，24，25
  analysisQuesConfig: [16, 17, 23, 24, 25],
  // 图书背景
  bookCoverConfig: {
    1111: {
      bgUrl: '1.png',
      color: '#F5AC5B',
    },
    1112: {
      bgUrl: '2.png',
      color: '#A7C041',
    },
    1113: {
      bgUrl: '3.png',
      color: '#77B7E5',
    },
    1114: {
      bgUrl: '4.png',
      color: '#E3A0BF',
    },
    1115: {
      bgUrl: '5.png',
      color: '#ABABFF',
    },
    1116: {
      bgUrl: '6.png',
      color: '#80A4FF',
    },
    1216: {
      bgUrl: '1.png',
      color: '#F5AC5B',
    },
    1217: {
      bgUrl: '2.png',
      color: '#A7C041',
    },
    1218: {
      bgUrl: '3.png',
      color: '#77B7E5',
    },
    1219: {
      bgUrl: '4.png',
      color: '#E3A0BF',
    },
    1341: {
      bgUrl: '1.png',
      color: '#F5AC5B',
    },
    1342: {
      bgUrl: '2.png',
      color: '#A7C041',
    },
    1343: {
      bgUrl: '3.png',
      color: '#77B7E5',
    },
    1344: {
      bgUrl: '4.png',
      color: '#E3A0BF',
    },
    1345: {
      bgUrl: '5.png',
      color: '#ABABFF',
    },
    1346: {
      bgUrl: '6.png',
      color: '#80A4FF',
    },
    1347: {
      bgUrl: '1.png',
      color: '#F5AC5B',
    },
    1348: {
      bgUrl: '2.png',
      color: '#A7C041',
    },
    1349: {
      bgUrl: '3.png',
      color: '#77B7E5',
    },
    1350: {
      bgUrl: '4.png',
      color: '#E3A0BF',
    },
    1351: {
      bgUrl: '5.png',
      color: '#ABABFF',
    },
    1352: {
      bgUrl: '6.png',
      color: '#80A4FF',
    },
    1353: {
      bgUrl: '1.png',
      color: '#F5AC5B',
    },
    1354: {
      bgUrl: '2.png',
      color: '#A7C041',
    },
    1355: {
      bgUrl: '3.png',
      color: '#77B7E5',
    },
    1356: {
      bgUrl: '4.png',
      color: '#E3A0BF',
    },
    1357: {
      bgUrl: '5.png',
      color: '#ABABFF',
    },
    1358: {
      bgUrl: '6.png',
      color: '#80A4FF',
    },
    1359: {
      bgUrl: '1.png',
      color: '#F5AC5B',
    },
    1360: {
      bgUrl: '2.png',
      color: '#A7C041',
    },
  },
  paperDiffList: [
    {
      name: '全部',
      code: '',
    },
    {
      name: '基础',
      code: '6',
    },
    {
      name: '提升',
      code: '3',
    },
    {
      name: '拔高',
      code: '7',
    },
    // {
    //   name: '易',
    //   code: '1',
    // },
    // {
    //   name: '较易',
    //   code: '2',
    // },
    // {
    //   name: '中等',
    //   code: '3',
    // },
    // {
    //   name: '较难',
    //   code: '4',
    // },
    // {
    //   name: '难',
    //   code: '5',
    // },
    // {
    //   name: '基础',
    //   code: '6',
    // },
    // {
    //   name: '拔高',
    //   code: '7',
    // },
  ],
  goodsSourceType: {
    1: '积分兑换',
    2: '抽奖',
    3: '等级奖励',
    4: '任务奖励',
    5: '小程序邀新奖励',
    6: '反馈奖励',
    7: '促销活动',
    8: '分享奖励',
    10: '其他',
  },
}

export default {
  constant,
  cfgDict,
}
