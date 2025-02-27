/* eslint-disable */
import {
  isEmptyStr
} from './util.js'

const optionlist = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const judgelist = [0, 1]
const questionShowPart = {
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
  16: { name: '多题综合类', h: 0, s: 1, nns: 1, o: 0, c: 1, a: 0, ay: 0, at: 0 },
  17: { name: '多题综合类（同一知识点）', nns: 1, h: 0, s: 1, o: 0, c: 1, a: 0, ay: 0, at: 2, some: 1 },
  18: { name: '解答题', h: 0, s: 1, o: 0, c: 0, a: 1, ay: 1, at: 1 },
  19: { name: '听力题', h: 1, s: 1, nns: 1, o: 0, c: 1, a: 0, ay: 0, at: 2, nochStem: 1, some: 1 },
  20: { name: '听力单题-填空题', h: 0, s: 1, o: 0, c: 0, a: 1, ay: 1, at: 1, ant: 2 },
  21: { name: '听力单题-判断题', h: 0, s: 1, o: 0, c: 0, a: 1, ay: 1, at: 1 },
  22: { name: '听力单题-选择题', h: 0, s: 1, o: 1, c: 0, a: 1, ay: 1, at: 1 },
  23: { name: '完形填空', h: 0, s: 1, o: 0, c: 1, a: 0, ay: 2, at: 2, nochStem: 1, some: 1 },
  24: { name: '综合类填空', h: 0, s: 1, o: 0, c: 1, a: 0, ay: 2, at: 2, nochStem: 2, some: 1 },
  25: { name: '7选5类', h: 0, s: 1, o: 1, c: 1, a: 0, ay: 1, at: 2, nochStem: 2, some: 1 },
  26: { name: '作文', h: 0, s: 1, o: 0, c: 0, a: 1, ay: 1, at: 1 },
  27: { name: '选择填充题', h: 0, s: 1, o: 1, c: 0, a: 1, ay: 1, at: 1, ant: 2 },
  28: { name: '四选二类', h: 0, s: 1, o: 2, c: 0, a: 2, ay: 1, at: 1, ant: 2 },
  29: { name: '单词辨音模板', h: 0, s: 1, o: 0, c: 0, a: 1, ay: 1, at: 1, ant: 2 },
  30: { name: '改错模板', h: 0, s: 1, o: 0, c: 0, a: 1, ay: 1, at: 1 }
}

// 检查 题干 context
function checkContext(ques, item, indexTag, nochStem) {
  if (ques && ques.question && ques.question.context) {
    let scontext = ques.question.context
    if (item.h) {
      if (isEmptyStr(scontext.original_text)) {
        return {
          code: 0,
          msg: indexTag + '请填写听力原文'
        }
      }
      // if (isEmptyStr(scontext.audio)) {
      //   return {
      //     code: 0,
      //     msg: indexTag + '请上传听力音频'
      //   }
      // }
    }
    if (item.s && nochStem == 0) {
      if (isEmptyStr(scontext.stem)) {
        return {
          code: 0,
          msg: indexTag + '请输入题干'
        }
      }
    }
    if (item.o && nochStem < 2) {
      if (!(scontext.options && scontext.options.length >= 2)) {
        return {
          code: 0,
          msg: indexTag + '添加题目选项，且大于2条'
        }
      } else {
        if (item.o === 2) {
          let sevenOption = parseInt(scontext.seven_option) || 4
          if (sevenOption < scontext.options.length) {
            return {
              code: 0,
              msg: indexTag + '选项数量不够'
            }
          }
        }
        if (arrayIsEmpty(scontext.options)) {
          return {
            code: 0,
            msg: indexTag + '请输入选项内容'
          }
        } else if (arrayNotRepetition(scontext.options)) {
          // 检查 各个选项 不重复
          return {
            code: 0,
            msg: indexTag + '选项内容不能相同'
          }
        }
      }
    }
    return {
      code: 1
    }
  } else {
    if (item.o > 0 && nochStem < 2) {
      return {
        code: 0,
        msg: indexTag + '添加试题选项'
      }
    } else if (item.h) {
      return {
        code: 0,
        msg: indexTag + '请填写听力原文'
      }
    } else if (nochStem === 0) {
      return {
        code: 0,
        msg: indexTag + '请完成试题内容'
      }
    } else {
      return {
        code: 1
      }
    }
  }
}

