<template>
  <div class="content-container">
    <breadcrumb :crumbs-data="crumbsData" />
    <div class="search-container">
      <div class="category-container">
        <filterItem
          v-for="(v, i) in filterOptions"
          :key="i"
          :label="v.label"
          :list="v.list"
          :allow-multiple="v.allowMultiple"
          @change="filterChange(v.key, $event)"
        />
        <!-- <question-type @selectType="onSelectType"></question-type>
        <question-diff @selectDiff="selectDiff"></question-diff>
        <years @selectYear="selectYear"></years> -->
      </div>
      <div
        ref="searchQuestionRef"
        class="question-container min-height750"
      >
        <div
          v-if="questionsData.list.length > 0"
          class="paper-top-pagintion"
        >
          <!-- <top-pagintion
            direction="left"
            suffix="道试题"
            :current-page="questionsData.currPage" @update:current-page="questionsData.currPage = $event"
            :total="questionsData.totalCount"
            :page-size="questionsData.pageSize"
            @changePage="onPageCurrChange"
          ></top-pagintion> -->
        </div>
        <!-- <div class="data-list">
          <div class="data-num">共计 <span>{{ questionsData.totalCount }}</span> 份教案</div>
          <ul class="paper-list min-height500" v-if="questionsData.list.length > 0">
            <ItemData v-for="(item, index) in questionsData.list" :currentIndex="currentIndex" :key="index" :paperItem="item"
              :isShowPaper="true" :isMyPaper="true" :subjectCode="currSubject.subjectCode"
              @showDownloadDialog="OnShowDownloadDialog" @showEditPaperDialog="OnShowEditPaperDialog"
              @checkPaperDetail="onCheckPaperDetail" @showDeleteDialog="OnShowDeleteDialog"
              @showContributeDialog="OnhowContributeDialog" @showcollectDialog="showcollectDialog"></ItemData>
          </ul>
          <pagination v-if="questionsData.list.length > 0" @pageCurrChange="onPageCurrChange" :questionsData="questionsData">
          </pagination>
          <noresult-common text="很遗憾，没有找到您要的教案" v-else v-slot:empty></noresult-common>
        </div> -->

        <div class="data-list">
          <PaperSort
            :paper-count="questionsData.totalCount"
            @select-sort="selectSort"
          />
          <ul
            v-if="questionsData.list.length > 0"
            class="paper-list min-height500"
          >
            <ItemData
              v-for="(item, index) in questionsData.list"
              :key="index"
              :paper-item="item"
              :is-show-paper="true"
              :is-my-paper="true"
              :subject-code="currSubject.subjectCode"
              @show-download-dialog="OnShowDownloadDialog"
              @show-edit-paper-dialog="OnShowEditPaperDialog"
              @check-paper-detail="onCheckPaperDetail"
              @show-delete-dialog="OnShowDeleteDialog"
              @show-contribute-dialog="OnhowContributeDialog"
            />
          </ul>
          <!-- {{ questionsData }} -->
          <pagination
            v-if="questionsData.list.length > 0"
            :page-data="questionsData"
            @page-curr-change="onPageCurrChange"
          />
          <noresult-common
            v-else
            #empty
            text="很遗憾，没有找到您要的教案"
          />
        </div>

        <!-- <div class="question-content" v-if="questionsData.list.length > 0">
          <ul class="question-list min-height500">
            <question-item
              v-for="(item, index) in questionsData.list"
              :key="index"
              :questionItem="item"
              :questionIndex="index"
              :showSimilar="true"
              @checkSimilarQuesiton="onCheckSimilarQuesiton"
              @checkQuestionDetail="onCheckQuestionDetail"
              @collectQuestion="onCollectQuestion"
              @showReportDialog="onShowReportDialog"
              @addQuestionBox="onAddQuestionBox"
              @deleteQuestionBox="onDeleteQuestionBox"
              @toggleExplain="onToggleExplain"
            >
            </question-item>
          </ul>
          <pagination
            v-if="questionsData.list.length > 0"
            @pageCurrChange="onPageCurrChange"
            :questionsData="questionsData"
          >
          </pagination>
        </div>
        <noresult-common
          v-else
          text="当前学科下未找到您要搜索的试题~"
          :icon="icon"
        >
        </noresult-common> -->
      </div>
    </div>
    <!--试题篮组件-->
    <!-- <app-tool-basket></app-tool-basket> -->
    <!-- 收藏成功提示框 -->
    <collect-message
      ref="collectMessage"
      dialog-title="试题"
      collect-path="/paper/resources/collect?tabActiveName=QuesCollect"
    />
    <!-- 显示相似题  -->
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
    <!-- 下载教案 -->
    <download-dialog
      ref="downloadDialog"
      :curr-paper="currPaper"
      @download-paper="onDownloadPaper"
    />
    <download
      v-model="downloadVisible"
      :info="currPaper"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated, toRefs } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { dealQuestion } from '@/common/helper/search-keywords.js'
