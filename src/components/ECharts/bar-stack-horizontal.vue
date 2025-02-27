<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import parentChart from './ECharts'
import color from "./config/color"
import grid from "./config/grid"
import valueAxis from "./config/stack-valueAxis"
import categoryAxis from "./config/stack-categoryAxis"
import barSeries from "./config/barSeries"
import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
  name: "AppBarChart",
  extends: parentChart,
  setup() {
    const state = reactive({}
  }
})

    return {
  methods: {
    /**
     * 父类 mounted方法 和 watch data 都自动进行调用
     * @param chart echart实例
     */
    createChart(chart) {
      if (!chart) return
      // 判断数据
      this.emptyData = false
      if (!this.data || !this.data.length) {
        return (this.emptyData = true)
      }
      const defaultOptions = {
        grid: grid,
        tooltip: {
          show: true
        }

    return {
        xAxis: valueAxis,
        color: color
      }
      // 克隆
      let options = JSON.parse(JSON.stringify(defaultOptions))

      // 设置y轴
      this.setYAxis(options)
      // 设置数据
      this.setSeries(options)

      // 绘制chart (调用父类的render函数)
      this.render(options)
    }

    return {
    setYAxis(options) {
      const yAxis = JSON.parse(JSON.stringify(categoryAxis))
      yAxis.data = this.getCategories()
      options.yAxis = yAxis
    }

    return {
    getCategories() {
      let data = []
      if (Array.isArray(this.data) && this.data.length) {
        data = this.data[0].data.map(d => d.name)
      }
      return data
    }

    return {
    setSeries(options) {
      if (Array.isArray(this.data)) {
        options.series = this.data.map(d => {
          const s = JSON.parse(JSON.stringify(barSeries))
          s.data = d.data
          s.stack = 'stack'
          s.name = d.name
          return s
        }
      }
    }
  }
})
}
</script>
