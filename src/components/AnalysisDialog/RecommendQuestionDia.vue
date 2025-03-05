<template>
  <el-dialog
    v-model="visible"
    title="推荐试题"
    width="800px"
    class="recommend-dialog"
    :append-to-body="true"
    :lock-scroll="false"
    :close-on-click-modal="false"
    @closed="hide"
  >
    <div
      v-loading="loading"
      class="recommend-content"
    >
      <div
        v-if="questionData.list && questionData.list.length"
        class="question-list"
      >
        <div
          v-for="(item, index) in questionData.list"
          :key="index"
          class="question-item"
        >
          <div class="question-title">
            {{ index + 1 }}. {{ item.questionTitle }}
          </div>
          <div class="question-options">
            <div
              v-for="(option, idx) in item.options"
              :key="idx"
              class="option-item"
            >
              {{ option.optionLabel }}. {{ option.optionContent }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="empty-content"
      >
        暂无推荐试题
      </div>
      <div
        v-if="total > pageSize"
        class="pagination"
      >
        <el-pagination
          :current-page="pageNum"
          :page-size="pageSize"
          :total="total"
          layout="prev, pager, next"
          @update:current-page="pageNum = $event"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
import { useRecommendQuestionDia } from './composition/useRecommendQuestionDia'

export default defineComponent({
  name: 'RecommendQuestionDia',
  setup() {
    const instance = getCurrentInstance()
    
    const {
      visible,
      loading,
      questionData,
      pageNum,
      pageSize,
      total,
      show,
      hide,
      getRecommendQuestions,
      handleCurrentChange
    } = useRecommendQuestionDia(instance)
    
    return {
      visible,
      loading,
      questionData,
      pageNum,
      pageSize,
      total,
      show,
      hide,
      getRecommendQuestions,
      handleCurrentChange
    }
  }
})
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.recommend-dialog {
  :deep(.el-dialog__body)) {
    padding: 20px;
  }
  
  .recommend-content {
    min-height: 200px;
    
    .question-list {
      .question-item {
        margin-bottom: 20px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .question-title {
          font-size: 14px;
          color: #333333;
          margin-bottom: 10px;
        }
        
        .question-options {
          .option-item {
            font-size: 14px;
            color: #666666;
            margin-bottom: 5px;
            
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }
    
    .empty-content {
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #999999;
    }
    
    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
