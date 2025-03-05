<template>
  <div class="home-page-search">
    <div class="search-container">
      <div class="search-input">
        <el-input
          v-model="searchText"
          placeholder="请输入搜索内容"
          @keyup.enter.native="handleSearch"
        >
          <template #suffix>
            <el-button
              icon="el-icon-search"
              @click="handleSearch"
            />
          </template>
        </el-input>
      </div>
      <div class="search-options">
        <el-radio-group v-model="searchType">
          <el-radio label="all">
            全部
          </el-radio>
          <el-radio label="papers">
            试卷
          </el-radio>
          <el-radio label="questions">
            题目
          </el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePageSearch',
  data() {
    return {
      searchText: '',
      searchType: 'all'
    }
  },
  methods: {
    handleSearch() {
      if (!this.searchText.trim()) {
        this.$message.warning('请输入搜索内容')
        return
      }
      
      this.$emit('search', {
        text: this.searchText,
        type: this.searchType
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
@import "@/assets/css/mixins.scss";

.home-page-search {
  width: 100%;
  padding: 20px 0;
  
  .search-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 600px;
    margin: 0 auto;
    
    .search-input {
      width: 100%;
      margin-bottom: 15px;
    }
    
    .search-options {
      margin-top: 10px;
    }
  }
}
</style>
