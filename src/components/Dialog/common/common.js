import CTS from '@/common/js/constant'
import { filterSuffixchars } from '@/common/helper/search-keywords.js'
import { removeDivPBr } from '@/common/js/regular-util.js'
// 拆试题 合并试题
const signConfig = {
  sign1:
    '<img typedata="sign" quesdata="1" src="' +
    import.meta.env.VITE_STATIC_FILE +
    '/img/edit/cpsign1.png" />',
  sign2:
    '<img typedata="sign" quesdata="2" src="' +
    import.meta.env.VITE_STATIC_FILE +
    '/img/edit/cpsign2.png" />',
  sign3:
    '<img typedata="sign" quesdata="3" src="' +
    import.meta.env.VITE_STATIC_FILE +
    '/img/edit/cpsign3.png" />',
  sign4:
    '<img typedata="sign" quesdata="4" src="' +
    import.meta.env.VITE_STATIC_FILE +
    '/img/edit/cpsign4.png" />',
  sign5:
    '<img typedata="sign" quesdata="5" src="' +
    import.meta.env.VITE_STATIC_FILE +
    '/img/edit/cpsign5.png" />',
  sign6:
    '<img typedata="sign" quesdata="6" src="' +
    import.meta.env.VITE_STATIC_FILE +
    '/img/edit/cpsign6.png" />',
  sign7:
    '<img typedata="sign" quesdata="7" src="' +
    import.meta.env.VITE_STATIC_FILE +
    '/img/edit/cpsign7.png" />',
  sign8:
    '<img typedata="sign" quesdata="8" src="' +
    import.meta.env.VITE_STATIC_FILE +
    '/img/edit/cpsign8.png" />',
  sign9:
    '<img typedata="sign" quesdata="9" src="' +
    import.meta.env.VITE_STATIC_FILE +
    '/img/edit/cpsign9.png" />',
}

function getSevenOption(ques) {
  if (
    ques &&
    ques.question &&
    ques.question.context &&
    ques.question.context.options
  ) {
    return ques.question.context.options.length
  } else {
    return 5
  }
}

function getSevenAnswer(ques) {
  if (ques && ques.children) {
    return ques.children.length
  } else {
    return 7
  }
}

function closeHtmlLabel(html) {
  var temp = document.createElement('div')
  temp.innerHTML = html
  return temp.innerHTML
}

// 合并试题

function questiontoString(currentQues) {
  //  题干 选项 答案和 解析
  var contents = ''
  let isJudge = false
  if (currentQues.question && currentQues.question.context) {
    if (currentQues.question.questionStructure == '14') {
      isJudge = true
    }
    contents += currentQues.question.context.stem || ''
    let options = currentQues.question.context.options
    let list = []
    if (options && options.length) {
      list = options.map(item => {
        return signConfig.sign5 + item
      })
    }
    if (list.length) {
      contents += '<br />' + list.join('<br />')
    }
  }

  let analysisList = []
  let answerList = []

  // 答案 解析
  if (currentQues.explain && currentQues.explain[0]) {
    let explain = currentQues.explain[0]
    //  如果是 判断题 特殊显示
    let answers = explain.answers
    if (answers && answers[0] && answers[0][0]) {
      if (!isJudge) {
        // contents += '<br />' + signConfig.sign7 + answers.map(item => {
        //   return item.join(';')
        // })
        let alist = answers.map(item => {
          return item.join(';')
        })
        answerList.push(alist.join(''))
      } else {
        if (answers[0][0] == '1') {
          // contents += '<br />' + signConfig.sign7 + '对'
          answerList.push('对')
        } else if (answers[0][0] === '0') {
          // contents += '<br />' + signConfig.sign7 + '错'
          answerList.push('错')
        } else {
          // contents += '<br />' + signConfig.sign7 + answers[0][0]
          answerList.push(answers[0][0])
        }
      }
    }
    // 解析
    if (explain.analysis) {
      // contents += '<br />' + signConfig.sign6 + explain.analysis
      analysisList.push(explain.analysis)
    }
  }

  return {
    contents,
    answerList,
    analysisList,
  }
}

function trimChar(str, char) {
  let list = str.split(char)
  list = list.filter(item => item && item.length > 0)
  return list.join(char)
}

function filterTrimChar(str) {
  return closeHtmlLabel(trimChar(str, '<br />'))
}

function executeSeparateQuestion(currentQuestion, answerList, analysisList) {
  let question = questiontoString(currentQuestion)
  answerList.push(...question.answerList)
  analysisList.push(...question.analysisList)
  return question.contents
}