import { mapState } from 'vuex'
import questionItemMixin from '@/common/mixins/questionItemMixin'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import QuestionType from '@/components/Category/QuestionType'
import QuestionItem from '@/components/QuestionItem/QuestionItem'
import noresultIcon from '@/components/Noresult/noresult-search.png'
import NoresultCommon from '@/components/Noresult/Noresult-common'
import { TopPagination } from '@/components/CpFan/index.js'
import Years from '@/components/Category/Years'
import QuestionDiff from '@/components/Category/QuestionDiff'
import filterItem from '@/views/myPreparation/components/filterItem.vue'
import PaperSort from './components/PaperSort.vue'
import ItemData from './components/item-data.vue'
import download from '@/views/teachingPlanEdit/components/download.vue'
import paperPayMixin from '@/common/mixins/paperPayMixin'

export default {
  mixins: [questionItemMixin, paperPayMixin],
  setup() {
    const contributeDialog = ref(null)
    const deleteDialog = ref(null)
    const comfirmDialog = ref(null)
    const form = ref({})
    const currPaperItem = ref(null)
    
    const state = reactive({
      downloadVisible: false,
      currPaper: {},
      currentIndex: 0,
      filterOptions: [
        {
          label: '教案类型',
          key: 'lessonType',
          list: [
            { label: '同步教案', value: 1 },
            { label: '阶段复习', value: 2 },
            { label: '专题备考', value: 3 }
          ],
          // ['同步教案', '阶段复习', '专题备考']
        },
        {
          label: '适用难度',
          key: 'suitType',
          list: [
            { label: '基础', value: 1 },
            { label: '中等', value: 2 },
            { label: '拔高', value: 3 }
          ],
        }
      ],
      params: {
        sortType: 7,
        lessonStatus: 1,
      },
      crumbsData: [
        {
          path: '',
          isLink: false,
          text: '试题搜索',
        }
      ],
      keywords: '',
      questionsData: {
        count: 0,
        pageSize: 10,
        currPage: 1,
        totalCount: 0,
        list: [],
      },
      // pageData: {
      //   list: [],
      //   pageSize: 5,
      //   currPage: 1,
      //   totalCount: 5,
      // }
      currTypeCode: '',
      currYearCode: '',
      currDiffCode: '',
      icon: noresultIcon,
    })
    
    return {
      ...toRefs(state),
      contributeDialog,
      deleteDialog,
      comfirmDialog,
      form,
      currPaperItem
    }
  },
  computed: {
    ...mapState(['currSubject']),
  },
  watch: {
    $route() {
      if (this.$route.query.keywords !== this.keywords) {
        this.keywords = this.$route.query.keywords
        this.questionsData = {
          pageSize: 10,
          currPage: 1,
          totalCount: 1,
          list: [],
        }
        this.getQuestionList()
      }
    },
  },
  created() {
    this.keywords = this.$route.query.keywords
      ? this.$route.query.keywords
      : this.keywords
    this.getQuestionList()
  },
  methods: {
    selectSort(val) {
      this.questionsData.currPage = 1
      this.params.sortType = val
      this.getQuestionList()
    },
    filterChange(k, v) {
      this.params[k] = v
      this.questionsData.currPage = 1
      this.loading = true
      this.questionsData.list = []
      this.getQuestionList()
    },
    // 选择的年份
    selectYear(item) {
      this.currYearCode = item.code
      this.questionsData.currPage = 1
      this.loading = true
      this.questionsData.list = []
      this.getQuestionList()
    },
    // 选择的难度
    selectDiff(item) {
      this.currDiffCode = item.code
      this.questionsData.currPage = 1
      this.loading = true
      this.questionsData.list = []
      this.getQuestionList()
    },
    // 监听试题类型选择
    onSelectType(item) {
      if (this.currTypeCode === item.code) {
        return
      }
      this.currTypeCode = item.code
      this.questionsData = {
        pageSize: 10,
        currPage: 1,
        totalCount: 0,
        list: [],
      }
      this.getQuestionList()
    },
    // 获取题目列表
    getQuestionList() {
      let parms = {
        // stage: this.currSubject.periodCode,
        // subject: this.currSubject.subjectCode,

        lessonName: this.keywords,
        pageNum: this.questionsData.currPage,
        pageSize: this.questionsData.pageSize,
        ...this.params,
      }
      //
      this.newPost(
        API.LESSON_APP_QUERY_ALL_LESSONS,
        parms
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          //  搜索的 都是 题库的是 source 为1
          let list = res.data.records || []
          let page = res.data.current || 1
          let pageSize = res.data.size || 10
          list.forEach((item, index) => {
            item.questionInfo = { ...item }
            item.questionNum = index + 1 + (page - 1) * pageSize
            item.showQuestionNum = true
            item.questionInfo.canCollect = true
            dealQuestion(item, this.searchValue)
          })
          this.questionsData.totalCount = res.data.total
          this.questionsData.list = list

          this.$nextTick(() => {
            this.onRenderJaxPage('searchQuestionRef')
          })
        }
      })
    },
    // 出来搜索到的数据 真特么烦
    executeQuestionList(reslist) {
      reslist.forEach(item => {
        dealQuestion(item, this.keywords)
      })
    },

    // 监听分页改变时触发
    onPageCurrChange(currPage) {
      this.questionsData.currPage = currPage
      this.getQuestionList()
    },
    showcollectDialog(paperItem) {
      const params = {
        lessonId: paperItem.id,
        status: 2,
      }
      this.apiPost(
        API.LESSON_APP_LESSON_COLLECT,
        params,
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$message.success(res.msg)
          this.questionsData.currPage = 1
          this.getQuestionList()
        }
      })
    },
    //投稿
    OnhowContributeDialog(paperItem) {
      form.value = { ...paperItem }
      contributeDialog.value.show()
    },
    // 监听试题篮删除试题类型或清空
    onDeleteBasket() {
      this.getQuestionList()
    },
    OnShowDeleteDialog(paperId) {
      console.log(paperId)
      currPaperItem.value = paperId
      deleteDialog.value.show()
    },
    onCheckPaperDetail(paperItem) {
      this.$router.push({
        path: '/smartPaper/prePare',
        query: {
          id: paperItem.id,
          source: 1,
          type: paperItem.lessonType,
        }
      })
    },
    // 编辑教案
    OnShowEditPaperDialog(paperItem) {
      // 监听下载教案
      currPaperItem.value = paperItem
      comfirmDialog.value.show()
    },
    // 下载教案
    OnShowDownloadDialog(paperItem) {
      console.log('下载是否触发', paperItem)

      // 监听下载教案
      this.currPaper = paperItem
      this.currPaperItem = paperItem
      this.downloadVisible = true
      // this.queryOrder(paperItem)
    },
  },
  components: {
    Breadcrumb,
    QuestionType,
    Years,
    QuestionDiff,
    QuestionItem,
    NoresultCommon,
    TopPagination,
    filterItem,
    PaperSort,
    ItemData,
    download,
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  
.paper-top-pagintion {
  padding: 0px 20px;
  border-bottom: 1px #eeeeee solid;
  margin-bottom: 20px;
}
.search-container {
  margin-bottom: 70px;
}
.search-side {
  position: relative;
  width: 270px;
  margin-right: -270px;
  background: $color-white;
  &.fixed-side {
    position: fixed;
    top: 0;
    z-index: 999;
    width: 270px;
    box-sizing: border-box;
  }
}
.category-container {
  padding: 20px 20px 8px 20px;
  background: $color-white;
  :deep(.category-content)) {
    .category-list {
      width: 1200px;
    }
  }
}
.question-container {
  margin-top: 16px;
  background: $color-white;
  padding-bottom: 20px;
}
.question-sort {
  height: 46px;
  line-height: 46px;
  padding: 0 20px;
  border-bottom: 1px solid $color-background-l;
  margin-bottom: 20px;
  .question-total {
    margin-right: 25px;
    .num {
      padding: 0 2px;
      color: $color-text-d;
      font-size: $font-size-medium;
    }
  }
}
.question-content {
  padding: 0 20px;
}
.paper-list {
  padding: 0 20px;
}
</style>
