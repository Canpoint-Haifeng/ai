<template>
  <div class="user-content-right">
    <div class="item-content">
      <general-time
        category-label="组卷时间"
        @select-time="OnSelectTime"
      />
      <top-pagintion
        v-model:current-page="pageData.currPage"
        :total="pageData.totalCount"
        :page-size="pageData.pageSize"
        @change-page="handleCurrentChange"
      />
      <div
        v-loading="loading"
        class="paper-content min-height500"
      >
        <ul
          v-if="pageData.list.length > 0"
          class="paper-list min-height500"
        >
          <paper-item
            v-for="item in pageData.list"
            :key="item.paperUid"
            :paper-item="item"
            :is-my-paper="true"
            :is-add-book="true"
            :is-show-paper="true"
            :subject-code="currSubject.subjectCode"
            @show-download-dialog="OnShowDownloadDialog"
            @show-edit-paper-dialog="OnShowEditPaperDialog"
            @check-paper-detail="onCheckPaperDetail"
            @show-delete-dialog="OnShowDeleteDialog"
            @show-share-dialog="OnShowShareDialog"
            @show-add-book-dialog="OnShowAddBookDialog"
            @show-copy-paper-dialog="OnshowCopyPaperDialog"
          />
        </ul>
        <pagination
          v-if="pageData.list.length > 0"
          :page-data="pageData"
          @page-curr-change="handleCurrentChange"
        />
        <noresult-common
          v-else
          #empty
          text="很遗憾，没有找到您要的试卷"
        />
      </div>
    </div>
    <!-- 下载组卷 -->
    <download-dialog
      ref="downloadDialog"
      :curr-paper="currPaper"
      @download-paper="onDownloadPaper"
    />
    <!-- 复制弹窗 -->
    <base-dialog
      ref="copyDialog"
      @comfirm="onCopyPaper"
    >
      <template #dialogTips>
        <div class="dialog-tips">
          确认复制试卷？
        </div>
      </template>
    </base-dialog>
    <!-- 支付提示框 -->
    <pay-dialog
      v-if="payData.weChatQrcode"
      ref="payDialog"
      :pay-data="payData"
      :curr-paper="currPaper"
      @change-pay-type="onChangePayType"
      @balance-pay="onBalancePay"
      @entry-my-wallet="onEntryMyWallet"
      @close-pay-dialog="onClosePayDialog"
    />
    <!---->
    <!-- 删除弹窗 -->
    <base-dialog
      ref="deleteDialog"
      @comfirm="onDeleteBasket"
    >
      <template #dialogTips>
        <div class="dialog-tips">
          试卷删除后，不可恢复，请谨慎操作，仍要删除试卷？
        </div>
      </template>
    </base-dialog>
    <!-- -->
    <!-- 重新编辑提示框 -->
    <base-dialog
      ref="comfirmDialog"
      title="组卷编辑提示"
      :show-cancel-btn="false"
      @comfirm="onEditPaper"
    >
      <template #dialogTips>
        <div class="dialog-tips">
          编辑将清空当前试题篮试题，并把当前试卷题目加入试题篮。
        </div>
      </template>
    </base-dialog>
    <!---->
    <!-- <share-dialog @sharePaperDown="sharePaperDown" ref="shareDialog"></share-dialog> -->

    <!-- 将试卷试题添加到我的图书 -->
    <append-paper-book-dialog ref="appendPaper2BookDialog" />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { mapState } from 'vuex'
import GeneralTime from '@/components/Category/Time'
import BaseDialog from '@/components/BaseDialog/BaseDialog'
import PaperItem from '@/components/PaperItem/PaperItemUserCom'
import { TopPagination } from '@/components/CpFan/index.js'
import paperShareMixin from '@/common/mixins/paperShareMixin'
import paperPayMixin from '@/common/mixins/paperPayMixin'

