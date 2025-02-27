<template>
  <div>
    <div class="category-container">
      <question-type @select-type="selectType" />
      <question-diff @select-diff="selectDiff" />
      <question-source @select-source="selectSource" />
      <!-- <years @selectYear="selectYear"></years>-->
      <grade @select-grade="selectYear" />
    </div>
    <div class="gray-line" />
    <div class="st-item-content">
      <top-pagintion
        v-if="questionsData.totalCount"
        v-model:current-page="questionsData.currPage"
        suffix="道题目"
        :total="questionsData.totalCount"
        :page-size="questionsData.pageSize"
        @change-page="onPageCurrChange"
      />
    </div>
    <div
      v-loading="loading"
      class="s-item-content"
    >
      <div
        v-if="questionsData.list.length > 0"
        class="question-content"
      >
        <ul class="question-list">
          <question-item
            v-for="(subItem, subIndex) in questionsData.list"
            :key="subIndex"
            :question-item="subItem"
            :question-index="subIndex"
            @add-question-box="onAddQuestionBox"
            @delete-question-box="onDeleteQuestionBox"
            @check-question-detail="onCheckQuestionDetail"
            @collect-question="onCollectQuestion"
            @show-report-dialog="onShowReportDialog"
            @toggle-explain="onToggleExplain"
          />
        </ul>
        <pagination
          v-if="questionsData.list.length > 0"
          :page-data="questionsData"
          @page-curr-change="onPageCurrChange"
        />
      </div>
      <noresult-common
        v-else
        text="很遗憾，没有找到您要的试题"
      />
    </div>
    <!--试题组件-->
    <app-tool-basket />
    <!-- 收藏成功提示框 -->
    <collect-message
      ref="collectMessage"
      dialog-title="试题"
    />

    <!-- 纠错提示框 -->
    <report-dialog
      ref="reportDialog"
      @report-error="onReportError"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
import NoresultCommon from '@/components/Noresult/Noresult-common'
// import QuestionItem from '@/components/QuestionItem/QuestionItem'
import CollectMessage from '@/components/CollectMessage/CollectMessage'

import Grade from '@/components/Category/Grade'
import QuestionType from '@/components/Category/QuestionType'
import QuestionDiff from '@/components/Category/QuestionDiff'
import QuestionSource from '@/components/Category/QuestionSource'

// import paperCategoryMixin from '@/common/mixins/paperCategoryMixin'
import questionItemMixin from '@/common/mixins/questionItemMixin'
import { TopPagination } from '@/components/CpFan/index.js'
export default {
  components: {
    Grade,
    QuestionType,
    QuestionDiff,
    QuestionSource,
    NoresultCommon,
    CollectMessage,
    TopPagination
  },
  mixins: [questionItemMixin],
  data() {
    return {
      loading: true,
      questionsData: {
        pageSize: 10,
        currPage: 1,
        totalPage: 0,
        totalCount: 0,
        list: []
      },
      currTimeCode: {
        timeBegin: '',
        timeEnd: ''
      },
      currTypeCode: '',
      currDiffCode: '',
      currSourceCode: '',
      currYearCode: ''
    }
  },
  computed: {
    ...mapState(['currSubject'])
  },
  created() {
    this.getQusList() // 我的收藏
  },
  methods: {
    // 我的收藏
    getQusList() {
      let parms = {
        period: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        currPage: this.questionsData.currPage,
        pageSize: this.questionsData.pageSize,

        questionType: this.currTypeCode ? this.currTypeCode : '',
        difficulty: this.currDiffCode ? this.currDiffCode : '',
        questionSource: this.currSourceCode ? this.currSourceCode : '',
        grade: this.currYearCode ? this.currYearCode : ''
      }
      this.apiGet(API.COLLECTION_QUESTION, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.loading = false
          let newArr = res.data
          newArr.list.forEach(item => {
            item.hideQuestionId = true
            item.isCollected = 1
            item.questionInfo.canCollect = true
            item.questionInfo.source = item.source
          })
          this.questionsData = newArr
        } else {
          this.loading = false
        }
      })
    },
    onCollectQuestionEnd() {
      // this.getQusList() // 刷新数据

      console.log(this.questionsData)
      let list = this.questionsData.list
      let newArr = []
      for (let sub of list) {
        if (sub.isCollected) {
          newArr.push(sub)
        }
      }
      this.questionsData.list = newArr
    },
    // 取消试题收藏
    // collectQuestion(item) {
    //   let parms = {
    //     period: this.currSubject.periodCode,
    //     subject: this.currSubject.subjectCode,
    //     questionId: item.questionId,
    //     status: 0,
    //     source: item.source
    //   }
    //   this.apiGet(API.COLLECTION_CANCEL_QUESTION, parms).then(res => {
    //     if (res.code === CTS.constant.SUCCESS_CODE) {
    //       this.getQusList() // 刷新数据
    //       this.$refs.collectMessage.showMessage(parms.status)
    //     }
    //   })
    // },
    // 查看详情
    checkQuestionDetail(item) {
      this.$router.push({
        name: 'questionDetail',
        query: { questionId: item.questionId }
      })
    },
    // 监听分页改变时触发
    onPageCurrChange(currPage) {
      this.questionsData.currPage = currPage
      this.helperBackToTop()
      this.getQusList()
    },
    // 选择的题目类型
    selectType(item) {
      this.currTypeCode = item.code
      this.questionsData.currPage = 1
      this.loading = true
      this.questionsData.list = []
      this.getQusList()
    },
    // 选择的年份
    selectYear(item) {
      this.currYearCode = item.code
      this.questionsData.currPage = 1
      this.loading = true
      this.questionsData.list = []
      this.getQusList()
    },
    // 选择的难度
    selectDiff(item) {
      this.currDiffCode = item.code
      this.questionsData.currPage = 1
      this.loading = true
      this.questionsData.list = []
      this.getQusList()
    },
    // 选择的来源
    selectSource(item) {
      this.currSourceCode = item.code
      this.questionsData.currPage = 1
      this.loading = true
      this.questionsData.list = []
      this.getQusList()
    }

  }
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.item-content {
  padding:30px 20px;
}
.category-container{
  // width: 914px;
  padding: 20px 20px 8px 20px;
  background: $color-white;
}
.paper-item {
  height: 108px;
  padding: 30px 20px;
  border: 1px solid $color-border;
  box-sizing: border-box;
  margin-bottom: 16px;
  .paper-title {
    margin-bottom: 16px;
    cursor: pointer;
    font-size: $font-size-medium;
    font-weight: 400;
    transition: 0.2s;
    &:hover {
      color: $color-theme;
    }
  }
  .paper-info {
    display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
    justify-content: space-between;
    .info-left {
      .item {
        margin-right: 20px;
        .text {
          color: $color-theme-ll;
        }
      }
    }
    .paper-operate {
      .operate-btn {
        font-size: $font-size-small;
        margin-left: 30px;
        cursor: pointer;
      }
      .iconnobg-collect {
        margin-right: 4px;
        font-size: $font-size-small;
      }
      .iconcollect {
        margin-right: 4px;
        font-size: $font-size-small;
        color: #FF6E5D;
      }
    }
  }
}
.gray-line {
  width: 914px;
  height: 16px;
  background: $color-background-l;
}
.s-item-content{
  padding:0px 20px 30px 20px;
}
.st-item-content{
  padding:0px 20px;
  border-bottom: 1px solid #EEEEEE;
  margin-bottom: 20px;
}
</style>