export function separateQuestion(currentQuestion) {
  let questionStr = signConfig.sign3
  let answerList = [] // 答案
  let analysisList = [] // 解析
  let resolverList = [] // 分析

  if (currentQuestion.children && currentQuestion.children.length) {
    questionStr += executeSeparateQuestion(
      currentQuestion,
      answerList,
      resolverList,
    )
    for (let sub of currentQuestion.children) {
      let subStr = ''
      // 小小题
      if (sub && sub.children.length) {
        subStr =
          '<br />' +
          signConfig.sign4 +
          executeSeparateQuestion(sub, answerList, resolverList)
        for (let subcChild of sub.children) {
          subStr +=
            '<br />' +
            signConfig.sign8 +
            executeSeparateQuestion(subcChild, answerList, analysisList)
        }
      } else {
        subStr =
          '<br />' +
          signConfig.sign4 +
          executeSeparateQuestion(sub, answerList, analysisList)
      }
      questionStr += subStr
    }
  } else {
    questionStr += executeSeparateQuestion(
      currentQuestion,
      answerList,
      analysisList,
    )
  }

  //  增加 解析 和 分析
  questionStr += answerList
    .map(item => {
      return '<br />' + signConfig.sign7 + item
    })
    .join('')

  questionStr += analysisList
    .map(item => {
      return '<br />' + signConfig.sign6 + item
    })
    .join('')

  if (resolverList.length > 0) {
    questionStr += '<br />' + signConfig.sign9 + resolverList[0]
  }

  return questionStr
}

export const splitSeparateQuestion1 = function(content, questionType) {
  // quesdata="1"  1：习题集  2：结构  3：试题
  var questionStructure = questionType.substr(0, 2)
  var pattern1 = '<img typedata="sign" '
  var pattern2 = /quesdata=(.*?)\/>/
  let strlist = content.split(pattern1)
  if (strlist[0] && strlist[0].indexOf('quesdata') === -1) {
    // 第一个是否包含 quesdata 如果不包含则 移除
    strlist.shift()
  }
  let linelist = []

  for (let sub of strlist) {
    let qtype = parseInt(sub[10])
    if (qtype) {
      linelist.push({
        type: qtype,
        text: filterTrimChar(sub.replace(pattern2, '')),
      })
    }
  }

  // 将试题 切出来
  // ['', '习题集', '结构', '3试题', '4小题', '选项', '解析', '答案','8小小题']
  //  去除 头尾的 [<br />]  trimChar(str,'<br \/>')
  // console.log(linelist)

  let tempQuestion = {
    children: [],
    questions: [],
    type: 3,
  }
  //  小题到 下一个小题
  // 小小题 到 下一个 小小题 或者是 小题
  let stackQuestion = [tempQuestion]
  var currentQues = tempQuestion
  for (let line of linelist) {
    if (line.type === 4) {
      let subQues = {
        children: [],
        questions: [line],
        type: 4,
      }
      if (currentQues.type === 3) {
        // 当前试题 为 大题
        stackQuestion.push(subQues)
      } else {
        // 当前试题不是 大题
        stackQuestion.pop() // 抛出当前试题
        stackQuestion.push(subQues)
      }
      tempQuestion.children.push(subQues)
      currentQues = subQues
    } else if (line.type === 8) {
      if (currentQues.type === 3) {
        // 当前试题为大题 把小小题修改为 小题
        let subQues = {
          children: [],
          questions: [line],
          type: 4,
        }
        currentQues.children.push(subQues)
        stackQuestion.push(subQues)
        currentQues = subQues
      } else if (currentQues.type === 4) {
        // 当前试题为小题
        let subChildQues = {
          children: [],
          questions: [line],
          type: 8,
        }
        currentQues.children.push(subChildQues)
        currentQues = subChildQues
      } else {
        // 当前试题为 小小题
        let subChildQues = {
          children: [],
          questions: [line],
          type: 8,
        }
        // 抛出 当前试题
        // 获取 尾部的试题
        let subQues = stackQuestion[stackQuestion.length - 1]
        if (subQues && subQues.type === 4) {
          subQues.children.push(subChildQues)
        }
        currentQues = subChildQues
      }
    } else {
      currentQues.questions.push(line)
    }
  }
  //
  let structItem = CTS.cfgDict.questionShowPart[questionStructure]
  let analysisQues = null
  // console.log(tempQuestion)
  if (structItem.c === 1) {
    analysisQues = getQuestionExplain(tempQuestion, questionType)
    if (tempQuestion.children && tempQuestion.children.length > 0) {
      for (let sub of tempQuestion.children) {
        let childQues = getQuestionExplain(sub, questionType, true)
        analysisQues.children.push(childQues)
        if (sub.children && sub.children.length) {
          for (let subchild of sub.children) {
            childQues.children.push(
              getQuestionExplain(subchild, questionType, true),
            )
          }
        }
      }
    }
  } else {
    // 单试题
    analysisQues = getQuestionExplain(tempQuestion, questionType, false)
  }
  // console.log(tempQuestion)
  // 解析 tempQuestion
  // console.log(analysisQues)
  // console.log(JSON.stringify(analysisQues))

  return analysisQues
}
// ['', '习题集', '结构', '3试题', '4小题', '5选项', '6解析', '7答案','8小小题']
// function getQuestionExplain1(currentQues, questionType, isChild) {
//   let questions = currentQues.questions
//   let explain = {}
//   let question = {
//     context: {
//       options: [],
//       stem: '',
//     },
//     questionStructure: questionType.substr(0, 2),
//     questionType: questionType,
//   }
//   for (let line of questions) {
//     if (line.type === 3 || line.type === 4 || line.type === 8) {
//       question.context.stem = line.text
//     } else if (line.type === 5) {
//       question.context.options.push(line.text)
//     } else if (line.type === 6) {
//       explain.analysis = line.text
//     } else if (line.type === 7) {
//       explain.answers = [[line.text]]
//     }
//   }
//   if (isChild) {
//     //  是否有 小题
//     if (currentQues.children && currentQues.children.length > 0) {
//       question.questionStructure = '16'
//     } else if (question.context.options.length > 0) {
//       // 选择题
//       question.questionStructure = '11'
//     } else {
//       // 填空题 或者是解答题
//       if (explain.answers && explain.answers[0] && explain.answers[0][0]) {
//         let answers = explain.answers[0][0]
//         if (answers === '对' || answers === '错') {
//           question.questionStructure = '14'
//           if (answers === '对') {
//             explain.answers = [['1']]
//           } else {
//             explain.answers = [['0']]
//           }
//         } else {
//           question.questionStructure = '15'
//         }
//       } else {
//         question.questionStructure = '15'
//       }
//     }
//   } else {
//     if (question.questionStructure == '14') {
//       if (explain.answers && explain.answers[0] && explain.answers[0][0]) {
//         let answers = explain.answers[0][0]
//         if (answers === '对' || answers === '错') {
//           question.questionStructure = '14'
//           if (answers === '对') {
//             explain.answers = [['1']]
//           } else {
//             explain.answers = [['0']]
//           }
//         }
//       }
//     }
//   }
//   return {
//     explain: [explain],
//     question: question,
//     children: [],
//   }
// }

