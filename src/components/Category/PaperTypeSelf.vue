<template>
  <div
    v-if="typesList.length"
    class="user-category-content"
  >
    <label
      :class="categoryLabel && categoryLabel.length >= 4
        ? 'category-label-4'
        : 'category-label'
      "
    >{{ categoryLabel }}</label>
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
</template>

<script>
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
export default {
  name: 'PaperTypeSelf',
  props: {
    categoryLabel: {
      type: String,
      default: '类型',
    },
    // 是否显示全部
    isShowAll: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currTypeCode: '',
      currSubTypeCode: 0,
      typesList: [],
    }
  },
  computed: {
    ...mapState(['currSubject']),
    currSubType() {
      let children = []
      this.typesList.forEach((item) => {
        if (item.code === this.currTypeCode) {
          children = item.children
        }
      })
      return children
    },
  },
  watch: {
    currSubject() {
      this.getTypesList()
    },
  },
  created() {
    this.getTypesList()
  },
  methods: {
    // 获取当前学段试卷类型
    getTypesList() {
      this.typesList = [
        { code: '', name: '全部' },
        { code: '0', name: '我的试卷' },
        { code: '1', name: '共享试卷' },
      ]
    },
    selectType(item, params) {
      this[params] = item.code
      this.$emit('selectType', item)
    },
  },
}
</script>

<style lang="scss" scoped></style>
