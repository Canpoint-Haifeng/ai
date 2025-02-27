// 去 div p br 等标签 &nbsp;
export function removeDivPBr(separate) {
  let regular = /<div(.*?)>|<\/div>|<br(.*?)>|<p(.*?)>|<\/p>|&nbsp;/g
  separate = separate.replace(regular, '')
  return separate
}

/// ^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, ''
// 去掉 开始 和 结束 的 换行和空格
