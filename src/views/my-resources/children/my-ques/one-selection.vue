<template>
  <div>
    <!-- <KnowledgeTypeMulti
      :isChapter="isChapter"
      :checkNodeCode="checkNodeCode"
      :hasChapterChild="hasChapterChild"
      @selectType="selectKnowledge"
    ></KnowledgeTypeMulti> -->

    <div
      class="category-container"
      :class="{ show_more: filterExpand }"
    >
      <!-- <filterItem v-for="(v, i) in filterOptions" :key="i" :label="v.label" :list="v.list" @change="filterChange(v.key, $event)" :allowMultiple="v.allowMultiple" />
      <more @change="moreChange"/> -->
      <!-- <div class="expand">
        <span @click="filterExpand=!filterExpand"><i class="iconfont icon-down_line" :class="{rotate: filterExpand}"></i>{{ filterExpand? '收起':'展开'  }}</span>
      </div> -->
    </div>
    <div class="gray-line" />
    <div class="paper-container min-height750">
      <div class="paper-sort">
        <div class="sort-list">
          <span
            class="sort-item"
            :class="{ active: params.sortType === 1 }"
            @click="changeSortState(1)"
          >
            综合<i class="iconfont icon-transfer_2_line" />
          </span>
          <span
            class="sort-item"
            :class="params.sortType === 2 ? 'active' : ''"
            @click="changeSortState(2)"
          >最新<i class="iconfont icon-transfer_2_line" /></span>
          <span
            class="sort-item"
            :class="params.sortType === 3 ? 'active' : ''"
            @click="changeSortState(3)"
          >最热<i class="iconfont icon-transfer_2_line" /></span>
        </div>
        <div class="paper-search">
          <el-input
            v-model="searchValue"
            placeholder="在结果中搜索"
            @keyup.enter.native="handleCurrentChange(1)"
          >
            <template #suffix>
              <i
                class="iconfont icon-search_3_line"
              
                @click="handleCurrentChange(1)"
              />
            </template>
          </el-input>
        </div>
        <div class="total">
          共计<span>{{ questionsData.count }}</span>道试题
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
          <question-item
            v-for="(subItem, subIndex) in questionsData.list"
            :key="subIndex"
            :question-item="subItem"
            :question-index="subIndex"
            :show-similar="true"
            :show-share-question="true"
            show-recommend
            @check-similar-quesiton="onCheckSimilarQuesiton"
            @add-question-box="onAddQuestionBox"
            @delete-question-box="onDeleteQuestionBox"
            @check-question-detail="onCheckQuestionDetail"
            @collect-question="onCollectQuestion"
            @show-report-dialog="onShowReportDialog"
            @toggle-explain="onToggleExplain"
            @recommend-question="onRecommendQuestion"
          />
        </ul>
        <pagination
          v-if="questionsData.list.length > 0"
          :page-data="questionsData"
          @page-curr-change="handleCurrentChange"
        />
        <noresult-common
          v-else
          slot="empty"
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
    <!-- 推荐试题 弹框 -->
    <RecommendQuestionDia
      ref="recommendQuestionRef"
      is-to-recommend
    />
    <!-- 登录弹窗 -->
    <app-login ref="appLogin" />
  </div>
</template>

<script>
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
import { getToken, isLogin } from '@/common/js/util'
// import filterItem from "./components/filterItem.vue";
// import more from "./components/more.vue";
import questionItemMixin from '@/common/mixins/questionItemMixin'
import KnowledgeTypeMulti from '@/components/Category/MultiKnowledgeType'
import { throttle } from '@/common/helper/throttle-debounce'
import { SpanPagintion } from '@/components/CpFan/index.js'
import { dealQuestion } from '@/common/helper/search-keywords.js'
import { decrypt } from '@/common/js/util.js'

