<template>
  <div class="user-content-right">
    <div class="item-content">
      <CategoryList
        :category-list="shareList"
        :default-code="shareType"
        @select-category="selectCategory"
      >
        <template #label>
          <label class="category-label-b-l">分享类别</label>
        </template>
      </CategoryList>

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
        <div class="paper-search" />
        <div class="paper-show-answer el-cyy-rewrite" />
        <div class="paper-add-black" />
      </div>

      <div
        v-loading="loading"
        class="paper-content min-height500"
      >
        <ul
          v-if="pageData.list.length > 0"
          class="paper-list min-height500"
        >
          <SharePaperItem
            v-for="item in pageData.list"
            :key="item.id"
            :paper-item="item"
            :subject-code="currSubject.subjectCode"
            @cancel-share="OnCancelShare"
            @on-show-down-load-paper="OnShowDownloadDialog"
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
          :is-show-text="false"
        >
          <div class="empty-share">
            暂无试卷，快去<span @click="goShareGoodPaper">分享好卷</span>赚下载券吧
          </div>
        </noresult-common>
      </div>
    </div>

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

    <!-- 删除弹窗 -->
    <base-dialog
      ref="deleteDialog"
      @comfirm="onDeleteBasket"
    >
      <template #dialogTips>
        <div

          class="dialog-tips"
        >
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
  import CategoryList from '@/components/Category/CategoryList'
  import SharePaperItem from './SharePaperItem'

  import BaseDialog from '@/components/BaseDialog/BaseDialog'
  import paperShareMixin from '@/common/mixins/paperShareMixin'
  import paperPayMixin from '@/common/mixins/paperPayMixin'
  import CpCommonDialog from '@/components/AuthorityVip/CpCommonDialog'
  export default {
    components: {
      CategoryList,
      NoresultCommon,
      SharePaperItem,
      BaseDialog,
    },
    mixins: [paperShareMixin, paperPayMixin],
    setup() {
      const deleteDialog = ref(null)
      const comfirmDialog = ref(null)
      
      const state = reactive({
        currPaperItem: null,
        pageData: {
          list: [],
          pageSize: 10,
          currPage: 1,
          totalCount: 0,
        },
        shareType: '',
        sortValue: 1,
        loading: true,
        shareList: [
          {
            code: '',
            name: '全部',
          },
          {
            code: '1',
            name: '组卷分享',
          },
          {
            code: '2',
            name: '试卷分享',
          },
        ],
      })

      const currSubject = computed(() => store.state.currSubject)
    mounted() {
      if (this.currSubject) {
        this.getMySharePaper()
      }
    },
    methods: {
      goShareGoodPaper() {
        this.$router.push({ path: '/paper/chapter/selection' })
      },
      OnCancelShare(paperItem) {
        CpCommonDialog.openDialog({
          moduleC: 'CpConfigDialog',
          data: {
            title: '取消分享',
            content: '是否确认取消分享？',
            comfirm: (status) => {
              if (status) {
                this.cancelShareHttp(paperItem)
              }
            },
          },
        })
        // CENTER_SHAREPAPER_EDITSHARESTATUS
      },
      cancelShareHttp(paperItem) {
        let params = {
          shareId: paperItem.id,
          status: 0,
        }
        this.apiPost(API.CENTER_SHAREPAPER_EDITSHARESTATUS, params, {
          showLoading: true,
        }).then((res) => {
          if (this.checkoutRes(res)) {
            this.showMessage('取消成功', 'success')
            this.getMySharePaper()
          }
        })
      },
      selectCategory(item) {
        this.shareType = item.code
        this.pageData.currPage = 1
        this.getMySharePaper()
      },
      changeSortValue(v) {
        this.sortValue = v
        this.pageData.currPage = 1
        this.getMySharePaper()
      },

      updateListEvent() {
        this.getMySharePaper()
      },

      // 删除单项试题
      onDeleteBasket() {
        let parms = {
          paperInfoId: this.currPaperItem.id,
        }
        this.apiPost(API.DELETE_SCHOOL_PAPER, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.$message.success('删除成功!')
            getMySharePaper() // 更新接口
            deleteDialog.value.hide()
          }
        })
      },
      handleCurrentChange(v) {
        this.pageData.currPage = v
        this.pageData.list = []
        this.getMySharePaper()
      },

      getMySharePaper() {
        let params = {
          period: this.currSubject.periodCode,
          subjectCode: this.currSubject.subjectCode,
          shareType: this.shareType, // 分享类别：1-组卷分享，2-试卷分享
          sortType: this.sortValue,
          currPage: this.pageData.currPage,
          pageSize: this.pageData.pageSize,
        }

        this.apiGet(API.RESOURCE_SHAREPAPER_GETSHAREPAPERPAGE, params, {
          showLoading: true,
        }).then((res) => {
          this.loading = false
          if (res.code === CTS.constant.SUCCESS_CODE) {
            // infoName
            this.pageData = res.data
          } else {
          }
        })
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
          this.apiPost(API.PAPER_EDIT, parms).then((res) => {
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
      OnShowEditPaperDialog(item) {
        // 监听下载试卷
        this.currPaperItem = item
        if (state.currPaperItem) {
          comfirmDialog.value.show()
        }
      },

      // 下载组卷
      OnShowDownloadDialog(paperItem) {
        // 监听下载试卷
        this.currPaperItem = paperItem
        this.queryOrder(paperItem)
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  
  .user-content-right {
    width: 934px;
    background-color: $color-white;
    .item-content {
      padding: 20px 20px;
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
          background: rgb(44, 8, 8);
        }
      }
    }
  }

  .category-label-b-l {
    font-weight: normal;
    color: #666666;
    width: 60px;
    line-height: 24px;
    -ms-flex-item-align: start;
    align-self: flex-start;
    margin-right: 13px;
  }

  .paper-sort {
    height: 46px;
    line-height: 46px;
    padding: 0 20px;
    // border-bottom: 1px solid $color-background-l;
    // margin-bottom: 20px;
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
        &.iconfont {
          position: relative;
          font-size: 14px;
        }
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
    :deep(.paper-search)) {
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
    :deep(.paper-show-answer)) {
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
