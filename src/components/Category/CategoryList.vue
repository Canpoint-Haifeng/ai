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
  export default {
  name: 'CategoryList',
    props: {
      categoryLabel: {
        type: String,
        default: '名称',
      },
      defaultCode: String,
      categoryList: Array,
    },
    data() {
      return {
        currCategoryCode: '',
      }
    },
    watch: {
      defaultCode(v) {
        this.currCategoryCode = v
      },
    },
    mounted() {
      if (this.defaultCode) {
        this.currCategoryCode = this.defaultCode
      }
    },
    methods: {
      // 获取年份
      selectCategory(item) {
        this.currCategoryCode = item.code
        this.$emit('selectCategory', item)
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
  .general-custom {
    margin-left: 15px;
  }
</style>

