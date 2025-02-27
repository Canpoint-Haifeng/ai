<template>
  <div>
    <div class="category-container">
      <QueryPapeType
        v-show="order === '0'"
        :paper-scene-type="paperSceneType"
        category-label="类型"
        @select-type="onSelectType"
      />
      <SyncBookLevel
        category-label="等级"
        @select-type="onSelectLevel"
      />
      <SyncBookGrade
        v-show="order === '1'"
        category-label="年级"
        @select-type="onSelectGrade"
      />
      <SyncPaperYears
        v-show="order !== '0'"
        category-label="年份"
        @select-type="onSelectYear"
      />
      <SyncPaperAreas
        v-show="order !== '0'"
        @select-type="onSelectAreas"
      />
    </div>
    <div class="paper-container">
      <paper-sort
        class="paper-content"
        :paper-count="paperData.totalCount"
        :page-size="paperData.pageSize"
        :current-page="paperData.currPage"
        :show-search="true"
        :default-curr-sort="defaultCurrSort"
        @change-page="onPageCurrChange"
        @selectpaper-name="onSelectpaperName"
        @select-sort="onSelectSort"
      />
      <div v-if="paperData.list.length > 0">
        <ul class="paper-content paper-list min-height300">
          <paper-item-pages
            v-for="item in paperData.list"
            :key="item.paperId"
            :paper-item="item"
            :show-paper-view="true"
            @on-show-down-load-paper="onShowDownLoadPaper"
            @check-paper-detail="onCheckPaperDetail"
            @on-show-collect-dialog="onShowCollectDialog"
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
        text="很遗憾，没有找到您要的试卷"
      />
    </div>
    <!--试题组件-->
    <app-tool-basket />
    <!-- 试卷分析 -->
    <analysis-dialog
      ref="analysisDialog"
      :question-analysis="questionAnalysis"
    />

    <!-- 下载组卷 -->
    <download-dialog
      ref="downloadDialog"
      :curr-paper="currPaper"
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
    <!-- 登录弹窗 -->
    <app-login ref="appLogin" />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { mapState } from 'vuex'
import { API } from '@/api/config'
import { isLogin } from '@/common/js/util'
import paperCategoryMixin from '@/common/mixins/paperCategoryMixin'
import paperAnalysisMixin from '@/common/mixins/paperAnalysisMixin'
import paperPayMixin from '@/common/mixins/paperPayMixin'
import CollectMessage from '@/components/CollectMessage/CollectMessage'
import PaperSort from '@/components/CpFan/Category/PaperSort'
import PaperItemPages from '@/components/PaperItem/PaperItemPages'
import YearsPaper from '@/components/Category/YearsPaper'
import NoresultCommon from '@/components/Noresult/Noresult-common'
import CpWarningDialog from '@/components/AuthorityVip/CpWarningDialog'
import SyncBookGrade from '@/components/Category/SyncBookGrade.vue'
import SyncPaperType from '@/components/Category/SyncPaperType.vue'
import SyncBookLevel from '@/components/Category/SyncBookLevel.vue'
import SyncPaperYears from '@/components/Category/SyncPaperYears.vue'
import SyncPaperAreas from '@/components/Category/SyncPaperAreas.vue'
import QueryPapeType from '@/components/Category/QueryPapeType.vue'

