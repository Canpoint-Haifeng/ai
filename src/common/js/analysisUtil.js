/* eslint-disable */
import { SeparateStructure } from '../config/separate-question.js'

function getLatex(s) {
  // return '<span class="math-tex">\\(' + s + '\\)</span>'
  if (s && !(/<img(.*?)>/).test(s)) {
    return '\\(' + s + '\\)'
  } else {
    return s
  }
}

// 匹配 类型
function matchingStruct(line) {
  let math = line.replace(/\s+/g, '').match(/(\d*)[\．,\.]/)
  if (math) {
    if (math[1] && parseInt(math[1])) {
      return {
        type: 1,
        code: math[1]
      }
    } else {
      return null
    }
  }
  return null
}

export const executefileData = (results) => {
  let fileList = []
  let lineId = 1
  for (let sub of results) {
    let lineCode = {
      id: lineId
    }
    let lineContent = ''
    let rect = []
    let datas = JSON.parse(sub.lineData)
    let len = datas.length
    let checkLine = ''
    for (let i = 0; i < len; i++) {
      let item = datas[i]
      let pos = item.pos.split(',')
      // : "65, 74, 503, 162"
      if (i === 0) {
        rect[0] = parseInt(pos[0])
        rect[1] = parseInt(pos[1])
        rect[2] = parseInt(pos[2])
        rect[3] = parseInt(pos[3])
      }
      if (i === len - 1) {
        let sx = parseInt(pos[0])
        let sy = parseInt(pos[1])
        let sw = parseInt(pos[2])
        let sh = parseInt(pos[3])
        if (sx < rect[0]) {
          rect[0] = sx
        }
        if (sy < rect[1]) {
          rect[1] = sy
        }

        if (sw > rect[2]) {
          rect[2] = sw
        }
        if (sh > rect[3]) {
          rect[3] = sh
        }
      }
      checkLine += item.text || ''
      if (item.type === 0) {
        lineContent += getLatex(item.text)
      } else if (item.type === 1) {
        lineContent += item.text
      } else if (item.type === 2) {
        lineCode.isimg = true
        lineContent += '图片'
      } else if (item.type === 3) {
        // 表格当文字解析
        lineContent += item.text
      }

      lineCode.contentType = item.type
    }

    // 该行是否有题号 12. 为小题  一. 为大题
    // 12.123123123.1
    // asdasd12.1
    let struct = matchingStruct(checkLine)
    if (struct) {
      lineCode.type = struct.type
      lineCode.code = struct.code
    } else {
      lineCode.type = 0
    }
    lineCode.content = lineContent
    lineCode.rect = rect
    lineCode.id = sub.id
    lineCode.type = sub.structureType || 0

    lineId++

    fileList.push(lineCode)
  }

  // 排序
  // fileList.sort((a, b) => {
  //   if(a.rect[1] > b.rect[1]) {
  //     return 1
  //   }else if(a.rect[1] === b.rect[1]) {
  //     if(a.rect[0] > b.rect[0]) {
  //       return 1
  //     }else{
  //       return -1
  //     }
  //   }else{
  //     return -1
  //   }
  // })
  return fileList
}

export const collisionPoint = (list, lx, ly) => {
  // lineCode.rect
  for (let sub of list) {
    let rect = sub.rect
    if (lx >= rect[0] && lx < rect[2] && ly >= rect[1] && ly <= rect[3]) {
      return sub
    }
  }

  return null
}

function rectangleIntersecting(r1, r2) {
  // 两个矩形是否相交
  if ((r1.x + r1.w) < r2.x || (r2.x + r2.w) < r1.x || (r1.y + r1.h) < r2.y || (r2.y + r2.h) < r1.y) {
    return false
  } else {
    return true
  }
}

// 遍历 所有的 碰撞对象
export const collisionAllRect = (list, mrect, imageRatio) => {
  let results = []
  let r2 = {
    x: mrect.x / imageRatio,
    y: mrect.y / imageRatio,
    w: mrect.width / imageRatio,
    h: mrect.height / imageRatio
  }
  for (let sub of list) {
    let rect = sub.rect
    let r1 = {
      x: rect[0],
      y: rect[1],
      w: rect[2] - rect[0],
      h: rect[3] - rect[1]
    }
    if (rectangleIntersecting(r1, r2)) {
      results.push(sub)
    }
  }
  return results
}