function separateHtmlData(html) {
  let reg1 = /<img(.*?)\/>/g
  let signresults = html.match(reg1)
  let tickKey = '$cpsign$'
  let signList = []
  for (let sub of signresults) {
    if (sub.indexOf('typedata="sign"') !== -1) {
      html = html.replace(sub, '$cpsign$')
      signList.push(sub)
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
        qtype: parseInt(item[1]),
        text: filterTrimChar(list[i]),
      })
    }
  }
  return results
}

export const splitSeparateQuestion = function(content, questionType) {
  // quesdata="1"  1：习题集  2：结构  3：试题
  var questionStructure = questionType.substr(0, 2)
  // var pattern1 = '<img typedata="sign" '
  // var pattern2 = /quesdata=(.*?)\/>/
  // let strlist = content.split(pattern1)
  // if (strlist[0] && strlist[0].indexOf('quesdata') === -1) {
  //   // 第一个是否包含 quesdata 如果不包含则 移除
  //   strlist.shift()
  // }
  let linelist = []
  let analysisList = []
  let answersList = []
  let resolverList = []

  let strlist = separateHtmlData(content)

  console.log(strlist)

  for (let sub of strlist) {
    let qtype = sub.qtype
    if (qtype) {
      let item = {
        type: qtype,
        text: sub.text,
      }
      if (qtype === 6) {
        analysisList.push(item)
      } else if (qtype === 7) {
        // 去除 前后空格 和换行
        item.text = filterSuffixchars(item.text)
        answersList.push(item)
      } else if (qtype === 9) {
        resolverList.push(item)
      } else {
        linelist.push(item)
      }
    }
  }

  // 将试题 切出来
  // ['', '习题集', '结构', '3试题', '4小题', '选项', '解析', '答案','8小小题']
  //  去除 头尾的 [<br />]  trimChar(str,'<br \/>')
  // console.log(linelist)

  let tempQuestion = {
    children: [],
    questions: [],
    type: 3,
  }
  //  小题到 下一个小题
  // 小小题 到 下一个 小小题 或者是 小题
  let stackQuestion = [tempQuestion]
  var currentQues = tempQuestion
  for (let line of linelist) {
    if (line.type === 4) {
      let subQues = {
        children: [],
        questions: [line],
        type: 4,
      }
      if (currentQues.type === 3) {
        // 当前试题 为 大题
        stackQuestion.push(subQues)
      } else {
        // 当前试题不是 大题
        stackQuestion.pop() // 抛出当前试题
        stackQuestion.push(subQues)
      }
      tempQuestion.children.push(subQues)
      currentQues = subQues
    } else if (line.type === 8) {
      if (currentQues.type === 3) {
        // 当前试题为大题 把小小题修改为 小题
        let subQues = {
          children: [],
          questions: [line],
          type: 4,
        }
        currentQues.children.push(subQues)
        stackQuestion.push(subQues)
        currentQues = subQues
      } else if (currentQues.type === 4) {
        // 当前试题为小题
        let subChildQues = {
          children: [],
          questions: [line],
          type: 8,
        }
        currentQues.children.push(subChildQues)
        currentQues = subChildQues
      } else {
        // 当前试题为 小小题
        let subChildQues = {
          children: [],
          questions: [line],
          type: 8,
        }
        // 抛出 当前试题
        // 获取 尾部的试题
        let subQues = stackQuestion[stackQuestion.length - 1]
        if (subQues && subQues.type === 4) {
          subQues.children.push(subChildQues)
        }
        currentQues = subChildQues
      }
    } else {
      currentQues.questions.push(line)
    }
  }
  //
  let structItem = CTS.cfgDict.questionShowPart[questionStructure]
  let analysisQues = null

  let analysisIndex = 0
  let answerIndex = 0
  if (structItem.c === 1) {
    // 解析 在大题上面
    analysisQues = getQuestionExplain(
      tempQuestion,
      questionType,
      false,
      resolverList[0],
    )
    if (tempQuestion.children && tempQuestion.children.length > 0) {
      for (let sub of tempQuestion.children) {
        if (sub.children && sub.children.length) {
          let childQues = getQuestionExplain(sub, questionType, true)
          analysisQues.children.push(childQues)
          for (let subchild of sub.children) {
            let littleChildQues = getQuestionExplain(
              subchild,
              questionType,
              true,
              analysisList[analysisIndex],
              answersList[answerIndex],
            )
            analysisIndex++
            answerIndex++
            childQues.children.push(littleChildQues)
          }
        } else {
          let childQues = getQuestionExplain(
            sub,
            questionType,
            true,
            analysisList[analysisIndex],
            answersList[answerIndex],
          )
          analysisIndex++
          answerIndex++
          analysisQues.children.push(childQues)
        }
      }
    }
  } else {
    // 单试题
    analysisQues = getQuestionExplain(
      tempQuestion,
      questionType,
      false,
      analysisList[analysisIndex],
      answersList[answerIndex],
    )
  }

  // 如果试题结构 为25 在大题的 题干上 添加
  // seven_option
  // seven_answer
  if (questionStructure == 25) {
    if (analysisQues.question && analysisQues.question.context) {
      let contextSeven = analysisQues.question.context
      contextSeven.seven_option = getSevenOption(analysisQues)
      contextSeven.seven_answer = getSevenAnswer(analysisQues)
    }
  }

  return analysisQues
}