function arrayNotRepetition(options) {
  let list = options.map(item => {
    item = item.replace(/&nbsp;/g, '')
    item = item.replace(/<br \/>/g, '')
    item = item.replace(/\u200B/g, '') // 去除网页中的 零宽度 空格 &#8203;
    return item.replace(/^\s+|\s+$/g, '')
  })
  let set = new Set(list)
  if (set.size !== list.length) {
    return true
  }
  return false
}

function arrayIsEmpty(list) {
  let len = list.length
  for (let i = 0; i < len; i++) {
    let sub = list[i]
    if (isEmptyStr(sub)) {
      return true
    }
  }

  return false
}

// 检查 答案
function checkExplainaAnswers(ques, item, questionStructure, indexTag) {
  if (item.a) {
    if (ques && ques.explain && ques.explain[0] && ques.explain[0].answers) {
      let answers = ques.explain[0].answers
      if (answers[0] && answers[0][0] && !isEmptyStr(answers[0][0])) {
        let answer = answers[0][0]
        if (item.a === 2) {
          let sevenAnswer = 2
          if (ques && ques.question && ques.question.context) {
            sevenAnswer = ques.question.context.seven_answer || 2
          }
          if (answers.length >= sevenAnswer) {
            for (let sub of answers) {
              if (!sub[0]) {
                return {
                  code: 0,
                  msg: indexTag + '请填写答案'
                }
              }
            }
          } else {
            return {
              code: 0,
              msg: indexTag + '请完成答案'
            }
          }
        }

        // 1215 双选  1212多选  1216不定向选择
        // if (item.ant === 4) {
        //   let questionType = ques.question.questionType
        //   if (questionType == 1215) {
        //     // 只有两个
        //     if (answers.length !== 2) {
        //       return {
        //         code: 0,
        //         msg: indexTag + '双选答案数量应为2个'
        //       }
        //     }
        //   } else if (questionType == 1212) {
        //     if (answers.length < 2) {
        //       return {
        //         code: 0,
        //         msg: indexTag + '多选答案数量应大于等于2个'
        //       }
        //     }
        //   } else if (answers.length < 1) {
        //     return {
        //       code: 0,
        //       msg: indexTag + '不定向选择答案数量应大于等于1个'
        //     }
        //   }
        // }

        if (item.o && optionlist.indexOf(answer) === -1) {
          return {
            code: 0,
            msg: indexTag + '选择题答案格式错误，应为（A，B，C，D等）'
          }
        } else if (questionStructure == 14 && judgelist.indexOf(parseInt(answers)) === -1) {
          return {
            code: 0,
            msg: indexTag + '判断题答案格式错误，应为（对，错）'
          }
        } else if (questionStructure == 27 && isEmptyStr(answers[1][0])) {
          return {
            code: 0,
            msg: indexTag + '请填写填空答案'
          }
        }
        return {
          code: 1
        }
      } else {
        return {
          code: 0,
          msg: '请填写答案'
        }
      }
    } else {
      return {
        code: 0,
        msg: indexTag + '请填写答案'
      }
    }
  } else {
    return {
      code: 1
    }
  }
}

// 检查 解析
function checkExplainAnalysis(ques, item, indexTag, params = {}) {
  if (item.ay === 1) {
    if (ques && ques.explain && ques.explain[0] && ques.explain[0].analysis) {
      let analysis = ques.explain[0].analysis
      if (!isEmptyStr(analysis)) {
        let analysisLength = params.analysisLength || 5
        if (analysis.length <= analysisLength) {
          return {
            code: 0,
            msg: indexTag + '解析需大于' + analysisLength + '字符'
          }
        } else {
          return {
            code: 1
          }
        }
      } else {
        return {
          code: 0,
          msg: indexTag + '请填写解析'
        }
      }
    } else {
      return {
        code: 0,
        msg: indexTag + '请填写解析'
      }
    }
  } else {
    return {
      code: 1
    }
  }
}

