<template>
  <div class="user-content-right">
    <div class="item-content">
      <SyncBookType
        :curr-grade-code="currGradeCode"
        @select-grade="onSelectGrade"
      />
      <!-- <grade @selectGrade="onSelectGrade" :currGradeCode="currGradeCode"></grade>
      <PaperTypeAll @selectType="onSelectType" :currTypeCode="currTypeCode"></PaperTypeAll>
      <years @selectYear="onSelectYear" :currYearCode="currYearCode"></years> -->
    </div>
    <div class="gray-line" />
    <div class="st-item-content">
      <top-pagintion
        v-if="pageData.totalCount"
        v-model:current-page="pageData.currPage"
        :total="pageData.totalCount"
        :page-size="pageData.pageSize"
        @update:current-page="pageData.currPage = $event"
        @change-page="handleCurrentChange"
      />
    </div>
    <div class="s-item-content">
      <div
        v-loading="loading"
        class="paper-content min-height400"
      >
        <ul
          v-if="pageData.list.length > 0"
          class="paper-list min-height350"
        >
          <paper-item
            v-for="item in pageData.list"
            :key="item.paperId"
            :paper-item="item"
            :is-add-book="true"
            :show-paper-view="true"
            @on-show-collect-dialog="showCollectDialog"
            @check-paper-detail="onCheckPaperDetail"
            @show-analysis-dialog="onShowAnalysisDialog"
            @show-add-book-dialog="OnShowAddBookDialog"
            @on-show-down-load-paper="onShowDownLoadPaper"
          />
        </ul>
        <pagination
          v-if="pageData.list.length > 0"
          :page-data="pageData"
          @page-curr-change="handleCurrentChange"
        />
        <!-- <div class="pagination-container" v-if="pageData.list.length">
          <el-pagination @current-change="handleCurrentChange" background :current-page="pageData.currPage" @update:current-page="pageData.currPage = $event"
            :page-size="pageData.pageSize" layout="prev, pager, next, jumper" :total="pageData.totalCount">
          </el-pagination>
        </div> -->
        <noresult-common
          v-else
          #empty
          text="很遗憾，没有找到您要的试卷"
        />
      </div>
    </div>
    <!--试题组件-->
    <app-tool-basket />
    <!-- 试卷分析 -->
    <analysis-dialog
      ref="analysisDialog"
      :question-analysis="questionAnalysis"
    />
    <!-- 取消收藏成功提示框 -->
    <collect-message
      ref="collectMessagePaper"
      :collect-status="1"
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
    <!---->
    <!-- 将试卷试题添加到我的图书 -->
    <append-paper-book-dialog
      ref="appendPaper2BookDialog"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
