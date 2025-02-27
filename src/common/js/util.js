/* eslint-disable */
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js'
import { scrollIt } from './scrollIt.js'
// import CTS from '@/common/js/constant'
import axios from 'axios'
// import { copyLayoutParams } from 'echarts/lib/util/layout'
import {
  examPaperTypeConfig,
  middleExamConfig,
  stageEntranceTestConfig,
} from '@/common/config/tikuCfg'
var examPaperTypeDict = {}
function initData() {
  let dict = {}
  examPaperTypeConfig.forEach((item) => {
    dict[item.id] = item
  })
  examPaperTypeDict = dict
}

initData()

// 判断数据是否是指定的类型
export const isDataType = (constructor, value) => {
  return (
    Object.prototype.toString.call(value) ===
    '[object ' + constructor.name + ']'
  )
}
// token键名
const TokenKey = 'CANPOINTTOKEN'
const Domain = import.meta.env.VITE_DOMAIN
const UrlKey = 'URLTOKEN'
const EncryptKey = 'RrLn$MIsImV4cCI6MTU3NjE0NTE8UtLd'

// 获取token值
export const getToken = () => {
  // if (import.meta.env.NODE_ENV === 'development') {
  //   return CTS.constant.TOKEN
  // } else {
  //   return Cookies.get(TokenKey) ? Cookies.get(TokenKey) : ''
  // }
    return Cookies.get(TokenKey) ? Cookies.get(TokenKey) : ''
  }

// 设置token值
export const setToken = (token, expires) => {
  Cookies.set(TokenKey, token, {
    expires: expires,
    // domain: Domain,
  })
}

// 删除token值
export const removeToken = () => {
  return Cookies.remove(TokenKey, {
    path: '/',
    // domain: Domain,
  })
  // return new Promise((resolve, reject) => {
  //   Cookies.remove(TokenKey, { path: '/', domain: 'canpoint.cn' })
  //   resolve()
  // })
}

// 设置cookies值
export const setCookie = (key, value, expires = 7) => {
  Cookies.set(key, value, {
    expires: expires,
    // domain: Domain,
  })
}

// 获取cookies值
export const getCookie = (key) => {
  return Cookies.get(key)
}

// 删除cookie值
export const removeCookie = (key) => {
  Cookies.remove(key, {
    path: '/',
    // domain: Domain,
  })
}

// 判断用户是否登录
export const isLogin = () => {
  // console.log(!!getToken())
  return !!getToken()
}

// 获取cookie中url
export const getUrlToken = () => {
  return Cookies.get(UrlKey)
}

// 储存当前url到cookie
export const setUrlToken = (url, expires) => {
  Cookies.set(UrlKey, url, {
    expires: expires,
    // domain: Domain,
  })
}

// 删除cookie中url值
export const removeUrlToken = () => {
  return Cookies.remove(UrlKey, {
    path: '/',
    // domain: Domain,
  })
}