export default {
  components: {
    // filterItem,
    // more,
    SpanPagintion,
    KnowledgeTypeMulti,
  },
  mixins: [questionItemMixin],
  props: {
    isChapter: Number,
    bookId: String, // 选择图书
    checkNodeCode: Object, // 选择的章节
    dTree: Array,
    versionCode: String,
    versionGradeCode: String,
    volumeCode: String,
    hasChapterChild: Boolean,
    // checkNodeCodeKnowledge: String,
    // checkNodeCodeSpecial: String,
    isIntersection: String,
    allMustKnowPointContain: String,
    rootKnowPoint: String,
  },
  data() {
    return {
      loading: false,
      filterOptions: [
        {
          label: '等级',
          key: 'level',
          list: [
            { label: '网络级', value: 1 },
            { label: '精品级', value: 2 },
            { label: '出版级', value: 3 },
          ],
        },
        {
          label: '题型',
          key: 'questionType',
          list: [
            { label: '单选题', value: 1 },
            { label: '多选题', value: 2 },
            { label: '填空题', value: 3 },
            { label: '解答题', value: 4 },
            { label: '判断题', value: 5 },
          ],
        },
        {
          label: '难度',
          key: 'difficult',
          list: [
            { label: '容易', value: 1 },
            { label: '较易', value: 2 },
            { label: '中等', value: 3 },
            { label: '较难', value: 4 },
            { label: '困难', value: 5 },
          ],
          allowMultiple: true,
        },
        {
          label: '年份',
          key: 'years',
          list: [
            { label: '2024', value: 1 },
            { label: '2023', value: 2 },
            { label: '2022', value: 3 },
            { label: '2021', value: 4 },
            { label: '更早', value: 5 },
          ],
          allowMultiple: true,
        },
        {
          label: '场景',
          key: 'scene',
          list: [
            { label: '预习', value: 1 },
            { label: '作业', value: 2 },
            { label: '单元测', value: 3 },
            { label: '月考', value: 4 },
            { label: '期中', value: 5 },
            { label: '期末', value: 6 },
          ],
        },
      ],
      filterExpand: false,
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
      wrapperThrottle: null, // 防抖动 节流
      comprehensiveData: {},
      configTypeDict: {
        1: 'solvingMethod',
        3: 'thinkingMethod',
        4: 'questionCatagory',
      },
      defaultCoreAbility: '',
      coreAbility: '',
      configCode: '',
      configTypeValue: '',
      selectConfigTypes: [], //  是否显示 解题方法 思维方式 等 属性
      knowledgePoint: '',
      params: { sortType: 1 },
    }
  },
  computed: {
    ...mapState(['currSubject']),
  },
  watch: {
    userInfo() {
      this.questionsData.page = 1
      this.getQusList()
    },
    isChapter() {
      this.showAnswer = false // 重置显示答案和解析按钮
      this.questionsData.page = 1
      this.getQusList()
    },
    textBookId() {
      this.showAnswer = false // 重置显示答案和解析按钮
      this.questionsData.page = 1
      this.getQusList()
    },
    checkNodeCode: {
      handler(v) {
        this.showAnswer = false // 重置显示答案和解析按钮
        this.questionsData.page = 1
        this.knowledgePoint = ''
        this.getQusList()
      },
      deep: true,
    },
    // 选择知识点
    // checkNodeCodeKnowledge(val) {
    //   this.questionsData.page = 1
    //   this.getQusList() // 刷新列表
    // },
    // // 专题
    // checkNodeCodeSpecial(val) {
    //   this.questionsData.page = 1
    //   this.getQusList()
    // },
    isIntersection() {
      this.questionsData.currPage = 1
      if (this.allMustKnowPointContain) {
        this.getQusList() // 刷新列表
      }
    },
    allMustKnowPointContain() {
      this.questionsData.currPage = 1
      if (this.allMustKnowPointContain) {
        this.getQusList() // 刷新列表
      }
    },
  },

  created() {
    let query = this.$route.query
    if (query && query.cc) {
      if (query.cc == 2 || query.cc == 5) {
        this.defaultCoreAbility = query.ct || ''
      } else {
        this.configCode = query.cc
        this.configTypeValue = query.ct || ''
        if (this.configCode && this.configTypeValue) {
          let keystr = this.configTypeDict[this.configCode]
          if (keystr) {
            this.comprehensiveData[keystr] = this.configTypeValue
          }
        }
      }
    }
    this.getQuestConfigType()
  },
  mounted() {
    // 监听添加试题
    this.getQusList()
    this.getFilterOptions()
  },
  unmounted() {
    this.wrapperThrottle = null
  },
  methods: {
    getFilterOptions() {
      // /paper-builder/config/getYears
      const data = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      this.apiGet({ urlPath: '/lesson-app/config/getQuestionType' }, data).then(
        res => {
          const list = res.data || []
          list.forEach(item => {
            item.label = item.name
            item.value = item.id
          })
          this.filterOptions.splice(1, 1, { ...this.filterOptions[1], list })
        },
      )
      this.apiGet({ urlPath: '/paper-builder/config/getYears' }).then(res => {
        const list = res.data || []
        list.forEach(item => {
          item.label = item.name
          item.value = item.id
        })
        this.filterOptions.splice(3, 1, { ...this.filterOptions[3], list })
      })
      this.apiGet({ urlPath: '/paper-builder/config/getQuestionScene' }).then(
        res => {
          const list = res.data || []
          list.forEach(item => {
            item.label = item.name
            item.value = item.code
          })
          this.filterOptions.splice(4, 1, { ...this.filterOptions[4], list })
        },
      )
    },
    onSelectConfigType(v) {
      this.configTypeValue = v
      this.loading = true
      this.questionsData.page = 1
      this.getQusList() // 刷新题目
    },
    getQuestConfigType() {
      // let params = {
      //   period: this.currSubject.periodCode,
      //   subjectCode: this.currSubject.subjectCode,
      // }
      // this.apiGet(API.QUESIOTN_SELECT_CONFIGTYPE, params).then((res) => {
      //   if (this.checkoutRes(res)) {
      //     this.selectConfigTypes = res.data.configTypeList.map(
      //       (item) => item.code,
      //     )
      //   }
      // })
    },
    selectCoreAbility(v) {
      this.coreAbility = v
      this.questionsData.page = 1
      this.loading = true
      this.showAnswer = false // 重置显示答案和解析按钮
      this.clearQuesitonList()
      this.getQusList() // 刷新题目
    },
    onChangeComprehensive(v) {
      this.comprehensiveData = v
      this.questionsData.page = 1
      this.loading = true
      this.showAnswer = false // 重置显示答案和解析按钮
      this.clearQuesitonList()
      this.getQusList() // 刷新题目
    },
    selectKnowledge(v) {
      console.log('v: ', v)
      this.knowledgePoint = v
      this.questionsData.page = 1
      this.getQusList()
    },
    // 选择章节
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
      // if (!(!(this.isChapter == 1) || (this.bookId && this.checkNodeCode))) {
      //   this.questionsData = {
      //     list: [],
      //     page: 1,
      //     pageSize: 10,
      //     count: 0,
      //   }
      //   this.loading = false
      //   return
      // }
      // if (!this.checkNodeCode) {
      //   this.questionsData = {
      //     list: [],
      //     page: 1,
      //     pageSize: 10,
      //     count: 0,
      //   }
      //   this.loading = false
      //   return
      // }
      let parms = {
        catalogueTreeId: this.checkNodeCode[this.$route.query.type || 1],
        catalogueType: [11, 10, 12][this.$route.query.type || 1],
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        pageNum: this.questionsData.page,
        pageSize: this.questionsData.pageSize || 10,
        keyword: this.searchValue,
        ...this.comprehensiveData,
        ...this.params,
      }
      // switch (this.isChapter) {
      //   case 0:
      //     // parms.v2KnowledgeCodes = this.checkNodeCodeKnowledge
      //     parms.v2KnowledgeCodes = this.knowledgePoint ? this.knowledgePoint : this.checkNodeCode
      //     break;
      //   case 1:
      //     parms.v2ChapterCodes = this.knowledgePoint ? this.knowledgePoint : this.checkNodeCode
      //     break;
      //   case 2:
      //     // parms.specialCatalogCodes = this.checkNodeCodeSpecial
      //     parms.specialCatalogCodes = this.knowledgePoint ? this.knowledgePoint : this.checkNodeCode
      //     break;
      //   default:
      // }
      // if (this.sortState === 2) {
      //   parms.sortByLatestUpload = 1
      //   parms.sortByMostCombine = 0
      // } else if (this.sortState === 3) {
      //   parms.sortByLatestUpload = 0
      //   parms.sortByMostCombine = 1
      // } else {
      //   parms.sortByLatestUpload = 0
      //   parms.sortByMostCombine = 0
      //   parms.sortByComposite = 1
      // }
      //   if (this.knowledgePoint) {
      //     parms.mustKnowledge = this.knowledgePoint
      //   }

      // if (this.isChapter == 1) {
      //   parms.textBookId = this.bookId
      //   // parms.textBookChapterCodes = this.checkNodeCode
      //   parms.versionCode = this.versionCode || ''
      //   parms.versionGradeCode = this.versionGradeCode || ''
      //   parms.volumeCode = this.volumeCode || ''
      //   // if (this.checkNodeCode) {
      //   //   parms.lastTextBookChapterCode = this.getLastTextBookChapterCode(
      //   //     this.dTree,
      //   //     this.checkNodeCode,
      //   //   )
      //   // }
      // } else if (this.isChapter == 0) {
      //   parms.section = ''
      //   if (this.isIntersection == '0') {
      //     // parms.knowledgePoint = this.checkNodeCodeKnowledge
      //     //   ? this.checkNodeCodeKnowledge
      //     //   : ''
      //   } else {
      //     parms.allMustKnowPointContain = this.allMustKnowPointContain || ''
      //     parms.rootKnowPoint = this.rootKnowPoint || ''
      //   }
      //   // parms.knowledgePoint = this.checkNodeCodeKnowledge
      //   //   ? this.checkNodeCodeKnowledge
      //   //   : ''
      // } else {
      //   // 专题
      // }
      const url = '/paper-builder/question/getQuestions'
      this.apiGet({ urlPath: url }, parms, {
        needAbort: true,
        showLoading: true,
      }).then(
        res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            if (res.data) {
              // let data = decrypt(res.data)
              let data = res.data
              data.list = data.records
              if (data) {
                // data = JSON.parse(data)
                this.executeQuestionNum(data)
              }
              this.$nextTick(() => {
                // this.onRenderJaxPage('knowledgeSelectionRef')
              })
            }
            this.loading = false
          }
        },
        err => {
          console.log(err)
        },
      )
    },
    executeQuestionNum(data) {
      let list = data.list || []
      let page = data.current || 1
      let pageSize = data.size || 10
      data.count = data.total
      list.forEach((item, index) => {
        item.questionInfo = { ...item }
        item.questionNum = index + 1 + (page - 1) * pageSize
        item.showQuestionNum = true
        item.questionInfo.canCollect = true
        dealQuestion(item, this.searchValue)
      })
      // 出来搜索到的数据 真特么烦

      this.questionsData = { ...data, page }
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
          this.questionsData.list.forEach(item => {
            this.$set(item, 'showKnowledge', false)
            this.$set(item, 'showLogin', false)
          })
        }
        return
      }
      if (showAllExplain) {
        // 显示所有答案
        let questionIds = []
        this.questionsData.list.forEach(item => {
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
        this.apiGet(API.BACK_QUES_LIST_EXPLAIN, parms, set).then(res => {
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
        this.questionsData.list.forEach(item => {
          this.$set(item, 'showExplain', false)
          this.$set(item, 'showKnowledge', false)
        })
      }
    },
    changeSortState(v) {
      this.params.sortType = v
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
      this.questionsData.list.forEach(item => {
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
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        paramsJson: JSON.stringify(questionList),
      }
      let set = {
        authCode: 1,
      }
      this.apiPost(API.QUESTION_BATCH_ADD, parms, set).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$message.success('成功添加到试题篮!')
          this.questionsData.list.forEach(subItem => {
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
      this.clearQuesitonList()
      this.helperBackToTop() // 返回页面顶部
      this.showAnswer = false // 重置显示答案和解析按钮
      this.getQusList()
    },
    // 选择的题目类型
    selectType(code) {
      if (this.currTypeCode === code) return
      this.currTypeCode = code
      this.questionsData.page = 1
      this.loading = true
      this.showAnswer = false // 重置显示答案和解析按钮
      this.clearQuesitonList()
      this.getQusList()
    },
    // 选择的年份
    selectFilter(v) {
      this.isFilterUsed = v
      this.questionsData.page = 1
      this.loading = true
      this.showAnswer = false // 重置显示答案和解析按钮
      this.clearQuesitonList()
      this.getQusList()
    },
    clearQuesitonList() {
      // 视觉效果问题 不清理数据感觉 用户等待的时间少点
      // this.questionsData.list = []
    },
    filterChange(k, v) {
      this.params[k] = v
      this.getQusListHttp()
    },
    moreChange(v) {
      this.params = { ...this.params, ...v }
      this.getQusListHttp()
    },
  },
}
</script>
<style lang="scss" scoped>
.category-container {
  width: 914px;
  padding: 20px 20px 12px 20px;
  background: $color-white;
  position: relative;
  // max-height: 213px;
  // overflow: hidden;;
  transition: all 0.2s;
  // &.show_more {
  //   max-height: 500px;
  //   overflow: visible;
  // }
  .expand {
    display: flex;
    justify-content: flex-end;
    background: #fff;
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0 20px;
    width: 100%;
    cursor: pointer;
    &:has(.rotate) {
      background: transparent;
    }
    span {
      width: 64px;
      height: 24px;
      background: rgba(153, 153, 153, 0.1);
      border-radius: 4px 4px 0px 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #999999;
      position: relative;
      z-index: 3;
      &:hover {
        background: rgba(153, 153, 153, 0.2);
      }
      i {
        margin-right: 3px;
        // font-size: 12px;
        &.rotate {
          transform: rotateX(180deg);
        }
      }
    }
  }
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
  padding: 16px 20px 20px;
  display: flex;
  font-size: 16px;
  align-items: center;
  .sort-list {
    display: flex;
    .sort-item {
      margin-right: 30px;
      cursor: pointer;
      display: flex;
      align-items: center;
      &.active,
      &:hover {
        color: #487fff;
      }
      i {
        font-size: 20px;
        transform: translate(-4px, 1px) rotateX(180deg);
      }
    }
  }
  :deep(.paper-search) {
    display: inline-block;
    margin-left: 40px;
    width: 200px;
    .iconfont {
      font-size: 20px;
      cursor: pointer;
    }
    .el-input {
      .el-input__suffix {
        right: 8px;
        display: flex;
        align-items: center;
      }
      input {
        border-radius: 3px;
        height: 30px;
      }
    }
  }
  .total {
    margin-left: auto;
    span {
      color: #ff6900;
    }
  }
}
.paper-content {
  padding: 0 20px;
}
</style>
