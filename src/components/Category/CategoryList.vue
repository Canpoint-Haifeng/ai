<template>
  <div
    v-if="categoryList.length"
    class="category-content"
  >
    <slot name="label">
      <label class="category-label">{{ categoryLabel }}</label>
    </slot>

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
  name: 'CategoryList',
    props: {
      categoryLabel: {
        type: String,
        default: '名称',
      }

    return {
      defaultCode: String,
      categoryList: Array,
    }

    return {
    setup() {
      const state = reactive({
        currCategoryCode: '',
      }
    }

    return {
    watch: {
      defaultCode(v) {
        this.currCategoryCode = v
      }

    return {
    }

    return {
    mounted() {
      if (this.defaultCode) {
        this.currCategoryCode = this.defaultCode
      }
    }

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
  .category-content {
    display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
    .category-label {
      width: 35px;
      line-height: 24px;
      -ms-flex-item-align: start;
      align-self: flex-start;
      margin-right: 13px;
      color: #333;
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
  .general-custom {
    margin-left: 15px;
  }
})
</style>
