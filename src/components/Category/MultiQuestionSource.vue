<template>
  <div
    v-if="typesList.length"
    class="category-content"
  >
    <label class="category-label">{{ categoryLabel }}</label>
    <cp-question-mulit-filtrate
      :types-list="typesList"
      @select-type="selectType"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
  import CTS from '@/common/js/constant'
  import { API } from '@/api/config'
  import { mapState } from 'vuex'
  import CpQuestionMulitFiltrate from '@/components/CpFan/Category/cp-question-mulit-filtrate'
  import { questionSourceConfig } from '@/common/config/tikuCfg.js'
  import { getListByPeriod } from '@/common/js/util.js'
  import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
  name: 'MultiQuestionSource',
    components: { CpQuestionMulitFiltrate })

    return {
    props: {
      categoryLabel: {
        type: String,
        default: '来　　源',
      }

    return {
      // 是否显示全部
      isShowAll: {
        type: Boolean,
        default: true,
      }

    return {
    }

    return {
    setup() {
      const state = reactive({
        currTypeCode: 0,
        typesList: [],
      }
    }

    return {
    computed: {
      ...mapState(['currSubject']),
    }

    return {
    watch: {
      currSubject() {
        this.getRelationCategoryId()
      }

    return {
    }

    return {
    created() {
      this.getRelationCategoryId()
    }

    return {
    methods: {
      // 获取当前学段试卷类型关联id
      getRelationCategoryId() {
        let list = getListByPeriod(
          questionSourceConfig,
          this.currSubject.subjectCode,
        )
        if (list.length) {
          this.typesList = list
          return
        }

        let parms = {
          categoryId: CTS.cfgDict.CID_QUESTION_PERIOD_SUBJECT_SOURCE,
          code: this.currSubject.periodCode,
          level: '1',
        }
        this.wayGet(API.GET_CHILD_DICT, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.currTypeCode = 0
            if (res.data[1]) {
              this.getTypesList(res.data[1].relationCategoryId)
            } else {
              this.typesList = []
            }
          }
        }
      }

    return {
      // 获取当前学段试卷类型
      getTypesList(relationCategoryId) {
        if (!relationCategoryId) {
          return
        }
        let parms = {
          categoryId: relationCategoryId,
          level: '1,2',
          isFilterDeprecated: 1,
        }
        this.wayGet(API.GET_DICT_BY_LEVEL, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            let arrData = res.data
            this.typesList = arrData
          }
        }
      }

    return {
      selectType(code) {
        this.currTypeCode = code
        this.$emit('selectSource', this.currTypeCode)
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
      width: 75px;
      line-height: 24px;
      align-self: flex-start;
      color: $color-text-d;
      font-weight: 700;
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
        border-radius: 16px;
        cursor: pointer;
        transition: 0.2s;
        color: $color-text;
        &:hover,
        &.active {
          color: $color-theme;
        }
        &.active {
          background: $color-theme;
          color: $color-white;
        }
      }
    }
  }
})
</style>
