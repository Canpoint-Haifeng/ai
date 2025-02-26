<template>
  <div class="home-page-search">
    <el-input
      v-model="searchText"
      placeholder="请输入搜索内容"
      prefix-icon="el-icon-search"
      @keyup.enter="handleSearch"
    >
      <template #append>
        <el-button @click="handleSearch">搜索</el-button>
      </template>
    </el-input>
    <div class="hot-search" v-if="hotSearches.length > 0">
      <span class="hot-search-label">热门搜索：</span>
      <span
        v-for="(item, index) in hotSearches"
        :key="index"
        class="hot-search-item"
        @click="handleHotSearch(item)"
      >
        {{ item }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePageSearch',
  props: {
    hotSearches: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchText: ''
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search', this.searchText)
    },
    handleHotSearch(keyword) {
      this.searchText = keyword
      this.handleSearch()
    }
  }
}
</script>

<style scoped>
.home-page-search {
  width: 500px;
  margin: 0 auto;
}
.hot-search {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
}
.hot-search-label {
  margin-right: 5px;
}
.hot-search-item {
  margin-right: 10px;
  cursor: pointer;
}
.hot-search-item:hover {
  color: #487FFF;
}
</style>