// 存储localStorage
export const setStore = (key, value) => {
  if (!key) {
    return
  }
  if (typeof value !== 'string') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

// 获取localStorage
export const getStore = (key) => {
  if (!key) {
    return true
  } else {
    return window.localStorage.getItem(key)
      ? window.localStorage.getItem(key)
      : ''
  }
}

// 删除localStorage
export const removeStore = (key) => {
  if (!key) {
    return
  }
  window.localStorage.removeItem(key)
}

// 存储sessionStorage
export const setSessionStore = (key, value) => {
  if (!key) {
    return
  }
  if (typeof value !== 'string') {
    value = JSON.stringify(value)
  }
  window.sessionStorage.setItem(key, value)
}

// 获取sessionStorage
export const getSessionStore = (key) => {
  if (!key) {
    return true
  } else {
    return window.sessionStorage.getItem(key)
      ? window.sessionStorage.getItem(key)
      : ''
  }
}

// 删除sessionStorage
export const removeSessionStore = (key) => {
  if (!key) {
    return
  }
  window.sessionStorage.removeItem(key)
}
// 判断是否为空对象
export const isEmptyObject = (obj, key) => {
  if (obj === null || obj === undefined) {
    return '-'
  }
  const arr = Object.keys(obj)
  if (arr.length > 0) {
    return obj[key]
  } else {
    return '-'
  }
}

/**
 * 获取题目id，拼接
 */
export function reQuids(list, checkName) {
  let arr = JSON.parse(list)
  let str = []
  arr.forEach((value) => {
    str.push(value[checkName])
  })
  return str.join(',')
}

/**
 * 获取题目题目的父级
 */
export function getSimpleCheckedNodes(store) {
  const checkedNodes = []
  const traverse = function (node) {
    const childNodes = node.root ? node.root.childNodes : node.childNodes
    childNodes.forEach((child) => {
      if (child.checked) {
        checkedNodes.push(child.data)
      }
      if (child.indeterminate) {
        traverse(child)
      }
    })
  }
  traverse(store)
  return checkedNodes
}

// 加密
export const encrypt = (word) => {
  const key = CryptoJS.enc.Utf8.parse(EncryptKey)
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.ciphertext.toString()
}

// 解密
export const decrypt = (word) => {
  if (!word) return ''
  const SecretKey = 'los5fbab8de7df9b1af1b1784f649893'
  // const key = CryptoJS.enc.Utf8.parse(EncryptKey)
  // let srcs = CryptoJS.format.Hex.parse(word)
  // const decrypt = CryptoJS.AES.decrypt(srcs, key, {
  //   mode: CryptoJS.mode.ECB,
  //   padding: CryptoJS.pad.Pkcs7,
  // })
  // return CryptoJS.enc.Utf8.stringify(decrypt).toString()
  // const data = CryptoJS.enc.Base64.parse(word)
  // console.log('data: ', data);
  const key = CryptoJS.enc.Utf8.parse(SecretKey);
  const iv = CryptoJS.enc.Utf8.parse(SecretKey);
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Base64.parse(word) },
    key,
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    }
  );
  return CryptoJS.enc.Utf8.stringify(decrypted).toString();
}

/**
 * 捕获异常，传递给后端
 * @param {any} value 接口的返回值
 */
export const catchException = (value) => {
  const setParams = JSON.parse(value)
  let params = {
    appId: 1000031,
    code: setParams.data.code,
    msg: setParams.data.msg,
    httpMethod: setParams.config.method,
    url: setParams.config.url,
    params: JSON.stringify(setParams.config.params),
    status: 2,
    errorForm: 'FRONTEND',
  }
  let url = import.meta.env.VITE_BASE_URL
    ? import.meta.env.VITE_BASE_URL
    : '//39.105.153.115:8080'
  axios
    .post(url + '/log/exception/insert', params, {
      headers: {
        CANPOINTTOKEN: setParams.config.headers.CANPOINTTOKEN,
      },
    })
    .then((obg) => { })
}

/**
 * 判断数据是否是指定的类型
 * @param {Function} constructor 构造函数
 * @param {any} value 需要判断的值
 */
export const is = (constructor, value) => {
  return (
    Object.prototype.toString.call(value) ===
    '[object ' + constructor.name + ']'
  )
}

export const isEmptyStr = (str) => {
  if (!str) {
    return true
  }
  if (str.match(/^[ ]*$/)) {
    return true
  } else {
    return false
  }
}

export const getDigitalChinese = (digital) => {
  let numchars = '一二三四五六七八九十'
  digital = parseInt(digital)
  if (isNaN(digital)) {
    return '一'
  }
  if (digital <= 0) {
    digital = 1
  } else if (digital >= 100) {
    digital = 100
  }
  if (digital <= 10) {
    return numchars[digital - 1]
  } else if (digital < 20) {
    let unitChar = digital % 10
    // let decadeChar = parseInt(digital / 10)
    return '十' + numchars[unitChar - 1]
  } else if (digital < 100) {
    let unitChar = digital % 10
    let decadeChar = parseInt(digital / 10)
    return numchars[decadeChar - 1] + '十' + numchars[unitChar - 1]
  } else {
    return '一百'
  }
}

export const ScrollIt = scrollIt

export function HTMLDecode(text) {
  var temp = document.createElement('div')
  temp.innerHTML = text
  var output = temp.innerText || temp.textContent
  temp = null
  return output
}
// 参数 合并
export function combinParams(strParams) {
  if (strParams) {
    let valueKey = []
    for (let key in strParams) {
      if (key !== 'token') {
        valueKey.push(strParams[key])
      }
    }
    return valueKey.join('_')
  } else {
    return ''
  }
}

