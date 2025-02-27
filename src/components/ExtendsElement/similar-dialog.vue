import { computed, defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue'
<template>
  <el-dialog
    v-model="visible"
    title="相似题"
    width="1200px"
    class="auth-dialog"
    top="5%"
    :append-to-body="true"
    :lock-scroll="false"
    :closed="hide"
  >
    <div class="auth-container">
      <div
        v-if="knowledge"
        class="recommend-tabs"
      >
        <div class="tabs-content font-12">
          <div class="recommend-list">
            <div
              v-for="item in knowledge"
              :key="item.code"
              class="recommend-item"
              :class="item.code === knowledageCode ? 'active' : ''"
              @click="selectItem(item)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>

      <div
        ref="simailartQuesListRef"
        class="recommend-content"
      >
        <ul
          v-if="questionsData.list.length > 0"
          class="question-content"
        >
          <question-item
            v-for="(item, index) in questionsData.list"
            :key="index"
            :question-item="item"
            :question-index="index"
            @show-report-dialog="onShowReportDialog"
            @collect-question="onCollectQuestion"
            @add-question-box="onAddQuestionBox"
            @delete-question-box="onDeleteQuestionBox"
            @toggle-explain="onToggleExplain"
          />
        </ul>
        <noresult-common
          v-else
          text="很遗憾，没有找到您要的试题"
        />
      </div>
    </div>
    <template #footer>
      <div class="warning-dialog-footer">
        <el-button
          class="btn btn-shadow"
          @click="hide"
        >
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import CTS from '@/common/js/constant'
import QuestionItem from '@/components/QuestionItem/QuestionItem'
import NoresultCommon from '@/components/Noresult/Noresult-common'
import { API } from '@/api/config'


export default defineComponent({
  name: 'SimilarDialog',
  components: {
    QuestionItem,
    NoresultCommon,
  })

    return {
  setup(props, { emit }) {
    const initDate = ref({ knowledge: null, httpParams: null, callbackDeal: null })
    const knowledge = ref(null)
    const httpParams = ref(null)
    const visible = ref(false)
    const knowledageCode = ref('')
    const callbackDeal = ref(null)
    const questionsData = ref({
      pageSize: 5,
      currPage: 1,
      totalCount: 0,
      list: [],
    })
    const simailartQuesListRef = ref(null)
    
    const onAddQuestionBox = (questionItem) => {}
    
    const onDeleteQuestionBox = (questionItem) => {}
    
    const onToggleExplain = (questionItem) => {}
    
    const onCollectQuestion = (questionItem) => {}
    
    const onShowReportDialog = (questionItem) => {
      if (callbackDeal.value) {
        callbackDeal.value('showreport', questionItem)
      }
    }
    
    const getQuestionRelation = (kid) => {
      httpParams.value.knowledge = knowledageCode.value
      apiGet(API.QUESTION_RELATION, httpParams.value).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          // 类题推荐 的试题 都是题库的试题 source 为1
          res.data.list.forEach((item, index) => {
            item.questionNum = index + 1
            item.source = 1
            item.showQuestionNum = true
          })
          questionsData.value = res.data

          nextTick(() => {
            onRenderJaxPage('simailartQuesListRef')
          })
        }
      })
    }
    
    const show = () => {
      visible.value = true
      if (knowledge.value && knowledge.value[0]) {
        selectItem(knowledge.value[0])
      }
    }
    
    // 知识点选择切换
    const selectItem = (item) => {
      knowledageCode.value = item.code
      questionsData.value = {
        pageSize: 5,
        currPage: 1,
        totalCount: 0,
        list: [],
      }
      getQuestionRelation()
    }
    
    const hide = () => {
      visible.value = false
      document.body.removeChild(el)
    }
    
    const state = reactive({
      initDate,
      knowledge,
      httpParams,
      visible,
      knowledageCode,
      callbackDeal,
      questionsData,
      simailartQuesListRef,
      onAddQuestionBox,
      onDeleteQuestionBox,
      onToggleExplain,
      onCollectQuestion,
      onShowReportDialog,
      getQuestionRelation,
      show,
      selectItem,
      hide
    }
  }
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
  .auth-container {
    padding-top: 20px;
    min-height: 450px;
  }
  .recommend-tabs {
    position: relative;
    padding: 0 20px;
    .recommend-btn {
      position: absolute;
      right: 20px;
      top: 0;
      color: $color-theme;
      cursor: pointer;
      transition: 0.2s;
      &:hover {
        color: $color-theme-d;
      }
      .iconchange {
        display: inline-block;
        margin-right: 8px;
        font-size: $font-size-medium;
      }
    }
  }
  .tabs-content {
    display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
    justify-content: flex-start;
    .recommend-label {
      width: 75px;
      line-height: 24px;
      align-self: flex-start;
      margin-right: 4px;
      color: $color-text-d;
      font-weight: 700;
    }
    .recommend-list {
      width: 1030px;
      .recommend-item {
        font-size: 14px;
        display: inline-block;
        border-radius: 16px;
        line-height: 32px;
        padding: 0 40px;
        cursor: pointer;
        transition: 0.2s;
        color: #666666;
        background: #f3f7fb;
        margin-right: 20px;
        margin-bottom: 10px;
        &:hover {
          color: $color-theme;
        }
        &.active {
          color: #ffffff;
          background: $color-theme;
        }
      }
    }
  }
  .question-content {
    overflow: hidden;
    min-height: 200px;
    padding: 10px 20px 0 20px;
  }
</style>
