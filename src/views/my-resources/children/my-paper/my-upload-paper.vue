<template>
  <div class="user-content-right">
    <div class="item-content">
      <paper-type-self
        style="width: 80%;"
        category-label="试卷类型"
        @select-type="OnSelectType"
      />
      <top-pagintion
        :current-page="pageData.currPage"
        @update:current-page="pageData.currPage = $event"
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
          <resource-paper-item
            v-for="item in pageData.list"
            :key="item.id"
            :paper-item="item"
            :is-add-book="true"
            @show-edit-paper-dialog="OnShowEditPaperDialog"
            @show-delete-dialog="OnShowDeleteDialog"
            @show-download-dialog="OnShowDownloadDialog"
            @show-share-dialog="OnShowShareDialog"
            @reupload-word="reuploadWord"
            @show-add-book-dialog="OnShowAddBookDialog"
            @re-parse="onReParse"
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

    <!-- 重新编辑提示框 -->
    <base-dialog
      ref="comfirmDialogRef"
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

    <!-- 删除弹窗 -->
    <base-dialog
      ref="deleteDialogRef"
      @comfirm="onDeleteBasket"
    >
      <template #dialogTips>
        <div class="dialog-tips">
          试卷删除后，不可恢复，请谨慎操作，仍要删除试卷？
        </div>
      </template>
    </base-dialog>

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

    <!-- 分享 -->
    <!-- <share-dialog @sharePaperDown="sharePaperDown" ref="shareDialog"></share-dialog> -->

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
import PaperTypeSelf from '@/components/Category/PaperTypeSelf'
import ResourcePaperItem from '@/components/Resources/ResourcePaperItem'
import { TopPagination } from '@/components/CpFan/index.js'
import BaseDialog from '@/components/BaseDialog/BaseDialog'
import paperShareMixin from '@/common/mixins/paperShareMixin'
import paperPayMixin from '@/common/mixins/paperPayMixin'
export default {
  components: {
    PaperTypeSelf,
    ResourcePaperItem,
    TopPagination,
    BaseDialog,
  },
  computed: {
    ...mapState(['currSubject']),
  },
  mixins: [paperShareMixin, paperPayMixin],
  setup() {
    const deleteDialogRef = ref(null)
    const comfirmDialogRef = ref(null)
    const currPaperItem = ref(null)
    const pageData = reactive({
      list: [],
      pageSize: 10,
      currPage: 1,
      totalCount: 0,
      paperType: '',
    })
    const loading = ref(true)

    onMounted(() => {
      if (this.currSubject) {
        getMyuploadPaper()
      }
    })

    // Methods
    onReParse(item) {
      this.apiPost(
        { urlPath: '/paper-builder/personal/reParse' },
        { paperInfoId: item.id },
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.getMyuploadPaper()
        }
      })
      // {post} /school/paper/reParse  重新解析
      // @NotNull(message = "参数不能为空") Long paperInfoId
    },
    async reuploadWord(item) {
      // get   /v2/paper/uploadInfo 上传详情
      // @NotNull(message = "参数不能为空") Long uploadInfoId
      // 获取信息
      let results = await this.apiGet(API.RESOURCE_PAPER_UPLOADINFO, {
        uploadInfoId: item.id,
      })
      if (results.code === CTS.constant.SUCCESS_CODE) {
        this.$store.state.reUploadPaper = results.data
      }
      results = await this.apiPost(API.DELETE_SCHOOL_PAPER, {
        paperInfoId: item.id,
      })
      if (results.code === CTS.constant.SUCCESS_CODE) {
        this.$router.push({
          name: 'PaperUpload',
          query: { activeName: 'three' },
        })
      }
    },
    updateListEvent() {
      this.getMyuploadPaper()
    },
    // 删除下载
    const OnShowDeleteDialog = (item) => {
      currPaperItem.value = item
      deleteDialogRef.value.show()
    }
    
    // 删除单项试题
    const onDeleteBasket = () => {
      let parms = {
        paperInfoId: currPaperItem.value.id,
      }
      apiPost({ urlPath: '/paper-builder/personal/delPaper' }, parms).then(
        res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            message.success('删除成功!')
            getMyuploadPaper() // 更新接口
            deleteDialogRef.value.hide()
          }
        },
      )
    },
    handleCurrentChange(v) {
      this.pageData.currPage = v
      this.pageData.list = []
      this.getMyuploadPaper()
    },
    OnSelectType(item) {
      this.paperType = item.code
      this.pageData.currPage = 1
      this.getMyuploadPaper()
    },
    getMyuploadPaper() {
      // let params = {
      //   stage: this.currSubject.periodCode,
      //   subject: this.currSubject.subjectCode,
      //   pageNum: this.pageData.currPage,
      //   pageSize: this.pageData.pageSize,
      // }
      // this.newPost({ urlPath: '/paper-builder/personal/myUpload' }, params).then(
      //   res => {
      //     if (res.code === CTS.constant.SUCCESS_CODE) {
      //       this.loading = false
      //       this.pageData = {
      //         pageSize: this.pageData.pageSize,
      //         currPage: this.pageData.currPage,
      //         totalCount: res.data.total,
      //         list: res.data.data
      //       }
      //     } else {
      //       this.loading = false
      //     }
      //   },
      // )
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
    openPaper(row) {
      this.$router.push({ path: './editword', query: { id: row.id } })
    },
    // 重新编辑试卷
    onEditPaper() {
      if (this.currPaperItem.paperIdEnc) {
        let parms = {
          paperIdEnc: this.currPaperItem.paperIdEnc,
        }
        this.apiPost(API.PAPER_EDIT, parms).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.$router.push({
              name: 'paperMaker',
            })
          }
        })
      } else {
        this.$router.push({
          name: 'paperMaker',
          query: {
            paperInfoId: this.currPaperItem.id,
          },
        })
      }
    },
    const OnShowEditPaperDialog = (item) => {
      // 监听下载试卷
      currPaperItem.value = item
      if (currPaperItem.value) {
        comfirmDialogRef.value.show()
      }
    },

    // 下载组卷
    OnShowDownloadDialog(paperItem) {
      // 监听下载试卷
      paperItem.paperName = paperItem.infoName
      this.currPaperItem = paperItem
      this.queryOrder(paperItem)
    },

    entryUpload() {
      this.$router.push({
        name: 'PaperUpload',
      })
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

    .div_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

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
</style>