// 获取 对象的 top left 和 宽高
export function getElementXyHw(obj) {
  var xy = obj.getBoundingClientRect()
  // var top = xy.top - document.documentElement.clientTop + document.documentElement.scrollTop // document.documentElement.clientTop 在IE67中始终为2，其他高级点的浏览器为0
  var top = xy.top
  var bottom = xy.bottom
  // var left = xy.left - document.documentElement.clientLeft + document.documentElement.scrollLeft // document.documentElement.clientLeft 在IE67中始终为2，其他高级点的浏览器为0
  var left = xy.left
  var right = xy.right
  var width = xy.width || right - left // IE67不存在width 使用right - left获得
  var height = xy.height || bottom - top

  return {
    top: top,
    right: right,
    bottom: bottom,
    left: left,
    width: width,
    height: height,
  }
}

// 相加后 小数处理 0.1+0.1+0.1 = 0.300000004
export function dealDecimal(figure, digit) {
  let indexNum = Math.pow(10, digit)
  let results = Math.floor(figure * indexNum + 0.0000006)
  return results / indexNum
}

// quesiton to answer sheet
function getOptionsLength(ques) {
  if (
    ques &&
    ques.context &&
    ques.context.options &&
    ques.context.options.length
  ) {
    return ques.context.options.length
  } else {
    return 4
  }
}
export function question2AnswerSheet(quesList, isEnglish = false) {
  let questionlist = []
  for (let ques of quesList) {
    let code = ques.quesStruct.code
    // 如果是 7选5 完型填空 阅读理解 拆分多小题
    if (['23', ',24', '25'].indexOf(code) != -1) {
      for (let sub of ques.children) {
        if (code == '25') {
          questionlist.push({
            code: code,
            option: getOptionsLength(ques),
          })
        } else {
          questionlist.push({
            code: code,
            option: getOptionsLength(sub),
          })
        }
      }
    } else {
      // 多选 单选
      if (['11', '12'].indexOf(code) != -1) {
        questionlist.push({
          code: code,
          option: getOptionsLength(ques),
        })
      } else if (code == '26' && isEnglish) {
        questionlist.push({
          code: code + 'y',
        })
      } else {
        questionlist.push({
          code: code,
        })
      }
    }
  }
  let realQues = []
  // 合并 试题
  let oldSub = null
  questionlist.forEach((item, index) => {
    if (
      oldSub &&
      oldSub.code == item.code &&
      oldSub.option == item.option &&
      ['11', '12', '13', '14', '23', ',24', '25'].indexOf(item.code) != -1
    ) {
      oldSub.num++
    } else {
      oldSub = item
      oldSub.start = index + 1
      oldSub.num = 1
      realQues.push(oldSub)
    }
  })
  // 解析试题
  let results = realQues.map((item) => {
    if (item.option) {
      return [item.code, item.num, item.start, item.option].join('_')
    } else {
      return [item.code, item.num, item.start].join('_')
    }
  })

  return results.join(',')
}

// 通过学科学段 年级获取 图书封面地址
export function getBookCover(subjectCode, bgUrl) {
  return (
    import.meta.env.VITE_STATIC_FILE + '/img/stb/' + subjectCode + '/' + bgUrl
  )
}

// 经常 有多个 请求的时候 有时候 拿不到最新的请求数据 整的很烦知道吗
// 选用此方法进行打断 你再也不用烦恼了
export function fetchWithAbort(fetchPromise) {
  let abort = null
  const abortPromise = new Promise((resolve, reject) => {
    abort = () => {
      // eslint-disable-next-line
      reject('abort')
      console.log('=== fetchWithAbort abort ===')
    }
  })
  let promiseWithAbort = Promise.race([fetchPromise, abortPromise])
  promiseWithAbort.abort = abort
  return promiseWithAbort
}