export default {
  components: {
    BaseDialog,
    GeneralTime,
    PaperItem,
    TopPagination,
  },
  mixins: [paperShareMixin, paperPayMixin],
  setup() {
    const comfirmDialog = ref(null)
    const deleteDialog = ref(null)
    const copyDialog = ref(null)
    
    const state = reactive({
      loading: true,
      pageData: {
        list: [],
        pageSize: 10,
        currPage: 1,
        totalCount: 0,
      },
      timeData: {
        timeBegin: 0,
        timeEnd: 0,
      },
      currPaperItem: {},
      currPaper: {},
    })

    const currSubject = computed(() => store.state.currSubject)

    onMounted(() => {
      getPaperList()
      
      eventBus.on('downloading', (data, flag) => {
        const index = state.pageData.list.findIndex(v => v.paperId === data.paperId)
        state.pageData.list[index].downLoad = flag
      })
      
      eventBus.on('deleteMyPaper', getPaperList)
    })

    onUnmounted(() => {
      eventBus.off('downloading')
      eventBus.off('deleteMyPaper') 
    })
  methods: {
    updateListEvent() {
      this.getPaperList()
    },
    // 获取试卷列表数据
    getPaperList() {
      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        beginTime: this.timeData.timeBegin ? this.returnChangeTime(this.timeData.timeBegin) : '',
        endTime: this.timeData.timeEnd ? this.returnChangeTime(this.timeData.timeEnd) : '',
        pageNum: this.pageData.currPage,
        pageSize: this.pageData.pageSize,
      }
      this.apiGet({ urlPath: '/paper-builder/personal/getPaperGeneration' }, parms).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.loading = false
          this.pageData = {
            pageSize: this.pageData.pageSize,
            currPage: this.pageData.currPage,
            totalCount: res.data.total,
            list: res.data.data
          }
        } else {
          this.loading = false
        }
      })
    },
    returnChangeTime(time) {
      var date = new Date(time * 1000);
      var year = date.getFullYear();
      var month = ("0" + (date.getMonth() + 1)).slice(-2);
      var day = ("0" + date.getDate()).slice(-2);
      var hour = ("0" + date.getHours()).slice(-2);
      var minute = ("0" + date.getMinutes()).slice(-2);
      var second = ("0" + date.getSeconds()).slice(-2);
      var dateString = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
      return dateString;
    },
    // 编辑组卷
    OnShowEditPaperDialog(paperItem) {
      // 监听下载试卷
      this.currPaperItem = paperItem
      this.$refs.comfirmDialog.show()
    },
    // 重新编辑试卷
    onEditPaper() {
      let parms = {
        paperUuid: this.currPaperItem.paperUid,
      }
      this.apiPost({ urlPath: '/paper-builder/testPaper/editTestPaper' }, parms).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$router.push({
            name: 'paperMaker',
          })
        } else {
          this.$refs.comfirmDialog.hide()
        }
      })
    },
    // 删除下载
    OnShowDeleteDialog(paperId) {
      this.currPaperItem = paperId
      this.$refs.deleteDialog.show()
    },
    // 删除单项试题
    onDeleteBasket() {
      let parms = {
        paperUid: this.currPaperItem.paperUid,
      }
      this.apiPost({ urlPath: '/paper-builder/personal/deleteTestPaper' }, parms).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$message.success('删除成功!')
          this.getPaperList() // 更新接口
          this.$refs.deleteDialog.hide()
        } else {
          this.$refs.deleteDialog.hide()
        }
      })
    },
    //详情
    onCheckPaperDetail(paperItem) {
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
        '&paperId=' + paperItem.paperId
      queryStr += '&subject=' + this.currSubject.subjectCode
      window.open(this.$router.resolve('/paper/detail').href + queryStr)
    },
    // 下载组卷
    OnShowDownloadDialog(paperItem) {
      // 监听下载试卷
      this.currPaper = paperItem
      this.currPaperItem = paperItem
      this.queryOrder(paperItem)
    },
    // 复制试卷
    OnshowCopyPaperDialog(paperItem) {
      this.currPaperItem = paperItem
      this.$refs.copyDialog.show()
    },
    // 确认复制
    onCopyPaper() {
      let parms = {
        paperId: this.currPaperItem.id,
        source: this.currPaperItem.source,
      }
      this.apiPost({ urlPath: '/paper-builder/personal/copyPaper' }, parms).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$message.success('复制成功!')
          this.getPaperList() // 更新接口
          this.$refs.copyDialog.hide()
        } else {
          this.$message.error(res.msg)
          this.$refs.copyDialog.hide()
        }
      })
    },
    // 分页
    handleCurrentChange(currPage) {
      this.pageData.currPage = currPage
      this.pageData.list = []
      this.getPaperList()
    },
    // 选择时间
    OnSelectTime(currVal) {
      console.log(currVal);
      this.timeData = currVal
      this.pageData.currPage = 1
      this.getPaperList()
    },
  },
}
</script>

<style lang="scss" scoped>
  
.user-content-right {
  width: 934px;
  background-color: $color-white;

  .item-content {
    padding: 30px 20px;

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

.el-pagination {
  padding: 4px 5px 0;
}

.wen-tip {
  margin-top: 20px;
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
  background: #487FFF;
  border: 1px solid #487FFF;
}
</style>
