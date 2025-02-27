<template>
  <div
    v-if="gradesList.length"
    class="category-content"
  >
    <label class="category-label">{{ categoryLabel }}</label>
    <div class="category-list">
      <div
        v-for="item in gradesList"
        :key="item.code"
        class="category-item"
        :class="item.code == currGradeCode ? 'active' : ''"
        @click="selectGrade(item)"
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
  import { mapState } from 'vuex'
  import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
    name: 'BookGrade',
    props: {
      /* currGradeCode: {
      type: String || Number,
      default: 0
    }

    return { */
      categoryLabel: {
        type: String,
        default: '年级',
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
        currGradeCode: 0,
        gradesList: [],
      }
    }

    return {
    computed: {
      ...mapState(['currSubject']),
    }

    return {
    watch: {
      currSubject() {
        this.getGradesList()
      }

    return {
    }

    return {
    created() {
      this.getGradesList()
    }

    return {
    methods: {
      // 获取年级
      getGradesList() {
        let parms = {
          categoryId: CTS.cfgDict.CID_USER_PERIOD_GRADE,
          code: this.currSubject.periodCode,
        }
        this.wayGet(API.GET_CHILD_DICT, parms).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            let arrData = res.data.filter(item => item.level === 2)
            if (this.isShowAll) {
              arrData.unshift({
                code: 0,
                name: '全部',
              }
            }
            this.gradesList = arrData
          }
        }
      }

    return {
      selectGrade(item) {
        this.currGradeCode = item.code
        this.$emit('selectGrade', item)
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
      /*width: 35px;*/
      line-height: 24px;
      align-self: flex-start;
      margin-right: 13px;
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
