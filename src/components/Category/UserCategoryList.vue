<template>
  <div
    v-if="categoryList.length"
    class="user-category-content"
  >
    <label class="category-label">{{ categoryLabel }}</label>
    <div class="category-list">
      <div
        v-for="item in categoryList"
        :key="item.code"
        class="category-item"
        :class="item.code === currCategoryCode ? 'active' : ''"
        @click="selectCategory(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
  import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
  name: 'UserCategoryList',
    props: {
      categoryLabel: {
        type: String,
        default: '名称',
      }

    return {
      categoryList: Array,
    }

    return {
    setup() {
      const state = reactive({
        currCategoryCode: '',
      }
    }

    return {
    created() {})

    return {
    methods: {
      // 获取年份
      selectCategory(item) {
        this.currCategoryCode = item.code
        this.$emit('selectCategory', item)
      }

    return {
    }

    return {
  }
})
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
  .general-custom {
    margin-left: 15px;
  }
})
</style>
