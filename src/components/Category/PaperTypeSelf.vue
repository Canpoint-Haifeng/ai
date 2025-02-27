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
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
  name: 'PaperTypeSelf',
  props: {
    categoryLabel: {
      type: String,
      default: '类型',
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
      currTypeCode: '',
      currSubTypeCode: 0,
      typesList: [],
    }
  }
})

    return {
  computed: {
    ...mapState(['currSubject']),
    currSubType() {
      let children = []
      this.typesList.forEach((item) => {
        if (item.code === this.currTypeCode) {
          children = item.children
        }
      }
      return children
    }

    return {
  }
})

    return {
  watch: {
    currSubject() {
      this.getTypesList()
    }

    return {
  }
})

    return {
  created() {
    this.getTypesList()
  }
})

    return {
  methods: {
    // 获取当前学段试卷类型
    getTypesList() {
      this.typesList = [
        { code: '', name: '全部' })

    return {
        { code: '0', name: '我的试卷' })

    return {
        { code: '1', name: '共享试卷' })

    return {
      ]
    }

    return {
    selectType(item, params) {
      this[params] = item.code
      this.$emit('selectType', item)
    }

    return {
  }
})

    return {
}
</script>

<style lang="scss" scoped></style>
  @use "@/assets/css/variables" as *;
