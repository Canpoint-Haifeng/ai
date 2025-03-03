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
  export default {
  name: 'UserCategoryList',
    props: {
      categoryLabel: {
        type: String,
        default: '名称',
      },
      categoryList: Array,
    },
    data() {
      return {
        currCategoryCode: '',
      }
    },
    created() {},
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
  .general-custom {
    margin-left: 15px;
  }
</style>
