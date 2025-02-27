<template>
  <div class="category-content">
    <label class="category-label">{{ categoryLabel }}</label>
    <div class="category-list el-cyy-rewrite">
      <el-checkbox
        v-model="checked"
        @change="changeFilter"
      >
        我已组卷
      </el-checkbox>
    </div>
  </div>
</template>

<script>
  import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
  name: 'QuestionFilter',
    props: {
      categoryLabel: {
        type: String,
        default: '过　　滤',
      }

    return {
    }

    return {
    setup() {
      const state = reactive({
        checked: false,
      }
    }

    return {
    methods: {
      changeFilter(item) {
        console.log(item)
        this.$emit('selectFilter', item)
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
      margin-right: 10px;
      color: $color-text-d;
      font-weight: 700;
      width: 75px;
    }
    .category-list {
      width: 855px;
      padding-left: 10px;
    }
  }
})
</style>