// 检查 标定
function checkExplainAttr(ques, item, batchProperty, indexTag) {
  if (item.at) {
    let attrs = null
    if (item.some === 1) {
      if (ques.question && ques.question.tags) {
        attrs = ques.question.tags.attrs
      }
    } else {
      if (ques.explain && ques.explain[0]) {
        attrs = ques.explain[0].attrs
      }
    }

    if (!attrs) {
      attrs = {}
      // return { code: 0, msg: indexTag + '请完成标定试题属性' }
    }

    for (let key in batchProperty) {
      let pitem = batchProperty[key]
      if (key === '100188') {
        // if(pitem === 2 && indexTag) {
        //   if(!(ques.question.tags && ques.question.tags.questionCatagory)) {
        //     return { code: 0, msg: indexTag + '请完成标定试题属性' }
        //   }
        // }
      } else if (key !== '100198') {
        if (pitem === 2) {
          // attrs[key] 判断 属性是否有
          if (typeof attrs[key] === 'number') {
            attrs[key] = attrs[key] + ''
          }
          if (!(attrs[key] && attrs[key].length)) {
            return {
              code: 0,
              msg: indexTag + '请完成标定试题属性'
            }
          }
        }
      } else {
        if (pitem.master === 2) {
          if (!(attrs[key] && attrs[key].master && attrs[key].master.length)) {
            return {
              code: 0,
              msg: indexTag + '请完成标定试题属性'
            }
          }
        }
        if (pitem.secondary === 2) {
          if (!(attrs[key] && attrs[key].secondary && attrs[key].secondary.length)) {
            return {
              code: 0,
              msg: indexTag + '请完成标定试题属性'
            }
          }
        }
      }
    }
    return {
      code: 1
    }
  } else {
    return {
      code: 1
    }
  }
}

// function onlyCheckContext(ques, indexTag) {
//   // 只检查 题干
//   let questionStructure = ques.question.questionStructure
//   let item = questionShowPart[questionStructure]
//   let result = checkContext(ques, item, indexTag)
//   return result
// }

function checkOutQuestion(ques, editStatus, batchProperty, needAttr, isRepeat, indexTag, parentItem, params) {
  let questionStructure = ques.question.questionStructure
  let item = questionShowPart[questionStructure]
  let result = {}

  // 检查 题干  nns 不检查题干和 选项 答案
  if (isRepeat !== 1 && item.nns !== 1) {
    let nochStem = 0 // 1：子试题 不验证 内容 但是要验证 答案解析
    if ((parentItem && parentItem.nochStem > 0)) nochStem = parentItem.nochStem

    result = checkContext(ques, item, indexTag, nochStem)

    if (result.code === 0) {
      return result
    }
    result = checkExplainaAnswers(ques, item, questionStructure, indexTag)
    if (result.code === 0) {
      return result
    }
  } else {
    if (item.h) {
      // 验证 听力原文
      if (ques && ques.question && ques.question.context) {
        let scontext = ques.question.context
        if (isEmptyStr(scontext.original_text)) {
          return {
            code: 0,
            msg: indexTag + '请填写听力原文'
          }
        }
      } else {
        return {
          code: 0,
          msg: indexTag + '请填写听力原文'
        }
      }
    }
  }

  // 如果 nns 为1  不用检查 解析
  if (editStatus === 2 && item.nns !== 1) {
    // 解析
    result = checkExplainAnalysis(ques, item, indexTag, params)
    if (result.code === 0) {
      return result
    }
  }

  // 检查 topic
  // if(params && params.isVerifyToptic && questionStructure == 13) {
  //   if(!(ques.question.titleTopic == 0 || ques.question.titleTopic == 1)) {
  //     return {
  //       code: 0,
  //       msg: indexTag + '请填写主客观题'
  //     }
  //   }
  // }

  if (editStatus === 3 && !indexTag) {
    let pitem = batchProperty['100188']
    // 验证
    if (pitem === 2) {
      if (!(ques.question.tags && ques.question.tags.questionCatagory)) {
        return {
          code: 0,
          msg: indexTag + '请完成标定试题属性'
        }
      }
    }
  }

  if (editStatus === 3 && needAttr) {
    // 标定
    result = checkExplainAttr(ques, item, batchProperty, indexTag)
    return result
  }

  return {
    code: 1
  }
}

