export const setpieOptions = (titleText, graphicText, graphicTotal) => {
  const pieOptions = {
    title: {
      text: titleText,
      left: 171 + 44,
      top: 20,
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    legend: {
      top: 40,
      left: 420 + 44,
      itemGap: 10,
      itemWidth: 6, // 设置图例图形的宽
      itemHeight: 6, // 设置图例图形的高
      orient: 'vertical',
      icon: 'circle',
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal',
        color: '#666'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (obj) => {
        return obj.name + ' : ' + Math.round(obj.percent) + '%'
      }
    },
    graphic: {
      type: 'text',
      top: 125,
      left: 285 + 40,
      style: {
        text: `${graphicText}\n（${graphicTotal}）`,
        textAlign: 'center',
        fill: '#666',
        width: 30,
        height: 30
      }
    },
    series: {
      radius: ['35%', '50%'],
      center: ['45%', '55%'],
      itemStyle: {
      // emphasis：英文意思是 强调;着重;（轮廓、图形等的）鲜明;突出，重读
      // emphasis：设置鼠标放到哪一块扇形上面的时候，扇形样式、阴影
      // shadowColor: 'rgba(255, 110, 93, 0.3)',
      // shadowBlur: 10,
      // shadowOffsetX: 0,
      // shadowOffsetY: 0,
      // emphasis: {
      //   show: true,
      //   shadowBlur: 10,
      //   shadowOffsetX: 0,
      //   shadowColor: 'rgba(30, 144, 255，0.5)'
      // }
      // color: {
      //   type: 'linear',
      //   x: 0,
      //   y: 0,
      //   x2: 0,
      //   y2: 1,
      //   colorStops: [{
      //     offset: 0, color: 'red' // 0% 处的颜色
      //   }, {
      //     offset: 1, color: 'blue' // 100% 处的颜色
      //   }],
      //   global: false // 缺省为 false
      // }
      },
      // 设置值域的那指向线
      labelLine: {
        normal: {
          show: true // show设置线是否显示，默认为true，可选值：true ¦ false
        }
      },
      // 设置值域的标签
      label: {
        normal: {
          fontSize: 14,
          fontWeight: 'bold',
          position: 'outer', // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
          // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}
          // {a}指series.name  {b}指series.data的name
          // {c}指series.data的value  {d}%指这一部分占总数的百分比
          formatter: (obj) => {
            return Math.round(obj.percent) + '%'
          }
        }
      }
    }
  }
  return pieOptions
}
