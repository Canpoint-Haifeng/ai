// 适用难度
export const suitTypeList = [
  { label: '基础课', value: 1 },
  { label: '标准课', value: 2 },
  { label: '拔高课', value: 3 },
]
export const smartRadioList = [
  { title: '适用难度', list: suitTypeList, value: 'suitType' }
]
// 页面类型
export const pageTypeList = [
  { label: '章节', value: 1, 'select': smartRadioList },
  { label: '知识点', value: 2, 'select': smartRadioList },
  { label: '专题', value: 3, 'select': smartRadioList },
]