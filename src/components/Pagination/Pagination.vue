<template>
  <div
    class="pagination-container"
    :class="atRight ? 'at-right' : ''"
  >
    <el-pagination
      :current-page="currPage"
      @update:current-page="currPage = $event"
      background
      :page-size="pageData.pageSize"
      layout="prev, pager, next, jumper"
      :total="totalCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'

export default {
  name: 'Pagination',
  props: {
    pageData: {
      type: Object,
      default: () => {
        return {
          pageSize: 10,
          currPage: 1,
          totalPage: 1
        }
      }
    },
    atRight: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const currPage = ref(1)
    const totalCount = ref(0)
    
    const initData = () => {
      if (props.pageData) {
        currPage.value = props.pageData.currPage || props.pageData.page || 1
        totalCount.value = props.pageData.totalCount || props.pageData.count || 0
      } else {
        currPage.value = 1
        totalCount.value = 0
      }
    }
    
    // pageSize 改变时会触发
    const handleSizeChange = () => {
      emit('pageSizeChange')
    }
    
    // currentPage 改变时会触发
    const handleCurrentChange = (currPage) => {
      emit('pageCurrChange', currPage)
    }
    
    // Watch for pageData changes
    watch(() => props.pageData, () => {
      initData()
    }, { deep: true })
    
    // Initialize data on component creation
    onMounted(() => {
      initData()
    })
    
    return {
      currPage,
      totalCount,
      handleSizeChange,
      handleCurrentChange
    }
  }
}
</script>

<style lang="scss" scoped>
  .pagination-container :deep(.el-pagination) {
    text-align: center;
    color: $color-text-l;
    font-weight: 400;
  }

  .pagination-container :deep(.el-pagination .btn-prev),
  .pagination-container :deep(.el-pagination .btn-next) {
    /*width: 30px;*/
    min-width: 30px;
    height: 30px;
    line-height: 30px;
    background: $color-table-bg;
    border: 1px solid $color-background-l;
    padding: 0 3px;
    box-sizing: border-box;
  }

  .pagination-container :deep(.el-pagination .btn-prev) {
    margin-right: 3px;
  }

  .pagination-container :deep(.el-pagination .btn-next) {
    margin-left: 3px;
  }

  .pagination-container :deep(.el-pager li) {
    /*width: 30px;*/
    min-width: 30px;
    height: 30px;
    line-height: 30px;
    background: $color-table-bg;
    border: 1px solid $color-background-l;
    padding: 0 3px;
    box-sizing: border-box;
    margin: 0 3px;
    border-radius: 4px;
  }

  .pagination-container :deep(.el-pager li.active) {
    color: $color-white;
    background: $color-theme;
    border: 1px solid $color-theme;
  }

  .pagination-container :deep(.el-pager li.btn-quicknext),
  .pagination-container :deep(.el-pager li.btn-quickprev) {
    color: $color-text-l;
  }

  .pagination-container :deep(.el-pagination__jump) {
    color: $color-text-l;
    font-size: $font-size-small;
  }

  .pagination-container :deep(.el-pagination span:not([class*=suffix])) {
    height: 30px;
    line-height: 30px;
  }

  .pagination-container :deep(.el-pagination__editor.el-input .el-input__inner) {
    border: 1px solid $color-background-l;
    border-radius: 4px;
    font-size: $font-size-small;
  }

  .at-right {
    text-align: right;
  }

  :deep(.el-pagination.is-background .el-pager li) {
    background-color: #F6F6F6;
    border: 1px solid #ECEFF3;
  }

  :deep(.el-pagination.is-background .btn-next) {
    background-color: #F6F6F6;
    border: 1px solid #ECEFF3;
  }

  :deep(.el-pagination.is-background .btn-prev) {
    background-color: #F6F6F6;
    border: 1px solid #ECEFF3;
  }

  :deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
    color: #fff;
    background: #487FFF;
    border: 1px solid #487FFF;
  }
</style>
