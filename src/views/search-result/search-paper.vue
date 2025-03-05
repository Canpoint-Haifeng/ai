<template>
  <div class="content-container">
    <breadcrumb :crumbs-data="crumbsData" />
    <div class="search-container">
      <div class="category-container">
        <!-- <paper-type-all @selectType="onSelectType"></paper-type-all>
        <grade @selectGrade="onSelectGrade"></grade>
        <years-paper @selectYear="onSelectYear"></years-paper>
        <areas @selectArea="onSselectArea"></areas> -->
        <filterItem
          v-for="(v, i) in filterOptions"
          :key="i"
          :label="v.label"
          :list="v.list"
          :allow-multiple="v.allowMultiple"
          @change="filterChange(v.key, $event)"
        />
      </div>
      <div class="paper-container min-height350">
        <div
          v-if="paperData.list.length > 0"
          class="paper-top-pagintion"
        >
          <top-pagintion
            :current-page="paperData.currPage"
            direction="left"
            suffix="份试卷"
            :total="paperData.totalCount"
            :page-size="paperData.pageSize"
            @update:current-page="paperData.currPage = $event"
            @change-page="onPageCurrChange"
          />
        </div>
        <div
          v-if="paperData.list.length > 0"
          class="paper-content"
        >
          <ul class="paper-list min-height300">
            <paper-item
              v-for="item in paperData.list"
              :key="item.paperId"
              :paper-item="item"
              @check-paper-detail="onCheckPaperDetail"
              @on-show-collect-dialog="onShowCollectDialog"
              @on-show-down-load-paper="onShowDownLoadPaper"
              @show-analysis-dialog="onShowAnalysisDialog"
            />
          </ul>
          <pagination
            v-if="paperData.list.length > 0"
            :page-data="paperData"
            @page-curr-change="onPageCurrChange"
          />
        </div>
        <noresult-common
          v-else
          text="当前学科下未找到您要搜索的试卷~"
          :icon="icon"
        />
      </div>
    </div>
    <!-- 试卷分析 -->
    <analysis-dialog
      ref="analysisDialog"
      :question-analysis="questionAnalysis"
    />
    <!-- 登录弹窗 -->
    <!-- 下载组卷 -->
    <download-dialog
      ref="downloadDialog"
      @download-paper="onDownloadPaper"
    />
    <!-- 支付提示框 -->
    <pay-dialog
      v-if="payData.weChatQrcode"
      ref="payDialog"
      :pay-data="payData"
      @change-pay-type="onChangePayType"
      @balance-pay="onBalancePay"
      @entry-my-wallet="onEntryMyWallet"
      @close-pay-dialog="onClosePayDialog"
    />

    <!-- 取消收藏成功提示框 -->
    <collect-message
      ref="collectMessagePaper"
      :collect-status="1"
    />

    <app-login ref="appLogin" />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