export const collisionUIRect = (list, mrect) => {
  let r2 = {
    x: mrect.x,
    y: mrect.y,
    w: mrect.width,
    h: mrect.height
  }

  for (let rect of list) {
    let r1 = {
      x: rect.x,
      y: rect.y,
      w: rect.width,
      h: rect.height
    }
    if (rectangleIntersecting(r1, r2)) {
      return rect
    }
  }
  return null
}

// 设置 viewId 为 id 为对象的 struct 为struct

export const configToRect = (mrect, imageRatio) => {
  // uiconfig to rect 数组
  let r2 = [mrect.x / imageRatio, mrect.y / imageRatio, (mrect.width + mrect.x) / imageRatio, (mrect.height + mrect.y) / imageRatio]
  return r2
}

// 获取 矩形的 合集
export const assemblyRects = (list, tempRectC) => {
  let rect = tempRectC
  for (let sub of list) {
    if (!rect) {
      rect = sub.rect.slice()
    } else {
      if (sub.rect[0] < rect[0]) {
        rect[0] = sub.rect[0]
      }
      if (sub.rect[1] < rect[1]) {
        rect[1] = sub.rect[1]
      }

      if (sub.rect[2] > rect[2]) {
        rect[2] = sub.rect[2]
      }

      if (sub.rect[3] > rect[3]) {
        rect[3] = sub.rect[3]
      }
    }
  }
  return rect
}

// 获取时间戳id
export const getTimeId = () => {
  return 'b_' + new Date().getTime()
}

export const util = {

  _debounce(fn, delay) {
    delay = delay || 200
    var timer
    return function() {
      var th = this

      var args = arguments

      if (timer) {
        clearTimeout(timer)
      }

      timer = setTimeout(function() {
        timer = null

        fn.apply(th, args)
      }, delay)
    }
  },

  // 节流

  _throttle(fn, interval) {
    var last

    var timer

    interval = interval || 200

    return function() {
      var th = this

      var args = arguments

      var now = +new Date()

      if (last && now - last < interval) {
        clearTimeout(timer)

        timer = setTimeout(function() {
          last = now

          fn.apply(th, args)
        }, interval)
      } else {
        last = now

        fn.apply(th, args)
      }
    }
  }

}

export const executeResultData = (fileList) => {
  let list = []
  let currentSTJ = null // 试题集
  let currentJG = null // 结构
  let currentST = null // 试题
  let executeO = {
    STJ: function(sub) {
      // 习题集
      if (!currentSTJ || currentSTJ.id !== sub.viewId) {
        currentSTJ = { type: 1, id: sub.viewId, line: [sub.id] }
        list.push(currentSTJ)
      } else {
        currentSTJ.line.push(sub.id)
      }
    },
    JG: function(sub) {
      // 结构
      if (!currentJG || currentJG.id !== sub.viewId) {
        currentJG = { type: 2, id: sub.viewId, line: [sub.id] }
        list.push(currentJG)
      } else {
        currentJG.line.push(sub.id)
      }
    },
    ST: function(sub) {
      // 试题
      if (!currentST || currentST.id !== sub.viewId) {
        currentST = { type: 3, id: sub.viewId, line: [sub.id] }
        list.push(currentST)
      } else {
        currentST.line.push(sub.id)
      }
    },
    XT: function(sub) {
      // 小题
      if (currentST) {
        if (!currentST.children) {
          currentST.children = []
        }

        currentST.children.push({ type: 4, id: sub.viewId, line: [] })
      }
    },
    Options: function(sub) {
      // 选项

    }
  }
  for (let sub of fileList) {
    if (sub.struct > 0) {
      switch (sub.struct) {
        case 1:
          executeO.STJ(sub)
          break
        case 2:
          executeO.JG(sub)
          break
        case 3:
          executeO.ST(sub)
          break
        case 4:
          executeO.XT(sub)
          break
        case 5:
          executeO.Options(sub)
          break
      }
    }
  }

  return list
}

