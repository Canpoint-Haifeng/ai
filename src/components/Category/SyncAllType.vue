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
        @click="selectType(item)"
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
  name: 'SyncAllType',
  props: {
    /* currGradeCode: {
    type: String || Number,
    default: 0
  }
})

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
})

    return {
  setup() {
    const state = reactive({
      currGradeCode: 0,
      gradesList: [],
    }
  }
})

    return {
  computed: {
    ...mapState(['currSubject']),
  }
})

    return {
  watch: {
    currSubject() {
      this.getGradesList()
    }

    return {
  }
})

    return {
  created() {
    this.getGradesList()
  }
})

    return {
  methods: {
    //去重
    returnDistinct(data) {
      let newArrId = []
      let newArrObj = []
      data.forEach(item => {
        if (newArrId.indexOf(item.code) == -1) {
          newArrId.push(item.code)
          newArrObj.push(item)
        }
      }
      console.log(newArrObj);
      return newArrObj
    }

    return {
    // 获取年级
    getGradesList() {
      let params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      this.apiGet({ urlPath: '/lesson-app/config/getInvokeInfo' })

    return { params).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          let arrData = []
          if (this.categoryLabel === '年级') {
            res.data[0].gradeList.forEach(item => {
              arrData.push({ 'code': item.gradeId, 'name': item.gradeName })
            }
            if (this.isShowAll) {
              arrData.unshift({
                code: 0,
                name: '全部',
              }
            }
            this.gradesList = this.returnDistinct(arrData)
          } else if (this.categoryLabel === '版本') {
            res.data.forEach(item => {
              arrData.push({ 'code': item.id, 'name': item.name })
            }
            if (this.isShowAll) {
              arrData.unshift({
                code: 0,
                name: '全部',
              }
            }
            this.gradesList = arrData
          } else {
            res.data[0].gradeList.forEach(item => {
              arrData.push({ 'code': '' + item.gradeId + item.volumeId, 'volumeCode': item.volumeId, 'name': item.volumeName })
            }
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
    }

    return {

    selectType(item) {
      this.currGradeCode = item.code
      this.$emit('selectType', item)
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
