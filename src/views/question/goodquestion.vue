<template>
  <div class="content-container">
    <breadcrumb :crumbs-data="crumbsData" />
    <div class="content-question-segment">
      <div class="gray-line" />
      <div class="paper-container">
        <div class="question-top-topic">
          <div class="title">
            每周好题
          </div>
          <div class="content">
            <top-pagintion
              v-model:current-page="questionsData.page"
              suffix="题"
              :total="questionsData.count"
              :page-size="questionsData.pageSize"
              @change-page="handleCurrentChange"
            />
          </div>
        </div>
        <div
          v-loading="loading"
          class="quesiton-content"
        >
          <ul
            v-if="questionsData.list.length"
            class="quesiton-list"
          >
            <question-item
              v-for="(subItem, subIndex) in questionsData.list"
              :key="subIndex"
              :question-item="subItem"
              :question-index="subIndex"
              :show-similar="true"
              @add-question-box="onAddQuestionBoxCount"
              @delete-question-box="onDeleteQuestionBox"
              @check-question-detail="onCheckQuestionGoodDetail"
              @collect-question="onCollectQuestion"
              @show-report-dialog="onShowReportDialog"
              @toggle-explain="onToggleExplain"
              @check-similar-quesiton="onCheckSimilarQuesiton"
            />
          </ul>
          <pagination
            v-if="questionsData.list.length > 0"
            :page-data="questionsData"
            @page-curr-change="handleCurrentChange"
          />
          <noresult-common
            v-else
            v-slot:empty
            text="暂无数据！"
          />
        </div>
      </div>
      <!--试题篮组件-->
      <app-tool-basket />
      <cp-simailar-dialog
        ref="simailarDialog"
        @collect-question="onCollectQuestion"
        @check-question-detail="onCheckQuestionDetail"
        @show-report-dialog="onShowReportDialog"
        @add-question-box="onAddQuestionBox"
        @delete-question-box="onDeleteQuestionBox"
      />
      <!-- 收藏成功提示框 -->
      <collect-message
        ref="collectMessage"
        dialog-title="试题"
        collect-path="/paper/resources/collect?tabActiveName=QuesCollect"
      />
      <!-- 纠错提示框 -->
      <report-dialog
        ref="reportDialog"
        @report-error="onReportError"
      />
      <!-- 登录弹窗 -->
      <app-login ref="appLogin" />
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
  import { API } from '@/api/config'
  import { isLogin } from '@/common/js/util'
  import NoresultCommon from '@/components/Noresult/Noresult-common'
  import questionItemMixin from '@/common/mixins/questionItemMixin'
  import QuestionItem from '@/components/QuestionItem/GoodQuestionItem'
  import ReportDialog from '@/components/ReportDialog/ReportDialog'
  import CollectMessage from '@/components/CollectMessage/CollectMessage'
  import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
  import { TopPagination } from '@/components/CpFan/index.js'
  import { mapState } from 'vuex'
  export default {
    components: {
      NoresultCommon,
      QuestionItem,
      ReportDialog,
      CollectMessage,
      Breadcrumb,
      TopPagination,
    },
    computed: {
      ...mapState(['currSubject']),
    },
    mixins: [questionItemMixin],
    data() {
      return {
        crumbsData: [
          {
            path: '',
            isLink: false,
            text: '每周好题',
          },
        ],
        loading: false,
        questionsData: {
          list: [],
          page: 1,
          pageSize: 15,
          count: 0,
        },
      }
    },
    mounted() {
      this.getGoodQuestionList()
    },
    methods: {
      // 监听查看试题详情
      async onCheckQuestionGoodDetail(questionItem) {
        if (!isLogin()) {
          this.$refs.appLogin.showLogin()
        } else {
          let qscource = ''
          let year = ''
          let source = questionItem.source || '1'
          let useCount = ''
          let updateTime = ''

          if (questionItem && questionItem.questionInfo) {
            if (questionItem.questionInfo.questionSource) {
              qscource = questionItem.questionInfo.questionSource.code || ''
            }
            if (questionItem.questionInfo.year) {
              year = questionItem.questionInfo.year.code || ''
            }
            if (questionItem.questionInfo.useCount) {
              useCount = questionItem.questionInfo.useCount || 0
            }
            if (questionItem.questionInfo.updateTime) {
              updateTime = questionItem.questionInfo.updateTime || ''
            }
          }
          let queryStr =
            '?questionId=' +
            questionItem.questionInfo.questionId +
            '&source=' +
            source +
            '&qscource=' +
            qscource +
            '&year=' +
            year +
            '&good=1' +
            '&id=' +
            questionItem.recommendId
          if (useCount) {
            queryStr += '&useCount=' + useCount
          }
          //  学段学科 已传进去
          if (this.currSubject.subjectCode) {
            queryStr += '&subject=' + this.currSubject.subjectCode
          }

          if (updateTime) {
            queryStr += '&ut=' + updateTime
          }

          this.openWindowLink(
            import.meta.env.VITE_SRC + 'question/detail' + queryStr,
          )
        }
      },
      getGoodQuestionList() {
        let params = {
          period: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
          currPage: this.questionsData.page,
          pageSize: 10,
        }

        this.loading = true
        this.apiGet(API.QUESITON_GREATRECOMMEND_LIST, params).then(
          (res) => {
            this.loading = false
            if (this.checkoutRes(res)) {
              this.executeQuestionNum(res.data)
              console.log(res.data, 'data1-----')
            }
          },
          () => {
            this.loading = false
          },
        )
      },

      executeQuestionNum(data) {
        let list = data.list || []
        let page = data.page || 1
        let pageSize = data.pageSize || 10
        list.forEach((item, index) => {
          item.questionNum = index + 1 + (page - 1) * pageSize
          item.showQuestionNum = true
          item.questionInfo.canCollect = true
        })
        this.questionsData = data
        console.log(this.questionsData, 'questionsData')
      },
      handleCurrentChange(v) {
        this.questionsData.page = v
        this.helperBackToTop() // 返回页面顶部
        this.getGoodQuestionList()
      },
      onAddQuestionBoxCount(v) {
        this.czcTrackEvent([
          '_trackEvent',
          '每周好题列表页',
          '点击加入试题篮',
          '次数',
        ])
        this.eventQuestionStatistics(v.questionInfo.questionId, 1)
        this.onAddQuestionBox(v)
      },
    },
  }
</script>

<style scoped lang="scss">
  .content-question-segment {
    background-color: white;
    margin-bottom: 70px;
    min-height: 650px;
  }
  .quesiton-content {
    padding: 20px;
  }
  .pagination-container {
    text-align: center;
  }
  .question-top-topic {
    display: flex;
    padding: 10px 20px 0px 20px;
    border-bottom: 1px solid #eeeeee;
    .title {
      width: 200px;
      line-height: 49px;
      font-size: 18px;
      font-weight: bold;
      color: #333333;
    }
    .content {
      flex: 1;
    }
  }
</style>