//  过滤 字符
function filterChart(str) {
  let reg1 = /[【答案】|【解析】]/g
  return str.replace(reg1, '')
}
function filterOptionsChar(str) {
    // eslint-disable-next-line
  let reg2 = /^[A|B|C|D|E|F|G|H|I][．|、|\.]/
  return str.replace(reg2, '')
}
function trimChar(str, char) {
  let list = str.split(char)
  list = list.filter(item => item && (item.length > 0))
  return list.join(char)
}
function closeHtmlLabel(html) {
  var temp = document.createElement('div')
  temp.innerHTML = html
  return temp.innerHTML
}
function filterTrimChar(str) {
  return closeHtmlLabel(trimChar(str, '<br />'))
}
function separateHtmlData(html) {
  let reg1 = /<img(.*?)\/>/g
  let signresults = html.match(reg1)
  let tickKey = '$cpsign$'
  let signList = []
  if (signresults) {
    for (let sub of signresults) {
      if (sub.indexOf('typedata="sign"') !== -1) {
        html = html.replace(sub, '$cpsign$')
        signList.push(sub)
      }
    }
  }

  // console.log(signList)
  let list = html.split(tickKey)

  let results = []
  list.shift()
  let signReg = /quesdata="(\d)"/i
  for (let i = 0, len = signList.length; i < len; i++) {
    let sub = signList[i]
    let item = sub.match(signReg)
    if (item && item[1]) {
      results.push({
        type: parseInt(item[1]),
        text: filterTrimChar(list[i])
      })
    }
  }
  return results
}

export const splitWordQuestion = function(content, stageObject) {
  let itemStructure = SeparateStructure[stageObject]
  if (!itemStructure) {
    itemStructure = {
      s: '1111',
      m: '1111',
      c: '1111',
      o: '1111'
    }
  }
  let strlist = separateHtmlData(content)

  if (!strlist) strlist = []

  let answerList = [] // answer
  let analysisList = [] // analysis
  let linelist = [] // 2： 大题干 3：试题 4：小题干 5：选项 的内容集
  for (let sub of strlist) {
    let qtype = sub.type
    if (qtype) {
      if (qtype === 6) {
        analysisList.push(sub.text)
      } else if (qtype === 7) {
        answerList.push(sub.text)
      } else {
        linelist.push(sub)
      }
    }
  }
  // 2： 大题干 3：试题 4：小题干 5：选项
  let currentQuestion = null
  var questionList = []
  for (let sub of linelist) {
    switch (sub.type) {
      case 2:
      case 3:
      case 4:
        currentQuestion = sub
        questionList.push(currentQuestion)
        break
      case 5:
        if (currentQuestion) {
          if (!currentQuestion.options) {
            currentQuestion.options = [filterOptionsChar(sub.text)]
          } else {
            currentQuestion.options.push(filterOptionsChar(sub.text))
          }
        }
        break
      default:
    }
  }

  // 所有的 大题干 试题 小题 选项都 处理好
  // 开始 组装 大题干 list
  let currentCollect = null
  currentQuestion = null
  let collectList = [] // 大题干
  function createQuestion(item) {
    let questionType = itemStructure.o

    let context = {
      stem: item.text
    }
    if (item.options) {
      context.options = item.options
      questionType = itemStructure.s
    }
    let questionStructure = questionType.substr(0, 2)
    // questionStructure: '',
    // questionType: ''
    return { question: { context, questionType, questionStructure } }
  }
  function createCollect(item) {
    currentCollect = {
      name: item.text || '',
      ques: []
    }
    collectList.push(currentCollect)
  }
  for (let sub of questionList) {
    switch (sub.type) {
      case 2:
        createCollect(sub)
        break
      case 3:
        currentQuestion = createQuestion(sub)
        if (!currentCollect) {
          createCollect({})
        }
        currentCollect.ques.push(currentQuestion)
        break
      case 4:
        if (currentQuestion) {
          let miniQues = createQuestion(sub)
          if (!currentQuestion.children) {
            currentQuestion.children = [miniQues]
          } else {
            currentQuestion.children.push(miniQues)
          }
          let questionType = itemStructure.c
          currentQuestion.question.questionType = questionType
          currentQuestion.question.questionStructure = questionType.substr(0, 2)
        }
        break
    }
  }

  // 处理完 试题 后 开始处理 答案和解析 目前只有
  let tagExplain = 0
  for (let sub of collectList) {
    for (let qsub of sub.ques) {
      if (qsub.question.questionStructure == '16') {
        for (let minisub of qsub.children) {
          // 组装 解析 答案
          minisub.explain = assembleExplainItem(tagExplain, answerList, analysisList)
          tagExplain++
        }
      } else {
        // 组装 解析 答案
        qsub.explain = assembleExplainItem(tagExplain, answerList, analysisList)
        tagExplain++
      }
    }
  }

  return collectList
}

function assembleExplainItem(tagExplain, answerList, analysisList) {
  return [{
    analysis: analysisList[tagExplain] || '',
    answers: [[answerList[tagExplain] || '']]
  }]
}