import NoresultCommon from '@/components/Noresult/Noresult-common'
import CollectMessage from '@/components/CollectMessage/CollectMessage'
import Years from '@/components/Category/Years'
import paperCategoryMixin from '@/common/mixins/paperCategoryMixin'
import paperAnalysisMixin from '@/common/mixins/paperAnalysisMixin'
import PaperItem from '@/components/PaperItem/PaperItem.vue'
import { TopPagination } from '@/components/CpFan/index.js'
import paperPayMixin from '@/common/mixins/paperPayMixin'
import paperShareMixin from '@/common/mixins/paperShareMixin'
import SyncBookType from '@/components/Category/SyncAllType.vue'
export default {
  components: {
    PaperItem,
    TopPagination,
    CollectMessage,
    NoresultCommon,
    SyncBookType,
    Years,
  },
  mixins: [
    paperShareMixin,
    paperCategoryMixin,
    paperAnalysisMixin,
    paperPayMixin,
  ],
  setup() {
    const collectMessagePaper = ref(null)
    const state = reactive({
      loading: true,
      pageData: {
        list: [],
        pageSize: 10,
        currPage: 1,
        totalCount: 0,
        totalPage: 1,
      },
      currTimeCode: {
        timeBegin: '',
        timeEnd: '',
      },
      currPaper: {},
    })

    const store = useStore()
    const currSubject = computed(() => store.state.currSubject)

    onMounted(() => {
      getCollection()
    })

    async onCheckPaperDetail(paperItem) {
      // let res = await this.paperStatusOnLine(
      //   paperItem.paperIdEnc,
      //   paperItem.source,
      // )
      // if (res && res.code !== 200) {
      //   this.$message.error(res.msg)
      //   return
      // }
      let viewCount = paperItem.viewCount || paperItem.totalCountView || 0
      // console.log(paperItem)
      let queryStr =
        '?paperIdEnc=' +
        paperItem.paperIdEnc +
        '&source=' +
        paperItem.source +
        '&viewCount=' +
        viewCount +
        '&pn=' +
        (paperItem.provinceName || '') +
        '&paperId=' +
        paperItem.paperId
      queryStr += '&subject=' + this.currSubject.subjectCode
      window.open(this.$router.resolve('/paper/detail').href + queryStr)
    },
    onShowDownLoadPaper(paperItem) {
      this.currPaper = paperItem
      this.queryOrder(paperItem)
    },

    resetSearchParam() {
      this.getCollection()
    },
    // 我的收藏
    getCollection() {
      let params = {
        // period: this.currSubject.periodCode,
        // subject: this.currSubject.subjectCode,
        // currPage: this.pageData.currPage,
        // pageSize: this.pageData.pageSize,
        // timeBegin: this.currTimeCode.timeBegin,
        // timeEnd: this.currTimeCode.timeEnd,
        // paperType: this.currTypeCode || '',
        // grade: this.currGradeCode || '',
        // year: this.currYearCode || '',
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        beginTime: this.currTimeCode.timeBegin
          ? this.returnChangeTime(this.currTimeCode.timeBegin)
          : '',
        endTime: this.currTimeCode.timeEnd
          ? this.returnChangeTime(this.currTimeCode.timeEnd)
          : '',
        pageNum: this.pageData.currPage,
        pageSize: this.pageData.pageSize,
      }

      this.apiGet(
        { urlPath: '/paper-builder/personal/getExamPaperCollection' },
        params,
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.loading = false
          if (res.data && res.data.data && res.data.data.length > 0) {
            this.pageData = {
              pageSize: this.pageData.pageSize,
              currPage: this.pageData.currPage,
              totalCount: res.data.total,
              list: res.data.data.map(item => {
                item.isCollected = 1
                return item
              }),
            }
          }
        } else {
          this.loading = false
        }
      })
    },
    returnChangeTime(time) {
      var date = new Date(time * 1000)
      var year = date.getFullYear()
      var month = ('0' + (date.getMonth() + 1)).slice(-2)
      var day = ('0' + date.getDate()).slice(-2)
      var hour = ('0' + date.getHours()).slice(-2)
      var minute = ('0' + date.getMinutes()).slice(-2)
      var second = ('0' + date.getSeconds()).slice(-2)
      var dateString =
        year +
        '-' +
        month +
        '-' +
        day +
        ' ' +
        hour +
        ':' +
        minute +
        ':' +
        second
      return dateString
    },
    // 查看试卷
    goPaper(item) {
      this.$router.push({
        path: '/paper/detail',
        query: {
          paperIdEnc: item.paperIdEnc,
        },
      })
    },
    // 取消试卷收藏
    showCollectDialog(val) {
      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        paperId: val.paperId,
        isCollect: 2,
        source: val.paperSource,
      }
      this.newPost(
        API.PAPER_BUILDER_PAPER_COLLECT,
        parms,
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          getCollection() // 刷新数据
          collectMessagePaper.value.showMessage()
        }
      })
    },
    // 选择的时间
    OnSelectTime(item) {
      this.currTimeCode = item
      this.pageData.currPage = 1
      this.getCollection() // 刷新数据
    },
    // 分页
    handleCurrentChange(currPage) {
      this.pageData.currPage = currPage
      this.helperBackToTop()
      this.getCollection()
    },
  },
}
</script>

<style lang="scss" scoped>
  
.user-content-right {
  width: 934px;
  background-color: $color-white;

  .item-content {
    padding: 10px 20px;

    .show-info-title {
      width: 50%;
      color: $color-text-d;
      font-size: $font-size-medium;
      font-weight: bold;
      margin-bottom: 24px;
      display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;

      span {
        display: block;
        width: 2px;
        height: 14px;
        margin-right: 20px;
        background: rgba(102, 102, 102, 1);
      }
    }
  }
}

.paper-item {
  padding: 24px 20px;
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

    .iconfont {
      margin-right: 10px;
      font-size: $font-size-medium-x;
    }

    .iconword {
      color: #66d7dd;
    }

    .iconpdf {
      color: #ff6e5d;
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
      .iconfont {
        margin-right: 10px;
        font-size: 15px;
      }

      .operate-btn {
        display: inline-block;
        width: 80px;
        height: 26px;
        line-height: 22px;
        margin-left: 16px;
        box-sizing: border-box;
        text-align: center;
        border-radius: 13px;
        font-size: $font-size-small;
        cursor: pointer;
        transition: 0.2s;

        .iconcollect {
          color: #ff6e5d;
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

.s-item-content {
  padding: 0px 20px 30px 20px;
}

.st-item-content {
  padding: 0px 20px;
  border-bottom: 1px solid #eeeeee;
  margin-bottom: 20px;
}

.el-pagination {
  padding: 4px 5px 0;
}

:deep(.el-pagination.is-background .el-pager li) {
  background-color: #f6f6f6;
  border: 1px solid #eceff3;
}

:deep(.el-pagination.is-background .btn-next) {
  background-color: #f6f6f6;
  border: 1px solid #eceff3;
}

:deep(.el-pagination.is-background .btn-prev) {
  background-color: #f6f6f6;
  border: 1px solid #eceff3;
}

:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
  color: #fff;
  background: #487fff;
  border: 1px solid #487fff;
}
</style>