// 验证 是否可以 完成并且下一题
export const verifyQuestion = (ques, editStatus, batchProperty = {}, isRepeat = 0, littleQuesDict = false, params = {}) => {
  // 可编辑的等级 1：录入人员编辑 2：解析员编辑  3：标定员编辑  4：解析和标定修改
  // questionShowPart: {
  // [hearing听力, stem题干,opt选项,child子试题，answer答案，analysis解析，attr属性]  ant答案渲染模式:0获取没有：普通 1：多选 2：选择，填空（备选 答案）
  // 0 不显示 1：显示 2：(条件显示 level==1) 3:(条件显示 level!=1)
  // 11: { name: '单选题', h: 0, s: 1, o: 1, c: 0, a: 1, ay: 1, at: 1 },
  // console.log(ques)
  // console.log(ques.question.questionStructure)
  // console.log(ques.question.context)
  // console.log(ques.explain)
  // isEmptyStr
  let result = {}

  let questionStructure = ques.question.questionStructure
  let item = questionShowPart[questionStructure]

  if (item.c === 0) {
    result = checkOutQuestion(ques, editStatus, batchProperty, 1, isRepeat, '', null, params)
    return result
  } else {
    let needAttr = 1
    // 小题 不需要 题干
    let cIndex = 0
    let subcIndex = 0

    result = checkOutQuestion(ques, editStatus, batchProperty, 1, isRepeat, '', null, params)
    if (result.code === 0) {
      return result
    }
    if (item.some === 1) {
      needAttr = 0
    }

    if (!(ques.children && ques.children.length)) {
      return {
        code: 0,
        msg: '请添加子题目'
      }
    }
    for (let child of ques.children) {
      subcIndex = 0
      let childMsg = '【小题' + cIndex + '】'
      let cqstructure = child.question.questionStructure
      // cqstructure 是否 是特殊 需求 23 24 25 27
      let sitem = questionShowPart[cqstructure]
      if (sitem.c === 0) {
        result = checkOutQuestion(child, editStatus, batchProperty, needAttr, isRepeat, childMsg, item, params)
        if (result.code === 0) return result
      } else {
        if (!(child.children && child.children.length)) {
          return {
            code: 0,
            msg: '【小题' + cIndex + '】' + '请添加子题目'
          }
        }
        for (let subchild of child.children) {
          let subChildMsg = '【小题' + cIndex + '-' + subcIndex + '】'
          if (littleQuesDict) {
            if (!littleQuesDict[subchild.id]) {
              return {
                code: 0,
                msg: '请查看' + subChildMsg
              }
            }
          }
          result = checkOutQuestion(subchild, editStatus, batchProperty, needAttr, isRepeat, subChildMsg, params)
          if (result.code === 0) return result
          subcIndex++
        }
      }

      cIndex++
    }
    return {
      code: 1
    }
  }

  // questionStructure
  // questionType
  // tags: {"questionCatagory":"11"}
  // questionFromCode
  // grade
  // useTime
}

// 判断是否 是否还有 标定属性
function hasContentExplainAtrr(ques, item) {
  if (item.at) {
    let attrs = null
    if (item.some === 1) {
      attrs = ques.question.tags.attrs
    } else {
      attrs = ques.explain[0].attrs
    }
    if (!attrs) {
      return false
    }
    let batchProperty = [{
      cid: '100198',
      master: true
    }, {
      cid: '100198',
      master: false
    }, {
      cid: '100186'
    }, {
      cid: '100190'
    }, {
      cid: '100192'
    }, {
      cid: '100194'
    }]
    for (let sub of batchProperty) {
      let key = sub.cid
      if (key !== '100198') {
        // attrs[key] 判断 属性是否有
        if (attrs[key] && attrs[key].length > 0) {
          return true
        }
      } else {
        if (sub.master) {
          if (attrs[key] && attrs[key].master && attrs[key].master.length > 0) {
            return true
          }
        } else {
          if (attrs[key] && attrs[key].secondary && attrs[key].secondary.length > 0) {
            return true
          }
        }
      }
    }
    return false
  } else {
    return false
  }
}

// 验证 是否 含有 标定属性
export const verifyQuestionHasAtrr = (ques) => {
  let result = {}

  let questionStructure = ques.question.questionStructure
  let item = questionShowPart[questionStructure]

  if (item.c === 0) {
    result = hasContentExplainAtrr(ques, item)
    return result
  } else {
    let needAttr = 1
    let cIndex = 0
    let subcIndex = 0

    if (item.some === 1) {
      needAttr = 0
    }
    if (!(ques.children && ques.children.length)) {
      return false
    }
    for (let child of ques.children) {
      let cqstructure = child.question.questionStructure
      // cqstructure 是否 是特殊 需求 23 24 25 27
      let sitem = questionShowPart[cqstructure]
      if (sitem.c === 0) {
        if (hasContentExplainAtrr(child, sitem)) {
          return true
        }
      } else {
        if (child.children && child.children.length) {
          for (let subchild of child.children) {
            let subcqstructure = subchild.question.questionStructure
            let subitem = questionShowPart[subcqstructure]
            if (hasContentExplainAtrr(subchild, subitem)) {
              return true
            }
          }
        }
      }
    }
    return false
  }
}