export default {
  components: {
    PaperSort,
    PaperItemPages,
    YearsPaper,
    NoresultCommon,
    CollectMessage,
    SyncBookGrade,
    SyncPaperType,
    SyncBookLevel,
    SyncPaperYears,
    SyncPaperAreas,
    QueryPapeType,
  },
  mixins: [paperCategoryMixin, paperAnalysisMixin, paperPayMixin],
  props: {
    checkNodeCode: [String, Number],
    teachCurrentCode: String,
    volumeCurrentCode: String,
    versionGradeCode: String,
    paperSceneType: Number,
  },
  data() {
    return {
      defaultCurrSort: 1,
      currSort: 1, // 排序 1-按最新更新 2-按最多浏览 3-按最多下载
      currPaperName: '',
      paperData: {
        pageSize: 10,
        currPage: 1,
        totalCount: 0,
        list: [],
      },
      volume: '',
      levels: '1,2,3,4',
      grade: 0,
      years: 0,
      areas: 0,
      paperId: 0,
      currPaper: {},
      order: '0',
      types: '',
    }
  },
  watch: {
    checkNodeCode() {
      this.paperData.currPage = 1
      if (this.$route.query.type && this.$route.query.type !== 0) {
        this.getAllPaperList()
      } else {
        this.getPaperList()
      }
    },
    volumeCurrentCode() {
      this.paperData.currPage = 1
      this.getPaperList()
    },
    teachCurrentCode() {
      this.paperData.currPage = 1
      this.getPaperList()
    },
    $route: {
      handler(newUrl, oldUrl) {
        this.order = newUrl.query.type ? newUrl.query.type : '0'
        this.getData()
      },
    },
  },
  computed: {
    ...mapState(['currSubject']),
  },
  created() {
    this.order = this.$route.query.type ? this.$route.query.type : '0'
    let query = this.$route.query
    if (query && query.sort) {
      this.currSort = query.sort
      this.defaultCurrSort = query.sort
    }
    console.log(this.order)
    this.getData()
  },
  mounted() {
    this.Bus.$on('downloading', (data, flag) => {
      const index = this.paperData.list.findIndex(
        v => v.paperId === data.paperId,
      )
      this.$set(this.paperData.list[index], 'downLoad', flag)
    })
  },
  unmounted() {
    this.Bus.$off('downloading')
  },
  methods: {
    onShowDownLoadPaper(paperItem) {
      this.currPaper = paperItem
      this.queryOrder(paperItem)
    },

    // 取消试卷收藏
    onShowCollectDialog(val) {
      if (!isLogin()) {
        this.$refs.appLogin.showLogin()
        return
      }
      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        paperId: val.paperId,
        isCollect: val.isCollect === 1 ? 2 : 1,
        source: val.source,
      }

      this.newPost(
        API.PAPER_BUILDER_PAPER_COLLECT,
        parms,
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.getPaperList() // 刷新数据
          if (val.isCollect === 1) {
            this.$refs.collectMessagePaper.showMessage(0)
          } else {
            this.$refs.collectMessagePaper.showMessage(1)
          }
        } else {
          if (res.msg === '1003') {
            CpWarningDialog.install({
              code: '1003',
              onBuyVip: v => {
                if (v === 2) {
                  this.$router.push({
                    path: '/open/campus/service',
                  })
                } else {
                  // CpBuyVip.install({})
                }
              },
            })
          } else {
            this.$message.error(res.msg)
          }
        }
      })
    },
    // 获取同步
    getPaperList() {
      let params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        version: this.teachCurrentCode ? this.teachCurrentCode : '', // 当前试卷版本
        grade: this.currGradeCode ? this.currGradeCode : '', // 当前试卷年级
        volume: this.volume, // 当前试卷册别
        pageNum: this.paperData.currPage, // 当前试卷页数
        pageSize: 10, // 当前试卷每页条数
        sortType: this.currSort, // 排序
        catalog: this.checkNodeCode,
        keyword: this.currPaperName,
        levels: this.levels ? this.levels : '',
        paperTypes: String(this.types) === '0' ? null : this.types,
      }
      // MANAGE_PAPER_LIST
      this.apiGet(
        { urlPath: '/paper-builder/paper/getSyncPaper' },
        params,
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          res.data.list = res.data.records
          res.data.count = res.data.total
          this.paperData = {
            list: res.data.records,
            pageSize: res.data.size,
            currPage: res.data.current,
            totalCount: res.data.total,
          }
        }
      })
    },
    // 获取阶段，备考
    getAllPaperList() {
      let params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        keyword: this.currPaperName,
        grade: this.grade ? this.grade : '', // 当前试卷年级
        years: this.years ? this.years : '', // 当前试卷年份
        areas: this.areas ? this.areas : '', // 当前试卷地区
        sortType: this.currSort, // 排序
        pageNum: this.paperData.currPage, // 当前试卷页数
        pageSize: 10, // 当前试卷每页条数
        sources: '',
        levels: this.levels ? this.levels : '',
        paperTypes: this.checkNodeCode === 0 ? null : this.checkNodeCode,
      }
      // MANAGE_PAPER_LIST
      this.apiGet({ urlPath: '/paper-builder/paper/getAllPaper' }, params, {
        needAbort: true,
      }).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          res.data.list = res.data.records
          res.data.count = res.data.total
          this.paperData = {
            list: res.data.records,
            pageSize: res.data.size,
            currPage: res.data.current,
            totalCount: res.data.total,
          }
        }
      })
    },
    getData() {
      if (this.order !== '0') {
        this.getAllPaperList()
      } else {
        this.getPaperList()
      }
    },
    onSelectType(item) {
      this.types = item.code
      this.paperData.currPage = 1
      this.getData()
    },
    onSelectLevel(item) {
      this.levels = item.code
      this.paperData.currPage = 1
      this.getData()
    },
    onSelectGrade(item) {
      this.grade = item.code
      this.paperData.currPage = 1
      this.getData()
    },
    onSelectYear(item) {
      this.years = item.code
      this.paperData.currPage = 1
      this.getData()
    },
    onSelectAreas(item) {
      this.areas = item.from
      this.paperData.currPage = 1
      this.getData()
    },
    // 监听currPage改变重新调用
    onPageCurrChange(currPage) {
      this.paperData.currPage = currPage
      this.helperBackToTop()
      // document.documentElement.scrollTop = 0
      this.getPaperList()
    },
    // 重置搜索条件
    resetSearchParam(sort = 1) {
      this.paperData = {
        pageSize: 10,
        currPage: 1,
        totalCount: 0,
        list: [],
      }
      this.currSort = sort
      this.currPaperName = ''
      this.getPaperList()
    },
    // 监听选择排序
    onSelectSort(sort) {
      this.currSort = sort
      this.currPaperName = ''
      this.paperData.currPage = 1
      this.getPaperList()
    },
    onSelectpaperName(v) {
      this.currPaperName = v
      this.paperData.currPage = 1
      this.getData()
    },
  },
}
</script>

<style lang="scss" scoped>
  
.category-container :deep() {
  padding: 20px 20px 8px 20px;
  background: $color-white;
  // .category-content {
  //   .category-list {
  //     width: 1200px;
  //   }
  // }
}

.paper-container {
  background: $color-white;
  padding-bottom: 20px;
  margin-top: 16px;
}

.paper-content {
  padding: 0 20px;
}

.pagination-container {
  margin-top: 4px;
}
</style>
