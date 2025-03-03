<template>
  <div class="user-category-content">
    <label
      :class="categoryLabel && categoryLabel.length >= 4
        ? 'category-label-4'
        : 'category-label'
      "
    >{{ categoryLabel }}</label>
    <div class="category-list">
      <div
        v-for="item in gradesData"
        :key="item.gradeId"
        class="category-item"
        :class="item.gradeId == currGradeId ? 'active' : ''"
        @click="selectGrade(item)"
      >
        {{ item.gradeName }}
      </div>

      <span
        v-if="currGradeId === 5"
        class="general-custom"
      >
        <!-- <span class="general-custom">自定义</span> -->
        <paper-times-picker
          style="position: absolute; margin-top: -2px"
          @select-times="selectTimes"
        />
      </span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { PaperTimesPicker } from '@/components/CpFan/index.js'
moment.locale('zh-cn')
export default {
  name: 'PaperTime',
  components: {
    PaperTimesPicker,
  },
  props: {
    categoryLabel: {
      type: String,
      default: '时间',
    },
    ctype: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      currGradeId: 0,
      gradesData: [
        {
          gradeId: 0,
          gradeName: '全部',
        },
        {
          gradeId: 1,
          gradeName: '近一周',
        },
        {
          gradeId: 2,
          gradeName: '近一月',
        },
        {
          gradeId: 3,
          gradeName: '近半年',
        },
        {
          gradeId: 4,
          gradeName: '近一年',
        },
        {
          gradeId: 5,
          gradeName: '自定义',
        }
      ],
    }
  },
  created() { },
  methods: {
    selectTimes(item) {
      let result = {
        timeBegin: '',
        timeEnd: '',
      }
      if (item) {
        result = {
          timeBegin: item[0].getTime() / 1000,
          timeEnd: item[1].getTime() / 1000,
        }
      }

      this.$emit('selectTime', result)
    },
    selectGrade(item) {
      this.currGradeId = item.gradeId
      let result = {
        timeBegin: '',
        timeEnd: '',
      }
      switch (item.gradeId) {
        case 0:
          // 全部
          result = {
            timeBegin: '',
            timeEnd: '',
          }
          break
        case 1:
          // 本周
          result = {
            timeBegin: moment().startOf('week').valueOf() / 1000,
            timeEnd: (moment().endOf('week').valueOf() + 1) / 1000 - 1,
          }
          break
        case 2:
          // 本月
          result = {
            timeBegin: moment().startOf('month').valueOf() / 1000,
            timeEnd: (moment().endOf('month').valueOf() + 1) / 1000 - 1,
          }
          break
        case 3:
          // 半年
          result = {
            timeBegin: moment().startOf('year').valueOf() / 1000,
            timeEnd: (moment().valueOf()) / 1000 - 1,
          }
          break
        case 4:
          // 一年
          result = {
            timeBegin: moment().startOf('year').valueOf() / 1000,
            timeEnd: (moment().endOf('year').valueOf() + 1) / 1000 - 1,
          }
          break
        default:
          result
      }
      this.$emit('selectTime', result)
    },
  },
}
</script>

<style lang="scss" scoped></style>
