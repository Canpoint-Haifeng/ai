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
  export default {
  name: 'QuestionFilter',
    props: {
      categoryLabel: {
        type: String,
        default: '过　　滤',
      },
    },
    data() {
      return {
        checked: false,
      }
    },
    methods: {
      changeFilter(item) {
        console.log(item)
        this.$emit('selectFilter', item)
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  .category-content {
    @include flex();
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
</style>
