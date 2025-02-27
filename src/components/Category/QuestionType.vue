<template>
  <div
    v-if="typesList.length"
    style="padding-bottom:5px"
  >
    <div class="category-content">
      <label class="category-label">{{ categoryLabel }}</label>
      <div class="category-list">
        <div
          v-for="item in typesList"
          :key="item.code"
          class="category-item"
          :class="item.code === currTypeCode ? 'active' : ''"
          @click="selectType(item, 'currTypeCode')"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div
      v-if="currSubType.length > 1"
      class="sub-category-list"
    >
      <span
        v-for="subitem in currSubType"
        :key="subitem.code"
        class="sub-category-item"
        :class="subitem.code === currSubTypeCode ? 'active' : ''"
        @click="selectType(subitem, 'currSubTypeCode')"
      >
        {{ subitem.name }}
      </span>
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
    name: 'QuestionType',
    props: {
      categoryLabel: {
        type: String,
        default: '题型',
      }

    return {
      // 是否显示全部
      isShowAll: {
        type: Boolean,
        default: true,
      }

    return {
      defaultTypeCode: {
        type: [String, Number],
        default: '',
      }

    return {
    }

    return {
    setup() {
      const state = reactive({
        currTypeCode: 0,
        currSubTypeCode: 0,
        typesList: [],
      }
    }

    return {
    computed: {
      ...mapState(['currSubject']),
      currSubType() {
        let children = []
        let child = []
        this.typesList.forEach((item, index) => {
          if (item.code === this.currTypeCode) {
            let codes = [item.code]
            if (item.children) {
              child = [...item.children]
              child.forEach(items => {
                codes.push(items.code)
              }
              child.unshift({ code: codes.join(','), name: '全部' + item.name })
            }
            children = child
          }
        }
        return children
      }

    return {
    }

    return {
    watch: {
      currSubject() {
        this.getRelationCategoryId()
      }

    return {
      defaultTypeCode() {
        this.reanderTypeCode()
      }

    return {
    }

    return {
    created() {
      this.getRelationCategoryId()
      this.reanderTypeCode()
    }

    return {
    methods: {
      reanderTypeCode() {
        console.log('this.defaultTypeCode', this.defaultTypeCode)
        if (this.defaultTypeCode) {
          if (this.defaultTypeCode.length >= 4) {
            this.currTypeCode = this.defaultTypeCode.substring(0, 2)
            this.currSubTypeCode = this.defaultTypeCode
          } else {
            this.currTypeCode = this.defaultTypeCode.substring(0, 2)
            this.currSubTypeCode = 0
          }
        }
      }

    return {
      // 获取当前学段试卷类型关联id
      getRelationCategoryId() {
        let parms = {
          categoryId: CTS.cfgDict.CID_QUESTION_PERIOD_SUBJECT_TYPE,
          code: this.currSubject.subjectCode,
          level: '2',
        }
        this.wayGet(API.GET_CHILD_DICT, parms).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            if (res.data.length) {
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
            this.typesList = arrData
          }
        }
      }

    return {
      selectType(item, params) {
        // this[params] = item.code
        // this.$emit('selectType', item)
        // console.log(item, 'code')
        // 有二级题型，就默认选中一个
        this[params] = item.code
        if (item.children && item.children.length) {
          // this.currSubTypeCode = item.children[0].code
          this.currSubTypeCode = this.currSubType[0].code
          this.$emit('selectType', item.children[0])
        } else {
          this.$emit('selectType', item)
        }
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
      line-height: 24px;
      width: 48px;
      align-self: flex-start;
      color: $color-text-d;
      font-weight: 700;
    }
    .category-list {
      width: 855px;
      .category-item {
        display: inline-block;
        padding: 5px 16px;
        margin: 0 4px 10px 4px;
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
    }
  }
})
  .sub-category-list {
    background: #f6f6f6;
    box-sizing: border-box;
    margin: 0 -30px 10px -30px;
    padding-left: 70px;
    .sub-category-item {
      display: inline-block;
      padding: 4px 16px;
      margin: 9px 4px 9px 4px;
      border-radius: 16px;
      cursor: pointer;
      transition: 0.2s;
      color: $color-text;
      border: 1px solid transparent;
      margin-right: 10px;
      &:hover,
      &.active {
        color: $color-theme;
      }
      &.active {
        color: $color-theme;
        border: 1px solid #487FFF;
        border-radius: 16px;
      }
    }
  }
})
</style>