// 根据key 查询数组数据 并且返回
export function ArrayExtentFind(list, key, value) {
  list = list || []
  key = key || 'id'
  value = value || ''
  return list.find((item) => item[key] == value)
}
// 根据 key 删除数组的元素 并且返回 删除的item
export function ArrayExtentRemoveItem(list, key, value) {
  list = list || []
  key = key || 'id'
  value = value || ''
  let index = list.findIndex((item) => item[key] == value)
  if (index != -1) {
    let item = list[index]
    list.splice(index, 1)
    return item
  } else {
    return null
  }
}

/**
 * 获取选择当前的第几周，当前的周一、周日
 * time 选择日期的时间戳
 */
export function getNowDateAndNowWeek(time) {
  // 选中的时间戳
  var timestamp = time
  var serverDate = new Date(time)

  // 本周周日的的时间
  var sundayTiem = timestamp + (7 - serverDate.getDay()) * 24 * 60 * 60 * 1000
  var SundayData = new Date(sundayTiem)
  // 年
  var tomorrowY = SundayData.getFullYear()
  // 月
  var tomorrowM =
    SundayData.getMonth() + 1 < 10
      ? '0' + (SundayData.getMonth() + 1)
      : SundayData.getMonth() + 1
  // 日
  var tomorrowD =
    SundayData.getDate() < 10
      ? '0' + SundayData.getDate()
      : SundayData.getDate()
  console.log('周日：  ' + tomorrowY + '-' + tomorrowM + '-' + tomorrowD)

  // 本周周一的时间
  var mondayTime = timestamp - (serverDate.getDay() - 1) * 24 * 60 * 60 * 1000
  var mondayData = new Date(mondayTime)
  // 年
  var mondayY = mondayData.getFullYear()
  // 月
  var mondayM =
    mondayData.getMonth() + 1 < 10
      ? '0' + (mondayData.getMonth() + 1)
      : mondayData.getMonth() + 1
  // 日
  var mondayD =
    mondayData.getDate() < 10
      ? '0' + mondayData.getDate()
      : mondayData.getDate()
  var nowWeek = getMonthWeek(tomorrowY, tomorrowM, tomorrowD)
  // 输出值
  var config = {
    SunDay: tomorrowY + '/' + tomorrowM + '/' + tomorrowD,
    Monday: mondayY + '/' + mondayM + '/' + mondayD,
    nowWeek: nowWeek,
  }
  return config
}

/**
 * 获取当月的第几周
 * a = d = 当前日期
 * b = 6 - w = 当前周的还有几天过完(不算今天)
 * a + b 的和在除以7 就是当天是当前月份的第几周
 */
function getMonthWeek(a, b, c) {
  let date = new Date(a, parseInt(b) - 1, c)
  let w = date.getDay()
  let d = date.getDate()
  return Math.ceil((d + 6 - w) / 7)
}

/**
 * 树型结构展平
 * **/
export function cpflatten(tree) {
  let stack = [...tree]
  let list = []
  while (stack.length > 0) {
    let item = stack.shift()
    if (item.children && item.children.length) {
      stack.unshift(...item.children)
    }
    let node = { ...item }
    node.children = []
    node.hasChild = false
    list.push(node)
  }

  return list
}
// 获取 末节点 list
export function cpflattenFinal(tree) {
  let stack = [...tree]
  let list = []
  while (stack.length > 0) {
    let item = stack.shift()
    if (item.children && item.children.length) {
      stack.unshift(...item.children)
    } else {
      let node = { ...item }
      node.children = []
      node.hasChild = false
      list.push(node)
    }
  }

  return list
}

// 将树中 catalogueType=='1' 的节点删除掉
export function delCatalogueTypeByTree(tree) {
  let list = JSON.parse(JSON.stringify(tree))
  function filterJudge(item) {
    return item.catalogueType == '0' || item.catalogueType == '2'
  }
  list = list.filter(filterJudge)
  let stack = [...list]
  while (stack.length > 0) {
    let item = stack.shift()
    if (filterJudge(item)) {
      let childrens = []
      if (item.children && item.children.length) {
        childrens = item.children.filter(filterJudge)
        item.children = childrens
        if (childrens.length) {
          item.hasChild = true
        } else {
          item.hasChild = false
        }
        stack.unshift(...childrens)
      }
    }
  }

  return list
}

