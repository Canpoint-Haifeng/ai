<template>
  <div>
    <KnowledgeTypeMulti
      :book-text-id="bookId"
      :chapter-codes="checkNodeCode"
      :has-chapter-child="hasChapterChild"
      @select-type="selectKnowledge"
    />

    <div class="category-container">
      <question-type-multi @select-type="selectType" />
      <question-diff @select-diff="selectDiff" />
      <question-source @select-source="selectSource" />
      <years @select-year="selectYear" />
      <question-filter @select-filter="selectFilter" />
    </div>
    <div class="gray-line" />
    <div class="paper-container">
      <div class="paper-sort font-12">
        <div class="sort-list fl">
          <span
            class="sort-item"
            :class="sortState === 1 ? 'active' : ''"
            @click="changeSortState(1)"
          >综合</span>
          <span
            class="sort-item"
            :class="sortState === 2 ? 'active' : ''"
            @click="changeSortState(2)"
          >最新</span>
          <span
            class="sort-item"
            :class="sortState === 3 ? 'active' : ''"
            @click="changeSortState(3)"
          >最热</span>
        </div>
        <div class="paper-search">
          <el-input
            v-model="searchValue"
            placeholder="在结果中搜索"
            @keyup.enter="handleCurrentChange(1)"
          >
            <template #suffix>
              <i
                class="iconfont iconsearch"
              
                @click="handleCurrentChange(1)"
              />
            </template>
          </el-input>
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
            :total="questionsData.count"
            :page-size="questionsData.pageSize"
            :current-page="questionsData.page" @update:current-page="questionsData.page = $event"
            @change-page="handleCurrentChange"
          />
        </div>
      </div>
      <div
        ref="paperContentQuesListRef"
        v-loading="loading"
        class="paper-content"
      >
        <ul
          v-if="questionsData.list.length"
          class="paper-list"
        >
          <question-item
            v-for="(subItem, subIndex) in questionsData.list"
            :key="subIndex"
            :question-item="subItem"
            :question-index="subIndex"
            :show-similar="true"
            @add-question-box="onAddQuestionBox"
            @delete-question-box="onDeleteQuestionBox"
            @check-question-detail="onCheckQuestionDetail"
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
        <!-- <div class="pagination-container pagination-container-right" v-if="questionsData.list.length" style="text-align: center;">
          <pagination
            @current-change="handleCurrentChange"
            :current-page="questionsData.page" @update:current-page="questionsData.page = $event"
            :page-size="questionsData.pageSize"
            layout="prev, pager, next, jumper"
            :total="questionsData.count">
          </pagination>
        </div> -->
        <noresult-common
          v-else
          v-slot:empty
          text="很遗憾，没有找到您要的试题"
        />
      </div>
    </div>
    <!-- <router-view></router-view> -->
    <!--试题篮组件-->
    <app-tool-basket />
    <!-- 收藏成功提示框 -->
    <collect-message
      ref="collectMessage"
      dialog-title="试题"
      collect-path="/paper/resources/collect?tabActiveName=QuesCollect"
    />
    <cp-simailar-dialog
      ref="simailarDialog"
      @collect-question="onCollectQuestion"
      @check-question-detail="onCheckQuestionDetail"
      @show-report-dialog="onShowReportDialog"
      @add-question-box="onAddQuestionBox"
      @delete-question-box="onDeleteQuestionBox"
    />
    <!-- 纠错提示框 -->
    <report-dialog
      ref="reportDialog"
      @report-error="onReportError"
    />
    <!-- 登录弹窗 -->
    <app-login ref="appLogin" />

    <!---->
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
  import CTS from '@/common/js/constant'
  import { API } from '@/api/config'
  import { mapState } from 'vuex'
  import { getToken, isLogin } from '@/common/js/util'
  import NoresultCommon from '@/components/Noresult/Noresult-common'
  import questionItemMixin from '@/common/mixins/questionItemMixin'
  import Years from '@/components/Category/MultiYears'
  import QuestionTypeMulti from '@/components/Category/MultiQuestionType'
  import QuestionDiff from '@/components/Category/MultiQuestionDiff'
  import QuestionSource from '@/components/Category/MultiQuestionSource'
  import QuestionFilter from '@/components/Category/QuestionFilter'
  import KnowledgeTypeMulti from '@/components/Category/MultiKnowledgeType'
  import { throttle } from '@/common/helper/throttle-debounce'
  import { SpanPagintion } from '@/components/CpFan/index.js'

  export default {
    components: {
      Years,
      QuestionDiff,
      QuestionSource,
      QuestionFilter,
      NoresultCommon,
      SpanPagintion,
      KnowledgeTypeMulti,
      QuestionTypeMulti,
    },
    mixins: [questionItemMixin],
    props: {
      bookId: String, // 选择图书
      checkNodeCode: String, // 选择的章节
      dTree: Array,
      versionCode: String,
      versionGradeCode: String,
      volumeCode: String,
      hasChapterChild: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        loading: false,
        questionsData: {
          list: [],
          page: 1,
          pageSize: 10,
          count: 0,
        },
        searchValue: '',
        showAnswer: false,
        sortState: 1,
        currTypeCode: '',
        currDiffCode: '',
        currSourceCode: '',
        currYearCode: '',
        isFilterUsed: '',
        knowledgePoint: '',
        wrapperThrottle: null, // 防抖动 节流
      }
    },
    computed: {
      ...mapState(['currSubject']),
    },
    watch: {
      checkNodeCode(v) {
        this.questionsData.page = 1
        this.showAnswer = false // 重置显示答案和解析按钮
        this.knowledgePoint = ''
        this.getQusList() // 监听章节选择变化
      },
    },
    created() {
      this.getQusList()
    },
    unmounted() {
      this.wrapperThrottle = null
    },
    methods: {
      selectKnowledge(v) {
        this.knowledgePoint = v
        this.questionsData.page = 1
        this.getQusList()
      },
      // 选择章节
      OnCheckNodeCodeChapter(val) {
        if (!val) {
          // this.bookId = ''
          this.checkNodeCode = ''
          this.questionsData.page = 1
          this.getQusList() // 刷新列表
          return
        }
        // this.bookId = val[0].belongBook
        this.checkNodeCode = val.codes
        // this.checkNodeCode = val
        this.questionsData.page = 1
        this.getQusList() // 刷新列表
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
        if (!this.bookId || !this.checkNodeCode) {
          this.questionsData = {
            list: [],
            page: 1,
            pageSize: 10,
            count: 0,
          }
          this.loading = false
          return
        }
        /*
        lastTextBookChapterCode
        versionCode
        versionGradeCode
        volumeCode
        */

        // 如果选择了 节点 需要处理下 节点数据
        let parms = {
          token: getToken(),
          period: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
          currPage: this.questionsData.page,
          pageSize: this.questionsData.pageSize,
          type: this.currTypeCode ? this.currTypeCode : '',
          difficulty: this.currDiffCode ? this.currDiffCode : '',
          source: this.currSourceCode ? this.currSourceCode : '',
          year: this.currYearCode ? this.currYearCode : '',
          mustKnowledge: this.knowledgePoint,
          content: this.searchValue,
          sortByLatestUpload: 0,
          sortByMostCombine: 0,
          textBookId: this.bookId,
          textBookChapterCodes: this.checkNodeCode,
          isShowAnswerAndAnalysis: '',
          isFilterUsed: this.isFilterUsed,
          versionCode: this.versionCode || '',
          versionGradeCode: this.versionGradeCode || '',
          volumeCode: this.volumeCode || '',
        }

        if (this.checkNodeCode) {
          parms.lastTextBookChapterCode = this.getLastTextBookChapterCode(
            this.dTree,
            this.checkNodeCode,
          )
        }

        if (this.sortState === 2) {
          parms.sortByLatestUpload = 1
          parms.sortByMostCombine = 0
        } else if (this.sortState === 3) {
          parms.sortByLatestUpload = 0
          parms.sortByMostCombine = 1
        } else {
          parms.sortByLatestUpload = 0
          parms.sortByMostCombine = 0
          parms.sortByComposite = 1
        }
        this.apiGet(API.BACK_QUES_LIST, parms, { needAbort: true }).then(
          (res) => {
            if (res.code === CTS.constant.SUCCESS_CODE) {
              if (res.data) {
                this.executeQuestionNum(res.data)
                this.$nextTick(() => {
                  this.onRenderJaxPage('paperContentQuesListRef')
                })
              }
              this.loading = false
            }
          },
          (err) => {
            console.log(err)
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
      },
      // 全部显示答案和解析
      AllShowAnswer(showAllExplain) {
        if (!isLogin()) {
          // this.showAnswer = false
          // this.$refs.appLogin.showLogin()
          if (this.showAnswer) {
            this.questionsData.list.forEach((item, index) => {
              this.$set(item, 'showKnowledge', true)
              this.$set(item, 'showLogin', true)
            })
          } else {
            this.questionsData.list.forEach((item) => {
              this.$set(item, 'showKnowledge', false)
              this.$set(item, 'showLogin', false)
            })
          }
          return
        }
        if (showAllExplain) {
          // 显示所有答案
          let questionIds = []
          this.questionsData.list.forEach((item) => {
            questionIds.push(item.questionInfo.questionId)
          })
          if (questionIds.length === 0) {
            return
          }
          let parms = {
            qids: questionIds.join(','),
          }
          let set = {
            authCode: 1,
          }
          this.apiGet(API.BACK_QUES_LIST_EXPLAIN, parms, set).then((res) => {
            if (res.code === CTS.constant.SUCCESS_CODE) {
              this.questionsData.list.forEach((item, index) => {
                questionIds.push(item.questionInfo.questionId)
                this.$set(item, 'showExplain', true)
                this.$set(item, 'showKnowledge', true)
                if (res.data[index]) {
                  res.data[index].canCollect = true
                }
                item.questionInfo = res.data[index]
              })
            }
          })
        } else {
          // 隐藏所有答案
          this.questionsData.list.forEach((item) => {
            this.$set(item, 'showExplain', false)
            this.$set(item, 'showKnowledge', false)
          })
        }
      },
      changeSortState(sort) {
        this.sortState = sort
        this.questionsData.page = 1
        this.getQusList()
      },
      // 监听全部加入试题篮
      onAddBatchQuestionBox() {
        if (!isLogin()) {
          this.$refs.appLogin.showLogin()
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
        this.questionsData.page = currPage
        this.loading = true
        // this.questionsData.list = []
        this.helperBackToTop() // 返回页面顶部
        this.showAnswer = false // 重置显示答案和解析按钮
        this.getQusList()
      },
      // 选择的题目类型
      selectType(codes) {
        if (this.currTypeCode === codes) return
        this.currTypeCode = codes
        this.questionsData.page = 1
        this.loading = true
        this.showAnswer = false // 重置显示答案和解析按钮
        this.questionsData.list = []
        this.getQusList()
      },
      // 选择的年份
      selectYear(code) {
        if (this.currYearCode === code) return
        this.currYearCode = code
        this.questionsData.page = 1
        this.loading = true
        this.showAnswer = false // 重置显示答案和解析按钮
        this.questionsData.list = []
        this.getQusList()
      },
      // 选择的难度
      selectDiff(code) {
        if (this.currDiffCode === code) return
        this.currDiffCode = code
        this.questionsData.page = 1
        this.loading = true
        this.showAnswer = false // 重置显示答案和解析按钮
        this.questionsData.list = []
        this.getQusList()
      },
      // 是否 过滤 自己的试题
      selectFilter(v) {
        this.isFilterUsed = v
        this.questionsData.page = 1
        this.loading = true
        this.showAnswer = false // 重置显示答案和解析按钮
        this.questionsData.list = []
        this.getQusList()
      },
      // 选择的来源
      selectSource(code) {
        if (this.currSourceCode === code) return
        this.currSourceCode = code
        this.questionsData.page = 1
        this.loading = true
        this.showAnswer = false // 重置显示答案和解析按钮
        this.questionsData.list = []
        this.getQusList()
      },
    },
  }
</script>
<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
  .category-container {
    width: 914px;
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
    margin-bottom: 20px;
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
  .paper-list {
    min-height: 300px;
  }
</style>