function getQuestionExplain(
  currentQues,
  questionType,
  isChild,
  analysis = null,
  answers = null,
) {
  let questions = currentQues.questions
  let explain = {}
  let question = {
    context: {
      options: [],
      stem: '',
    },
    questionStructure: questionType.substr(0, 2),
    questionType: questionType,
  }
  if (analysis) {
    explain.analysis = analysis.text
  }
  if (answers) {
    explain.answers = [[answers.text || '']]
  }

  for (let line of questions) {
    if (line.type === 3 || line.type === 4 || line.type === 8) {
      question.context.stem = line.text
    } else if (line.type === 5) {
      question.context.options.push(line.text)
    }
  }
  if (isChild) {
    //  是否有 小题
    if (currentQues.children && currentQues.children.length > 0) {
      question.questionStructure = '16'
    } else if (question.context.options.length > 0) {
      // 选择题
      question.questionStructure = '11'
      // answers
      if (answers) {
        explain.answers = [[removeDivPBr(answers.text || '')]]
      }
    } else {
      // 填空题 或者是解答题
      // removeDivPBr
      if (explain.answers && explain.answers[0] && explain.answers[0][0]) {
        let answers = explain.answers[0][0]
        if (answers === '对' || answers === '错') {
          question.questionStructure = '14'
          if (answers === '对') {
            explain.answers = [['1']]
          } else {
            explain.answers = [['0']]
          }
        } else {
          question.questionStructure = '15'
        }
      } else {
        question.questionStructure = '15'
      }
    }
  } else {
    if (question.questionStructure == '14') {
      if (explain.answers && explain.answers[0] && explain.answers[0][0]) {
        let answers = explain.answers[0][0]

        answers = removeDivPBr(answers)
        //  去 <div> <br /> <p>
        if (answers === '对' || answers === '错') {
          question.questionStructure = '14'
          if (answers === '对') {
            explain.answers = [['1']]
          } else {
            explain.answers = [['0']]
          }
        }
      }
    }
  }
  return {
    explain: [explain],
    question: question,
    children: [],
  }
}