export function getNear5YearsList(years) {
  // 获取 近五年 code
  return years
  // let otherCodes = []
  // let dict = {}
  // let currentYear = new Date().getFullYear()
  // for (let item of years) {
  //   dict[item.code] = item
  //   if (currentYear - 4 > item.code) {
  //     otherCodes.push(item.code)
  //   }
  // }
  // let yearslist = []
  // for (let i = 0; i < 5; i++) {
  //   if (dict[currentYear - i]) {
  //     yearslist.push({
  //       code: dict[currentYear - i].code,
  //       name: dict[currentYear - i].name,
  //     })
  //   }
  // }
  // yearslist.push({
  //   name: '更多',
  //   code: otherCodes.join(','),
  // })
  // console.log(yearslist)
  // return yearslist
}

//  根据 学科学段 period 获取 list
export function getListByPeriod(list, period, key = 'period') {
  let syncPapers = []
  for (let item of list) {
    if (item[key] == period) {
      syncPapers.push({ ...item })
    }
  }
  return syncPapers
}

//  获取 高考真题
export function getCollegeEntrancExam(subjectCode, year, showType) {
  let list = []
  middleExamConfig.forEach((item) => {
    if (!showType || item.showType == showType) {
      if (item.period == subjectCode) {
        let examType = examPaperTypeDict[item.examType]
        if (examType) {
          if (year) {
            if (examType.year == year) {
              list.push({
                ...item,
                examTypeName: examType.name,
                year: examType.year,
              })
            }
          } else {
            list.push({
              ...item,
              examTypeName: examType.name,
              year: examType.year,
            })
          }
        }
      }
    }
  })

  return list
}

//  获取 高考真题 分类
export function getCollegePastExam(year) {
  let list = []
  let dict = {}
  //  先查询 类型  在通过 类型 查询 试卷
  // examPaperTypeConfig, middleExamConfig

  middleExamConfig.forEach((item) => {
    if (item.showType == 1 || item.showType == 2) {
      if (!dict[item.examType]) {
        dict[item.examType] = [item]
      } else {
        dict[item.examType].push(item)
      }
    }
  })

  examPaperTypeConfig.forEach((item) => {
    if (item.year == year) {
      let papers = dict[item.id]
      if (papers) {
        list.push({ ...item, children: papers })
      }
    }
  })

  return list
}

// 就是数组 切分  3个一组
export function arrayListSlice3(list, step = 3) {
  let results = []
  for (let i = 0; i < list.length; i += step) {
    results.push(list.slice(i, i + step))
  }
  return results
}

// 下载资源
export function downloadFile(url, fileName) {
  let suffix = getExtension(url)
  let xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.responseType = 'blob'
  xhr.onload = function () {
    // 请求完成
    let blob = this.response
    console.log(blob)
    // 创建隐藏的可下载链接
    let eleLink = document.createElement('a')
    if (fileName.indexOf(suffix) == -1) {
      eleLink.download = fileName + suffix
    } else {
      eleLink.download = fileName
    }

    eleLink.style.display = 'none'
    // eleLink.href = url
    eleLink.href = URL.createObjectURL(blob)
    // 触发点击
    document.body.appendChild(eleLink)
    eleLink.click()
    // 然后移除
    document.body.removeChild(eleLink)
  }
  xhr.ontimeout = function (e) {
    console.log(e)
    // _this.$message.error('下载超时请重试')
  }
  xhr.onerror = function (e) {
    console.log(e)
    // _this.$message.error('下载出错，请联系管理员')
  }
  // 发送ajax请求
  xhr.send()
}

//  获取 阶段测试 和 升学备考 的list stageEntranceTestConfig
export function getStageEntranceBySubject(subject, type = 1) {
  let node = stageEntranceTestConfig.find((item) => item.period == subject)
  let list = []
  if (node) {
    // 阶段测试
    let resStr = ''
    if (type == 1) {
      resStr = node.stageTest
    } else if (type == 2) {
      resStr = node.entranceTest
    } else {
      resStr = node.synchronous
    }
    let arr = resStr.split(',')
    list = arr.map((item) => {
      let attr = item.split('_')
      return {
        name: attr[0],
        code: attr[1],
      }
    })
  }

  return list
}

