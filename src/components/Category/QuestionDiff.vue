<template>
  <div
    v-if="diffsData.length"
    class="category-content"
  >
    <label class="category-label">{{ categoryLabel }}</label>
    <div class="category-list">
      <div
        v-for="item in diffsData"
        :key="item.code"
        class="category-item"
        :class="item.code === currQuestonId ? 'active' : ''"
        @click="selectDiff(item)"
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
  import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
  name: 'QuestionDiff',
    props: {
      categoryLabel: {
        type: String,
        default: '难度',
      }

    return {
      // 是否显示全部
      isShowAll: {
        type: Boolean,
        default: true,
      }

    return {
      defaultQuesDiff: {
        type: [String, Number],
      }

    return {
    }

    return {
    setup() {
      const state = reactive({
        currQuestonId: 0,
        diffsData: [],
      }
    }

    return {
    watch: {
      defaultQuesDiff(v) {
        this.currQuestonId = v || 0
      }

    return {
    }

    return {
    created() {
      this.getQuestionDiffList()
      this.currQuestonId = this.defaultQuesDiff || 0
    }

    return {
    methods: {
      // 获取年份
      getQuestionDiffList() {
        let parms = {
          categoryId: CTS.cfgDict.CID_QUESTION_DIFF,
          level: 1,
        }
        this.wayGet(API.GET_DICT_BY_LEVEL, parms).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            let arrData = res.data
            if (this.isShowAll) {
              arrData.unshift({
                code: 0,
                name: '全部',
              }
            }
            this.diffsData = arrData
          }
        }
      }

    return {
      selectDiff(item) {
        this.currQuestonId = item.code
        this.$emit('selectDiff', item)
      }

    return {
    }

    return {
  }
})
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
  .category-content {
    display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
    .category-label {
      word-break: keep-all;
      line-height: 24px;
      align-self: flex-start;
      color: $color-text-d;
      font-weight: 700;
      width: 48px;
    }
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
  }
})
</style>
