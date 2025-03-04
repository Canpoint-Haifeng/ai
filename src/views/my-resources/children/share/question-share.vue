<template>
  <div>
    <div class="category-container">
      <question-type @select-type="selectType" />
      <question-diff @select-diff="selectDiff" />
      <question-source
        category-label="类型"
        @select-source="selectSource"
      />
      <years @select-year="selectYear" />
    </div>
    <div class="gray-line" />
    <div class="paper-container">
      <div class="paper-sort font-12">
        <div class="sort-list fl">
          <span
            class="sort-item"
            :class="sortValue === 1 ? 'active' : 'iconfont cp-icon_darrows'"
            @click="changeSortValue(1)"
          >最新</span>
          <span
            class="sort-item"
            :class="sortValue === 2 ? 'active' : 'iconfont cp-icon_darrows'"
            @click="changeSortValue(2)"
          >喜欢</span>
          <span
            class="sort-item"
            :class="sortValue === 3 ? 'active' : 'iconfont cp-icon_darrows'"
            @click="changeSortValue(3)"
          >收藏</span>
        </div>
        <div class="paper-search">
          <!-- <el-input
            placeholder="在结果中搜索"
            @keyup.enter="handleCurrentChange(1)"
            v-model="searchValue"
          >
            <i
              class="iconfont iconsearch"
              v-slot:suffix
              @click="handleCurrentChange(1)"
            >
            </i></template></template>
          </el-input> -->
        </div>
        <div class="paper-show-answer el-cyy-rewrite">
          <el-checkbox
            v-model="showAnswer"
            @change="AllShowAnswer"
          >
            显示答案
          </el-checkbox>
        </div>
        <div class="paper-add-black">
          <span-pagintion
            suffix="道题目"
            :total="questionsData.totalCount"
            :page-size="questionsData.pageSize"
            :current-page="questionsData.currPage"
            @change-page="handleCurrentChange"
          />
        </div>
      </div>
      <div
        ref="knowledgeSelectionRef"
        v-loading="loading"
        class="paper-content min-height400"
      >
        <ul
          v-if="questionsData.list.length"
          class="paper-list min-height400"
        >
          <ShareQuestionItem
            v-for="(subItem, subIndex) in questionsData.list"
            :key="subIndex"
            :question-item="subItem"
            :question-index="subIndex"
            :show-similar="true"
            @add-question-box="onAddQuestionBox"
            @delete-question-box="onDeleteQuestionBox"
            @check-question-detail="onCheckQuestionDetail"
            @click-cancel-share="clickCancelShare"
            @toggle-explain="onToggleExplain"
          />
        </ul>
        <pagination
          v-if="questionsData.list.length > 0"
          :page-data="questionsData"
          @page-curr-change="handleCurrentChange"
        />
        <noresult-common
          v-else
          #empty
          text="很遗憾，没有找到您要的试题"
          :is-show-text="false"
        >
          <div class="empty-share">
            暂无试题，快去<span @click="goShareGoodQuestion">分享好题</span>赚下载券吧
          </div>
        </noresult-common>
      </div>
    </div>
    <!-- <router-view></router-view> -->
    <!--试题篮组件-->
    <app-tool-basket />
    <!-- 收藏成功提示框 -->
    <collect-message ref="collectMessage" />
    <!-- 纠错提示框 -->
    <report-dialog
      ref="reportDialog"
      @report-error="onReportError"
    />

    <base-dialog
      ref="deleteDialog"
      :addbody="true"
      @comfirm="onDeleteQuestion"
    >
      <template #dialogTips>
        <div

          class="dialog-tips"
        >
          确认删除试题？
        </div>
      </template>
    </base-dialog>
    <!-- 登录弹窗 -->
    <app-login ref="appLogin" />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
  import CTS from '@/common/js/constant'
  import { API } from '@/api/config'
  import { mapState } from 'vuex'
  import { isLogin } from '@/common/js/util'
  import NoresultCommon from '@/components/Noresult/Noresult-common'
  import questionItemMixin from '@/common/mixins/questionItemMixin'
  import Years from '@/components/Category/Years'
  import QuestionType from '@/components/Category/QuestionType'
  import QuestionDiff from '@/components/Category/QuestionDiff'
  import QuestionSource from '@/components/Category/QuestionSource'
  import { SpanPagintion } from '@/components/CpFan/index.js'
  import BaseDialog from '@/components/BaseDialog/BaseDialog'
  import ShareQuestionItem from './ShareQuestionItem'
  import { throttle } from '@/common/helper/throttle-debounce'
  import CpCommonDialog from '@/components/AuthorityVip/CpCommonDialog'
  export default {
    components: {
      Years,
      QuestionType,
      QuestionDiff,
      QuestionSource,
      NoresultCommon,
      SpanPagintion,
      BaseDialog,
      ShareQuestionItem,
    },
    mixins: [questionItemMixin],
    props: {
      isChapter: Boolean,
      bookId: String, // 选择图书
      checkNodeCode: String, // 选择的章节
      dTree: Array,
      versionCode: String,
      versionGradeCode: String,
      volumeCode: String,
      hasChapterChild: Boolean,
      checkNodeCodeKnowledge: String,
    },
    setup() {
      const deleteDialog = ref(null)
      const appLogin = ref(null)
      const state = reactive({
        loading: false,
        questionsData: {
          list: [],
          currPage: 1,
          pageSize: 10,
          totalCount: 0,
        },
        searchValue: '',
        showAnswer: false,
        newUpload: 0,
        newCommon: 0,
        currTypeCode: '',
        currDiffCode: '',
        currSourceCode: '',
        currYearCode: '',
        isShowAnswerAndAnalysis: '',
        sortValue: 1,
        currentQuestion: null,
        intoType: '',
        wrapperThrottle: null, // 防抖动 节流
        knowledgePoint: '',
      })
    computed: {
      ...mapState(['currSubject', 'userInfo']),
    },
    mounted() {
      // 监听添加试题
      this.getQusList()
    },
    unmounted() {
      this.wrapperThrottle = null
    },
    methods: {
      goShareGoodQuestion() {
        this.$router.push({ path: '/paper/chapterques/selection' })
      },
      clickCancelShare(item) {
        CpCommonDialog.openDialog({
          moduleC: 'CpConfigDialog',
          data: {
            title: '取消分享',
            content: '是否确认取消分享？',
            comfirm: (status) => {
              if (status) {
                this.cancelShareHttp(item)
              }
            },
          },
        })
      },
      cancelShareHttp(item) {
        let params = {
          id: item.id,
        }
        this.apiGet(API.CENTER_QUESTIONSHARE_CANCELSHAREQUESTION, params, {
          showLoading: true,
        }).then((res) => {
          if (this.checkoutRes(res)) {
            this.showMessage('取消成功', 'success')
            this.getQusList()
          } else {
            this.showMessage(res.msg)
          }
        })
      },

      changeSortValue(v) {
        this.sortValue = v
        this.questionsData.currPage = 1
        this.getQusList()
      },
      onShowDeleteDialog(questionItem) {
        state.currentQuestion = questionItem
        deleteDialog.value.show()
      },
      onDeleteQuestion() {
        let params = {
          qidSource: JSON.stringify([
            {
              qid: this.currentQuestion.questionInfo.questionId,
              source: this.currentQuestion.source,
            },
          ]),
        }
        this.apiPost(API.RESOURCE_DELETE_SELFQUES, params, {
          showLoading: true,
        }).then((res) => {
          console.log(res)
          if (res.code === CTS.constant.SUCCESS_CODE) {
            deleteDialog.value.hide()
            getQusList()
          } else {
            this.$message({
              showClose: true,
              message: res.msg,
              type: 'error',
            })
          }
        })
      },

      // 删除试题篮题目
      onDeleteBasket() {
        this.getQusList() // 刷新题目
      },
      getQusList() {
        if (!this.wrapperThrottle) {
          this.wrapperThrottle = throttle(2000, this.getQusListHttp)
        }
        this.wrapperThrottle()
      },
      // 获取题目列表
      getQusListHttp() {
        let parms = {
          stage: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
          currPage: this.questionsData.currPage,
          pageSize: this.questionsData.pageSize,
          questionType: this.currTypeCode ? this.currTypeCode : '',
          difficulty: this.currDiffCode ? this.currDiffCode : '',
          questionSource: this.currSourceCode ? this.currSourceCode : '',
          year: this.currYearCode ? this.currYearCode : '',
          sort: this.sortValue || '',
          context: this.searchValue,
          isShowAnswerAndAnalysis: this.isShowAnswerAndAnalysis || '',
          intoType: this.intoType || '',
        }

        this.apiGet(API.QUESIOTN_GETQUESTIONSHARELIST, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            if (res.data) {
              this.executeQuestionNum(res.data)
              this.$nextTick(() => {
                this.onRenderJaxPage('myResourceQuesRef')
              })
            }
            this.loading = false
          }
        })
      },

      executeQuestionNum(data) {
        let list = data.list || []
        let page = data.currPage || 1
        let pageSize = data.pageSize || 10
        data.list = list.map((sub, index) => {
          sub.questionNum = index + 1 + (page - 1) * pageSize
          sub.showQuestionNum = true
          sub.source = 1
          sub.showExplain = !!this.isShowAnswerAndAnalysis
          sub.showKnowledge = !!this.isShowAnswerAndAnalysis
          return sub
        })
        this.questionsData = data
      },
      // 全部显示答案和解析
      AllShowAnswer(showAllExplain) {
        if (!isLogin()) {
          appLogin.value.showLogin()
          return
        }
        if (showAllExplain) {
          // 显示所有答案
          this.isShowAnswerAndAnalysis = true
          this.getQusList()
        } else {
          // 隐藏所有答案
          this.isShowAnswerAndAnalysis = false
          this.questionsData.list.forEach((item) => {
            this.$set(item, 'showExplain', false)
            this.$set(item, 'showKnowledge', false)
          })
        }
      },

      // 监听全部加入试题篮
      onAddBatchQuestionBox() {
        if (!isLogin()) {
          appLogin.value.showLogin()
          return
        }
        let questionList = []
        this.questionsData.list.forEach((item) => {
          if (!item.isAddedToBox) {
            questionList.push({
              questionId: item.questionInfo.questionId,
              subjective: item.questionInfo.subjective.code,
              typeName: item.questionInfo.quesType.name,
              type: item.questionInfo.quesType.code,
            })
          }
        })
        if (!questionList.length) {
          this.$message.error('无可添加的试题!')
          return
        }
        let parms = {
          period: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
          paramsJson: JSON.stringify(questionList),
        }
        let set = {
          authCode: 1,
        }
        this.apiPost(API.QUESTION_BATCH_ADD, parms, set).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.$message.success('成功添加到试题篮!')
            this.questionsData.list.forEach((subItem) => {
              subItem.isAddedToBox = 1
            })
            this.Bus.$emit('addBasket')
          }
        })
      },
      // 分页
      handleCurrentChange(currPage) {
        this.questionsData.currPage = currPage
        this.loading = true
        this.questionsData.list = []
        document.documentElement.scrollTop = 0 // 返回页面顶部
        this.showAnswer = false // 重置显示答案和解析按钮
        this.getQusList()
      },
      // 选择的题目类型
      selectType(item) {
        this.currTypeCode = item.code
        this.questionsData.currPage = 1
        this.loading = true
        this.showAnswer = false // 重置显示答案和解析按钮
        this.questionsData.list = []
        this.getQusList()
      },
      // 选择的年份
      selectYear(item) {
        this.currYearCode = item.code
        this.questionsData.currPage = 1
        this.loading = true
        this.showAnswer = false // 重置显示答案和解析按钮
        this.questionsData.list = []
        this.getQusList()
      },
      // 选择的难度
      selectDiff(item) {
        this.currDiffCode = item.code
        this.questionsData.currPage = 1
        this.loading = true
        this.showAnswer = false // 重置显示答案和解析按钮
        this.questionsData.list = []
        this.getQusList()
      },
      // 选择的来源
      selectSource(item) {
        this.currSourceCode = item.code
        this.questionsData.currPage = 1
        this.loading = true
        this.showAnswer = false // 重置显示答案和解析按钮
        this.questionsData.list = []
        this.getQusList()
      },
    },
  }