//  设置 学段学科 版本册别
function getCurrSubjectsCookie() {
  let str = getStore('currSubject')
  if (str) {
    try {
      return JSON.parse(str)
    } catch (e) {
      return null
    }
  } else {
    return null
  }
}
export function setCookieSubjectVolume(currSubject, volume) {
  let currSubjects = {
    periodCode: currSubject.periodCode,
    periodName: currSubject.periodName,
    subjectCode: currSubject.subjectCode,
    subjectName: currSubject.subjectName,
    volume: volume,
  }
  setStore('currSubject', currSubjects)
}
export function getCookieSubjectVolume(subjectCode = '') {
  let currSubject = getCurrSubjectsCookie()
  if (subjectCode) {
    if (currSubject && currSubject.subjectCode == subjectCode) {
      return currSubject
    } else {
      return null
    }
  } else {
    // return currSubject  异常处理 有时候 cookie 里面的 对象 被其他设置了
    if (currSubject && currSubject.subjectCode) {
      return currSubject
    } else {
      return null
    }
  }
}

// 判断 试卷试题中 是否有 questionId 来源 source !=1
export function checkPaperQuestionSource(tree) {
  let stock = [...tree]
  while (stock.length > 0) {
    let pop = stock.pop()
    if (pop.questionId) {
      if (pop.source != 1) {
        return false
      }
    } else {
      if (pop.list && pop.list.length) {
        stock.push(...pop.list)
      }
    }
  }
  return true
}

/*
获取 所有的 末节点 checked
*/
export function getSimpleCheckedLeaf(store) {
  let list = []
  let stock = [...store.root.childNodes]
  while (stock.length) {
    let item = stock.shift()
    if (item.childNodes && item.childNodes.length) {
      stock.unshift(...item.childNodes)
    } else {
      if (item.checked) {
        list.push(item.data)
      }
    }
  }

  return list
}

//  获取.后缀名
export function getExtension(name) {
  return name.substring(name.lastIndexOf('.'))
}

//计算函数方法
export function todo_time(time) {
  if (!time) {
    return ''
  }
  var oDate = new Date()
  var newHaoMiao1 = oDate.getTime() //当前时间,含有时分秒
  oDate.setHours(0)
  oDate.setMinutes(0)
  oDate.setSeconds(0)
  oDate.setMilliseconds(0)
  var newHaoMiao2 = oDate.getTime() //当前时间,不含有时分秒
  var newTime = time.replace(new RegExp('-', 'gm'), '/')
  var arrTime = time.substring(0, 11).replace(new RegExp('-', 'gm'), '/') //截取时间，不含有时分秒
  var showTime = time.substring(0, 11)
  var oldHaoMiao1 = new Date(newTime).getTime() //含有时分秒的转化成毫秒
  var oldHaoMiao2 = new Date(arrTime).getTime() //不含有时分秒的转化成毫秒
  var d1 = (newHaoMiao1 - oldHaoMiao1) / 1000
  var d2 = (newHaoMiao2 - oldHaoMiao2) / 1000
  var d_result = ''
  if (d2 > 0) {
    //是几天前
    var d_days = parseInt(d2 / 86400)
    if (d_days === 1) {
      d_result = '昨天'
    } else if (d_days >= 2) {
      d_result = showTime
    }
  } else {
    //是今天
    var d_hours = parseInt(d1 / 3600)
    var d_minutes = parseInt(d1 / 60)
    if (d_hours > 0) {
      d_result = d_hours + '小时前'
    } else if (d_hours <= 0 && d_minutes > 0) {
      d_result = d_minutes + '分钟前'
    } else {
      d_result = '刚刚'
    }
  }
  return d_result
}
// 精确计算 字符串 字节长度
export function BytesCount(str) {
  var cnt = 0
  for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i)
    if (/^[\u0000-\u00ff]$/.test(c)) {
      cnt++
    } else {
      cnt += 2
    }
  }
  return cnt
}
// 通过字节 精确 计算 截取字符串长度
export function countBytesCutoutLen(str, num) {
  var cnt = 0
  for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i)
    if (/^[\u0000-\u00ff]$/.test(c)) {
      cnt++
    } else {
      cnt += 2
    }
    if (cnt > num) {
      return i
    }
  }
  return str.length
}