import paperCategoryMixin from '@/common/mixins/paperCategoryMixin'
import paperAnalysisMixin from '@/common/mixins/paperAnalysisMixin'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import PaperItem from '@/components/PaperItem/PaperItem'
import noresultIcon from '@/components/Noresult/noresult-search.png'
import NoresultCommon from '@/components/Noresult/Noresult-common'
import YearsPaper from '@/components/Category/YearsPaper'
import { TopPagination } from '@/components/CpFan/index'
import paperPayMixin from '@/common/mixins/paperPayMixin'
import CollectMessage from '@/components/CollectMessage/CollectMessage'
import { executeSearchKeyWord } from '@/common/helper/search-keywords'
import filterItem from '@/views/myPreparation/components/filterItem.vue'
export default {
  mixins: [paperCategoryMixin, paperAnalysisMixin, paperPayMixin],
  data() {
    return {
      filterOptions: [
        // {label: '类型', key: 'questionType', list: [{label: '单选题', value: 1}, {label: '多选题', value: 2}, {label: '填空题', value: 3}, {label: '解答题', value: 4}, {label: '判断题', value: 5}]},
        {
          label: '年级',
          key: 'grade',
          list: [
            { label: '容易', value: 1 },
            { label: '较易', value: 2 },
            { label: '中等', value: 3 },
            { label: '较难', value: 4 },
            { label: '困难', value: 5 },
          ],
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
        },
        { label: '地区', key: 'areas', list: [{ label: '', value: 1 }] },
      ],
      params: { sortType: 1 },
      crumbsData: [
        {
          path: '',
          isLink: false,
          text: '试卷搜索',
        },
      ],
      keywords: '',
      paperList: [],
      paperData: {
        pageSize: 10,
        currPage: 1,
        totalPage: 0,
        list: [],
      },
      icon: noresultIcon,
    }
  },
  computed: {
    ...mapState(['currSubject']),
  },
  watch: {
    $route() {
      if (this.$route.query.keywords !== this.keywords) {
        this.keywords = this.$route.query.keywords
        this.resetSearchParam()
      }
    },
  },
  created() {
    this.keywords = this.$route.query.keywords
      ? this.$route.query.keywords
      : this.keywords
    this.getPaperList()
    const data = {
      stage: this.currSubject.periodCode,
      subject: this.currSubject.subjectCode,
    }
    this.apiGet(API.PAPER_BUILDER_GET_GRADES, data).then(
      res => {
        const list = res.data || []
        list.forEach(item => {
          item.label = item.name
          item.value = item.id
        })
        this.filterOptions.splice(0, 1, { ...this.filterOptions[0], list })
      },
    )
    this.apiGet(API.PAPER_BUILDER_GET_YEARS).then(res => {
      const list = res.data || []
      list.forEach(item => {
        item.label = item.name
        item.value = item.id
      })
      this.filterOptions.splice(1, 1, { ...this.filterOptions[1], list })
    })
    this.apiGet(API.PAPER_BUILDER_GET_AREAS).then(res => {
      const list = res.data || []
      list.forEach(item => {
        item.label = item.name
        item.value = item.id
      })
      this.filterOptions.splice(2, 1, { ...this.filterOptions[2], list })
    })
  },
  unmounted() {
    // this.Bus.$off('topSearch')
  },
  methods: {
    filterChange(k, v) {
      this.params[k] = v
      this.paperData.currPage = 1
      this.loading = true
      this.paperData.list = []
      this.getPaperList()
    },
    onShowDownLoadPaper(paperItem) {
      this.currPaper = paperItem
      this.queryOrder(paperItem)
    },

    // 取消试卷收藏
    onShowCollectDialog(val) {
      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        paperId: val.paperId,
        isCollect: val.status,
        source: val.source,
      }

      this.newPost(
        API.PAPER_BUILDER_PAPER_COLLECT,
        parms,
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.getPaperList() // 刷新数据
          collectMessagePaperRef.value.showMessage(val.status === 1 ? 1 : 0)
        }
      })
    },
    // 获取当前选中学段学科值
    /* getSelectSubject() {
        nextTick(() => {
          this.currSubject = selectSubjectRef.value.activeSubject
          this.getPaperList()
        })
    }, */
    // 获取试卷列表数据
    getPaperList() {
      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        // type: this.currTypeCode ? this.currTypeCode : '', // 当前试卷类型
        keyword: this.keywords, // 试卷关键字
        pageNum: this.paperData.currPage, // 当前试卷页数
        pageSize: this.paperData.pageSize, // 当前试卷每页条数
        ...this.params,
      }
      this.apiGet(API.PAPER_BUILDER_GET_ALL_PAPER, parms).then(
        res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.paperData.list = res.data.records
            this.paperData.totalCount = res.data.total
          }
        },
      )
    },
    executePaperList(list) {
      list.forEach(item => {
        item.paperName = executeSearchKeyWord(item.paperName, this.keywords)
      })
    },
    // 重置搜索条件
    resetSearchParam() {
      this.paperData = {
        pageSize: 10,
        currPage: 1,
        totalPage: 0,
        list: [],
      }
      this.getPaperList()
    },
    // 监听currPage改变重新调用
    onPageCurrChange(currPage) {
      this.paperData.currPage = currPage
      this.getPaperList()
    },
  },
  components: {
    Breadcrumb,
    PaperItem,
    YearsPaper,
    NoresultCommon,
    TopPagination,
    CollectMessage,
    filterItem,
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  
.paper-top-pagintion {
  padding: 1px 20px;
  border-bottom: 1px #eeeeee solid;
  margin-bottom: 20px;
}
.search-container {
  margin-bottom: 70px;
}
.search-main {
  position: relative;
  min-height: 825px;
  margin-left: 286px;
  box-sizing: border-box;
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
.category-container :deep() {
  padding: 20px 20px 8px 20px;
  background: $color-white;
  .category-content {
    .category-list {
      width: 1200px;
    }
  }
}
.paper-container {
  margin-top: 16px;
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
      padding: 0 5px;
      color: $color-text-d;
      font-size: $font-size-medium;
    }
  }
}
.paper-content {
  padding: 0 20px;
}
</style>

