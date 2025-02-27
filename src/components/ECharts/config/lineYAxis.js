export default {
  type: 'value',
  name: '能力值',
  max: 9,
  min: 0,
  nameGap: 12,
  splitNumber: 10,
  minInterval: 1, // 自动计算的坐标轴最小间隔大小。
  axisLine: {
    show: true, // 是否显示坐标轴轴线。
    lineStyle: {
      color: '#999',
      width: 0.5
    }
  },
  axisTick: {
    show: false // 是否显示坐标轴刻度。
  },
  splitLine: {
    // show: true, // 是否显示分隔线。默认数值轴显示，类目轴不显示。
    lineStyle: {
      color: '#999',
      width: 0.5
    }
  }
}
