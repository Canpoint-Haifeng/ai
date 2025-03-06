<template>
  <el-dialog
    :visible="visible" @update:visible="$emit('update:visible', $event)"
    title="解析"
    width="800px"
    class="analysis-dialog"
    :append-to-body="true"
    :lock-scroll="false"
    :close-on-click-modal="false"
  >
    <el-tabs
      v-model="currentTab"
      class="analysis-tabs"
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        v-for="item in tabList"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
        <div
          v-if="item.name === 'analysis'"
          class="analysis-content"
        >
          <div class="analysis-item">
            <div class="item-title">
              解析
            </div>
            <div
              class="item-content"
              v-html="analysisData.analysis"
            />
          </div>
          <div class="analysis-item">
            <div class="item-title">
              答案
            </div>
            <div
              class="item-content"
              v-html="analysisData.answer"
            />
          </div>
          <div class="analysis-item">
            <div class="item-title">
              知识点
            </div>
            <div class="item-content">
              <el-tag
                v-for="(tag, index) in analysisData.knowledgeList"
                :key="index"
                class="knowledge-tag"
              >
                {{ tag.knowledgeName }}
              </el-tag>
            </div>
          </div>
        </div>
        <div
          v-else
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
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { defineComponent, getCurrentInstance } from 'vue'
import { useAnalysisDialog } from './composition/useAnalysisDialog'

export default defineComponent({
  name: 'AnalysisDialog',
  setup() {
    const instance = getCurrentInstance()
    
    const {
      visible,
      loading,
      analysisData,
      questionData,
      currentTab,
      tabList,
      show,
      hide,
      getAnalysis,
      getRecommendQuestions,
      handleTabClick
    } = useAnalysisDialog(instance)
    
    return {
      visible,
      loading,
      analysisData,
      questionData,
      currentTab,
      tabList,
      show,
      hide,
      getAnalysis,
      getRecommendQuestions,
      handleTabClick
    }
  }
})
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.analysis-dialog {
  :deep(.el-dialog__body) {
    padding: 0;
  }
  
  .analysis-tabs {
    :deep(.el-tabs__header) {
      margin: 0;
      padding: 0 20px;
      background: #f5f7fa;
      border-bottom: 1px solid #e4e7ed;
    }
    
    :deep(.el-tabs__nav-wrap::after) {
      display: none;
    }
    
    :deep(.el-tabs__active-bar) {
      background-color: #487fff;
    }
    
    :deep(.el-tabs__item) {
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      color: #333333;
      
      &.is-active {
        color: #487fff;
      }
    }
  }
  
  .analysis-content {
    padding: 20px;
    
    .analysis-item {
      margin-bottom: 20px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .item-title {
        font-size: 14px;
        font-weight: 500;
        color: #333333;
        margin-bottom: 10px;
      }
      
      .item-content {
        font-size: 14px;
        color: #666666;
        line-height: 1.5;
        
        .knowledge-tag {
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }
  
  .recommend-content {
    padding: 20px;
    
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
  }
}
</style>

