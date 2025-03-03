<template>
  <div class="top-pagination">
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'TopPagination',
  props: {
    total: {
      type: Number,
      default: 0
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  emits: ['update:currentPage', 'current-change'],
  setup(props, { emit }) {
    const currentPage = ref(1)
    
    const handleCurrentChange = (val) => {
      emit('update:currentPage', val)
      emit('current-change', val)
    }
    
    return {
      currentPage,
      handleCurrentChange
    }
  }
})
</script>

<style lang="scss" scoped>
.top-pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>