</script>
<style lang="scss" scoped>
  
  .category-container {
    // width: 914px;
    padding: 20px 20px 8px 20px;
    background: $color-white;
  }
  .gray-line {
    width: 914px;
    height: 16px;
    background: $color-background-l;
  }
  .paper-container {
    width: 914px;
    background: $color-white;
    padding-bottom: 20px;
  }
  .paper-sort {
    height: 46px;
    line-height: 46px;
    padding: 0 20px;
    border-bottom: 1px solid $color-background-l;
    margin-bottom: 20px;
    .paper-total {
      margin-right: 25px;
      .num {
        padding: 0 2px;
        color: $color-text-d;
        font-size: $font-size-medium;
      }
    }
    .sort-list {
      .icondot {
        display: inline-block;
        vertical-align: middle;
        margin-right: 4px;
        width: 4px;
        height: 4px;
        background: $color-theme;
      }
      .sort-item {
        margin: 0 10px;
        cursor: pointer;
        line-height: 20px;
        display: inline-block;
        width: 30px;
        text-align: center;
        color: #333333;
        &.active {
          font-size: 14px;
        }
        &.iconfont {
          position: relative;
          font-size: 14px;
        }
        &.active::after {
          content: '';
          width: 40%;
          height: 1px;
          display: block;
          padding-top: 2px;
          margin: 0 auto;
          border-bottom: 2px solid #487FFF;
        }
        &.active,
        &:hover {
          color: $color-theme;
          .iconsort {
            color: $color-theme;
          }
        }
      }
    }
    :deep(.paper-search) {
      display: inline-block;
      margin: 0 30px 0 110px;
      width: 174px;
      .iconsearch {
        font-size: $font-size-medium;
        cursor: pointer;
      }
      .el-input__suffix {
        right: 12px;
      }
    }
    :deep(.paper-show-answer) {
      display: inline-block;
      margin-right: 30px;
      .el-checkbox__inner {
        border-radius: 2px;
      }
      .el-checkbox__label {
        font-size: $font-size-small;
      }
    }
    .paper-add-black {
      text-align: right;
      width: 305px;
      display: inline-block;
      .add-btn {
        cursor: pointer;
        padding: 5px 13px;
        border-radius: 13px;
        color: $color-theme;
        border: 1px solid $color-theme;
        .iconfont {
          font-size: 13px;
          margin-right: 6px;
        }
      }
    }
  }
  .paper-content {
    padding: 0 20px;
  }

  .empty-share {
    color: $color-text-l;
    font-size: $font-size-small;
    height: 86px;
    line-height: 86px;
    span {
      color: $color-theme;
      display: inline-block;
      text-decoration: underline;
      cursor: pointer;
      user-select: none;
      &:hover {
        color: $color-theme-d;
      }
    }
  }
</style>
