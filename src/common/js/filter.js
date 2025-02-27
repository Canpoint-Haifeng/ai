import moment from 'moment'
moment.locale('zh-cn')

const optionlist = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const tinyNumlist = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳'

// 时间戳转时间
export function dateBig(val, formatter) {
  if (!val) return '-'
  formatter = formatter || 'YYYY-MM-DD'
  return moment.unix(val).format(formatter)
}

export function dateStrBig(val, formatter) {
  if (!val) return '-'
  formatter = formatter || 'YYYY-MM-DD'
  return moment(val).format(formatter)
}

export function datetime(val, formatter) {
  if (!val) return '-'
  formatter = formatter || 'YYYY-MM-DD HH:mm:ss'
  return moment.unix(val).format(formatter)
}

export function currency(val, formatter) {
  return '￥' + val
}

export function phoneCut(val) {
  if (!val) return '-'
  let toStr = val.toString()
  let ruten = toStr.substring(3, 7)
  return toStr.replace(ruten, '****')
}

export function emilCut(val) {
  if (!val) return '-'
  let toStr = val.toString()
  let strings = toStr.split('@')
  let str = strings[0].substring(1, strings[0].length - 1)
  return strings[0].replace(str, '*******') + '@' + strings[1]
}

// 阿拉伯数字转换为简写汉字
export function simplifiedChinese(num) {
  if (isNaN(num)) {
    return
  }
  // 字符处理完毕后开始转换，采用前后两部分分别转换
  let part = String(num).split('.')
  let newchar = ''
  // 小数点前进行转化
  for (let i = part[0].length - 1; i >= 0; i--) {
    if (part[0].length > 10) {
      return ''
    }
    let tmpnewchar = ''
    let perchar = part[0].charAt(i)
    switch (perchar) {
      case '0':
        tmpnewchar = '零' + tmpnewchar
        break
      case '1':
        tmpnewchar = '一' + tmpnewchar
        break
      case '2':
        tmpnewchar = '二' + tmpnewchar
        break
      case '3':
        tmpnewchar = '三' + tmpnewchar
        break
      case '4':
        tmpnewchar = '四' + tmpnewchar
        break
      case '5':
        tmpnewchar = '五' + tmpnewchar
        break
      case '6':
        tmpnewchar = '六' + tmpnewchar
        break
      case '7':
        tmpnewchar = '七' + tmpnewchar
        break
      case '8':
        tmpnewchar = '八' + tmpnewchar
        break
      case '9':
        tmpnewchar = '九' + tmpnewchar
        break
    }
    switch (part[0].length - i - 1) {
      case 0:
        tmpnewchar = tmpnewchar + ''
        break
      case 1:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '十'
        break
      case 2:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '百'
        break
      case 3:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '千'
        break
      case 4:
        tmpnewchar = tmpnewchar + '万'
        break
      case 5:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '十'
        break
      case 6:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '百'
        break
      case 7:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '千'
        break
      case 8:
        tmpnewchar = tmpnewchar + '亿'
        break
      case 9:
        tmpnewchar = tmpnewchar + '十'
        break
    }
    newchar = tmpnewchar + newchar
  }
  // 替换所有无用汉字，直到没有此类无用的数字为止
  while (
    newchar.search('零零') !== -1 ||
    newchar.search('零亿') !== -1 ||
    newchar.search('亿万') !== -1 ||
    newchar.search('零万') !== -1
  ) {
    newchar = newchar.replace('零亿', '亿')
    newchar = newchar.replace('亿万', '亿')
    newchar = newchar.replace('零万', '万')
    newchar = newchar.replace('零零', '零')
  }
  // 替换以“一十”开头的，为“十”
  if (newchar.indexOf('一十') === 0) {
    newchar = newchar.substr(1)
  }
  // 替换以“零”结尾的，为“”
  if (newchar.lastIndexOf('零') === newchar.length - 1) {
    newchar = newchar.substr(0, newchar.length - 1)
  }
  return newchar
}

// 数值合并字符串
export function arrJoin(arr, formatter) {
  if (!arr.length) return '-'
  formatter = formatter || ' '
  return arr.join(formatter)
}

export function optionTag(i) {
  return optionlist.charAt(i)
}

export function smallTopicTag(i) {
  return '(' + (i + 1) + ')'
}

export function tinyTopicTag(i) {
  return tinyNumlist.charAt(i)
}

// 判断是否为空对象
export function isEmptyObject(obj, key) {
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

// 排行榜 处理 用户名称
function formatUserName(str) {
  return str.substr(0, 1) + new Array(str.length).join('*')
}

export default {
  install: function(Vue) {
    Vue.filter('dateBig', dateBig)
    Vue.filter('dateStrBig', dateStrBig)

    Vue.filter('datetime', datetime)
    Vue.filter('currency', currency)
    Vue.filter('phoneCut', phoneCut)
    Vue.filter('emilCut', emilCut)
    Vue.filter('simplifiedChinese', simplifiedChinese)
    Vue.filter('arrJoin', arrJoin)
    Vue.filter('optionTag', optionTag)
    Vue.filter('smallTopicTag', smallTopicTag)
    Vue.filter('tinyTopicTag', tinyTopicTag)
    Vue.filter('isEmptyObject', isEmptyObject)
    Vue.filter('formatUserName', formatUserName)
    app.config.globalProperties.$filter = {
      dateStrBig,
      dateBig,
      datetime,
      currency,
      phoneCut,
      emilCut,
      simplifiedChinese,
      arrJoin,
      optionTag,
      smallTopicTag,
      tinyTopicTag,
      isEmptyObject,
      formatUserName,
    }
  },
}
