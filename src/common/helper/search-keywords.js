// 将支付串中的数字分离
function splitCharacterUtil(content) {
  if (!content) {
    return []
  }
  let list = []
  let keywordlist = content.split(/\d+/)
  let matchlist = content.match(/\d+/g) || []
  // console.log(keywordlist,matchlist)
  keywordlist.forEach((item, index) => {
    if (item) {
      let itemkeys = item.match(/&(.*?);|<[^>]+>|[^<|>|\w]|\w+\b|\s+/gm) || []
      // console.log(item,itemkeys)
      list.push(...itemkeys)
    }
    if (matchlist[index]) {
      list.push(matchlist[index])
    }
  })
  return list
}
// 用于显示 keywords

export function executeSearchKeyWord(stem, keyworddict) {
  // &nbsp;|&#8203;
  let matchres = stem.match(
    /<span class="math-tex">(.*?)<\/span>|&(.*?);|<[^>]+>|[^<|>|\w]|\w+\b|\s+/gm,
  )
  // console.log(stem,matchres)
  if (!matchres) return ''
  let reg = /&(.*?);|<|>/
  let list = matchres.map(item => {
    if (!reg.test(item)) {
      let itemkeys = item.match(/<[^>]+>|[^<|>|\w]|\w+\b|\s+/gm) || []
      let itemkeysList = itemkeys.map(words => {
        // console.log(words)
        if (keyworddict[words]) {
          return "<span style='color:#ff0000'>" + words + '</span>'
        }
        return words
      })
      return itemkeysList.join('')
    }
    return item
  })
  // console.log(list)
  return list.join('')
}

export function dealQuestion(item, keywords) {
  let keywordlist = splitCharacterUtil(keywords || '')
  let keyworddict = {}
  keywordlist.forEach(key => {
    keyworddict[key] = true
  })
  // console.log(keywords,keywordlist,keyworddict)
  if (item && item.questionInfo && item.questionInfo.context) {
    if (item.questionInfo.context.stem) {
      item.questionInfo.context.stem = executeSearchKeyWord(
        item.questionInfo.context.stem,
        keyworddict,
      )
    }
    if (item.questionInfo.context.options) {
      item.questionInfo.context.options = item.questionInfo.context.options.map(
        option => {
          return executeSearchKeyWord(option, keyworddict)
        },
      )
    }
    //  如果 有选项 选项也处理下
    if (item.questionInfo.children && item.questionInfo.children.length > 0) {
      item.questionInfo.children.forEach(child => {
        if (child.context && child.context.stem) {
          child.context.stem = executeSearchKeyWord(
            child.context.stem,
            keyworddict,
          )
        }
        if (child.context && child.context.options) {
          child.context.options = child.context.options.map(option => {
            return executeSearchKeyWord(option, keyworddict)
          })
        }
      })
    }
  }
}

// 清理 字符串 前面 和 后面的 换行 和 空格 '&nbsp;', '<br />', '<br>', ' '
export function filterSuffixchars(html) {
  let Reg = /<span class="math-tex">(.*?)<\/span>|&(.*?);|<[^>]+>|[^<|>|\w]|<br \/>|<br>|\w+\b|\s+/gm
  let testReg = ['&nbsp;', '<br />', '<br>', ' ']
  html = html || ''
  let matchres = html.match(Reg)
  if (!matchres) return ''
  let front = true
  let later = true
  while ((front || later) && matchres.length > 0) {
    if (front) {
      if (testReg.indexOf(matchres[0]) !== -1) {
        matchres.shift()
      } else {
        front = false
      }
    } else {
      if (testReg.indexOf(matchres[matchres.length - 1]) !== -1) {
        matchres.pop()
      } else {
        later = false
      }
    }
  }
  return matchres.join('')
}
