<template>
  <div class="top-search">
    <el-input
      v-model="searchText"
      placeholder="搜索"
      prefix-icon="el-icon-search"
      @keyup.enter="handleSearch"
    >
      <template #append>
        <el-button @click="handleSearch">搜索</el-button>
      </template>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'TopSearch',
  data() {
    return {
      searchText: ''
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search', this.searchText)
    }
  }
}
</script>

<style scoped>
.top-search {
  width: 300px;
}
</style>
