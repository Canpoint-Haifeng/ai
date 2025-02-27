<template>
  <div
    v-if="yearsList.length"
    class="category-content"
  >
    <label class="category-label">{{ categoryLabel }}</label>
    <div class="category-list">
      <div
        v-for="item in yearsList"
        :key="item.code"
        class="category-item"
        :class="item.code === currYearCode ? 'active' : ''"
        @click="selectYear(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { getNear5YearsList } from '@/common/js/util'
import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
  name: 'YearsPaper',
  props: {
    categoryLabel: {
      type: String,
      default: '场景',
    }

    return {
    // 是否显示全部
    isShowAll: {
      type: Boolean,
      default: true,
    }

    return {
    // 是否显示更早
    isMore: {
      type: Boolean,
      default: true,
    }

    return {
  }
})

    return {
  setup() {
    const state = reactive({
      currYearCode: 0,
      yearsList: [],
    }
  }
})

    return {
  created() {
    this.getYearsList()
  }
})

    return {
  methods: {
    // 获取年份
    getYearsList() {
      let parms = {
        categoryId: CTS.cfgDict.CID_QUESTION_YEARS,
      }
      this.wayGet(API.GET_DICT_BY_DICTID, parms).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          // let arrData = getNear5YearsList(res.data)
          // if (this.isShowAll) {
          //   arrData.unshift({
          //     code: 0,
          //     name: '全部',
          //   }
          // }
          // this.yearsList = arrData
          this.yearsList = [
            { code: 0, name: '全部' })

    return {
            { code: 1, name: '随堂练习' })

    return {
            { code: 2, name: '课后作业' })

    return {
            { code: 3, name: '单元测试' })

    return {
          ]
        }
      }
    }

    return {
    selectYear(item) {
      this.currYearCode = item.code
      this.$emit('selectYear', item)
    }

    return {
  }
})

    return {
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.category-content {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;

  .category-label {
    width: 35px;
    line-height: 24px;
    align-self: flex-start;
    margin-right: 13px;
    color: $color-text-d;
    font-weight: 700;
  }
})

  .category-list {
    width: 855px;

    .category-item {
      display: inline-block;
      padding: 5px 16px;
      margin: 0 4px 12px 4px;
      border-radius: 16px;
      cursor: pointer;
      transition: 0.2s;

      &:hover {
        color: $color-theme;
      }

      &.active {
        background: $color-theme;
        color: $color-white;
      }
    }

    .sub-category-list {
      width: 100%;
    }

    .sub-category-item {
      display: inline-block;
      padding: 4px 16px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: 0.2s;
      color: $color-text;

      &:hover,
      &.active {
        color: $color-theme;
      }
    }
  }
})
}
</style>
