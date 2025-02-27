export const pieOptions1 = {
    // color: ['#009688', '#FF5722', '#FF9800'],
    legend: {
        bottom: 0,
        left: 'center',
        // itemGap: 10,
        // itemWidth: 6, // 设置图例图形的宽
        // itemHeight: 6, // 设置图例图形的高
        orient: 'horizontal',
        // icon: 'circle',
        // textStyle: {
        //     fontSize: 12,
        //     fontWeight: 'normal',
        //     color: '#666'
        // }
    },
    tooltip: {
        trigger: 'item',
        formatter: (obj) => {
            return obj.name + ' : ' + obj.value + '题'
        }
    },
    series: {
        radius: ['45%', '60%'],
        center: ['40%', '45%'],
        itemStyle: {
        },
        // 设置值域的那指向线
        labelLine: {
            show: true,
            length: 12,
            length2: 0,
            cap: 'round',
        },
        // 设置值域的标签
        label: {
            fontSize: 14,
            fontWeight: 'bold',
            position: 'outer',
            formatter: (obj) => {
                return obj.value + '题'
            }
        }
    }
}
export const pieOptions2 = {
    legend: {
        bottom: 0,
        left: 'center',
        orient: 'horizontal',
    },
    tooltip: {
        trigger: 'item',
        formatter: (obj) => {
            return obj.name + ' : ' + obj.value + '题'
        }
    },
    series: {
        radius: '60%',
        center: ['50%', '45%'],
        itemStyle: {
        },
        labelLine: {
            show: true,
            length: 12,
            length2: 0,
            cap: 'round',
        },
        label: {
            fontSize: 14,
            fontWeight: 'bold',
            position: 'outer',
            formatter: (obj) => {
                return obj.value + '题'
            }
        }
    }
}
export const pieOptions3 = {
    legend: {
        bottom: 0,
        left: 'center',
        orient: 'horizontal',
    },
    tooltip: {
        trigger: 'item',
        formatter: (obj) => {
            return obj.name + ' : ' + obj.value
        }
    },
    series: {
        radius: '60%',
        center: ['50%', '45%'],
        itemStyle: {
        },
        labelLine: {
            show: true,
            length: 12,
            length2: 0,
            cap: 'round',
        },
        label: {
            fontSize: 14,
            fontWeight: 'bold',
            position: 'outer',
            formatter: (obj) => {
                return Math.round(obj.percent) + '%'
            }
        }
    }
}

export const barOptions = {
    legend: {
        name: ['题量', '分值'],
        bottom: 0,
        left: 'center',
        orient: 'horizontal',
    },
    grid: {
        top: '12%',
        left: '10%',
        right: '4%',
        bottom: '20%',
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    xAxis: {
        type: 'category',
        data: ['容易', '较易', '中等', '较难', '困难'],
        axisLabel: {
            // show: false,
            textStyle:{
                color: '#333'
            }
        },
        axisTick: {
            show: false,
        },
        axisLine: {
            lineStyle: {
                color: '#e2e2e2',
            },
        },
        minorTick: {
        },
    },
    yAxis: {
        type: 'value',
        axisLine: {
            show: false,
        },
        axisTick: {
            show: false,
        },
        minorTick: {
            lineStyle: {
                type: 'dashed'
            },
        },
        splitLine: {
            show: true,
            lineStyle: {
                type: 'dashed'
            },
        },
    },
    series: [
        {
            name: '题量',
            data: [12, 20, 15, 8, 7],
            type: 'bar',
            barWidth: 20,
            itemStyle: {
                color: '#689DFF',
                barBorderRadius:[4, 4, 4, 4],
            }
        },
        {
            name: '分值',
            data: [12, 20, 15, 8, 7],
            type: 'bar',
            barWidth: 20,
            itemStyle: {
                color: '#689DFF',
                barBorderRadius:[4, 4, 4, 4],
            }
        }
    ]
}
