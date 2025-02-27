<template>
  <div class="user-content-right">
    <div class="item-content">
      <general-time
        category-label="组卷时间"
        @select-time="OnSelectTime"
      />
      <down-load-type @select-type="OnSelectType" />

      <top-pagintion
        v-model:current-page="pageData.currPage" @update:current-page="pageData.currPage = $event"
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
            :key="item.paperId"
            :paper-item="item"
            :is-my-paper="true"
            @show-delete-dialog="OnShowDeleteDialog"
            @on-show-download-dialog="onShowDownLoadPaper"
            @check-paper-detail="onCheckPaperDetail"
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
          v-slot:empty
          text="很遗憾，没有找到您要的试卷"
        />
      </div>
      <!-- <p class="wen-tip">温馨提示：组卷仅保留1年内的组卷，请尽快下载使用。</p> -->
    </div>
    <!-- 下载组卷 -->
    <download-dialog
      ref="downloadDialog"
      :curr-paper="currPaper"
      @download-paper="onDownloadPaper"
    />

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
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { getElementXyHw } from '@/common/js/util'
import { mapState } from 'vuex'
import NoresultCommon from '@/components/Noresult/Noresult-common'
import GeneralTime from '@/components/Category/Time'
import DownLoadType from '@/components/Category/DownLoadType'
import DownloadDialog from '@/components/DownloadDialog/DownloadDialog'
import PaperItem from '@/components/Resources/DownLoadPaperItem.vue'
import { TopPagination } from '@/components/CpFan/index.js'
import BaseDialog from '@/components/BaseDialog/BaseDialog'
export default {
  components: {
    DownLoadType,
    DownloadDialog,
    NoresultCommon,
    GeneralTime,
    PaperItem,
    TopPagination,
    BaseDialog,
  },
  data() {
    return {
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
      paperSource: '',
      collectDialog: {
        visible: false,
        title: '试卷收藏',
        showClose: true,
        width: '500px',
      },
      payCurrPaper: {},
      currPaper: {},
    }
  },
  mounted() {
    // 监听删除组卷
    this.Bus.$on('deleteMyPaper', this.getPaperList)
  },
  computed: {
    ...mapState(['currSubject']),
  },
  created() {
    this.getPaperList()
  },
  methods: {
    // 删除下载
    OnShowDeleteDialog(item) {
      this.currPaperItem = item
      this.$refs.deleteDialog.show()
    },
    // 删除单项试题
    onDeleteBasket() {
      let parms = {
        paperUid: this.currPaperItem.paperId,
        source: this.currPaperItem.paperSource,
      }
      this.apiPost({ urlPath: '/paper-builder/personal/deleteDownloadRecord' }, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$message.success('删除成功!')
          this.getPaperList() // 更新接口
          this.$refs.deleteDialog.hide()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    async onShowDownLoadPaper(paperItem) {
      // let res = await this.paperStatusOnLine(
      //   paperItem.paperIdEnc,
      //   paperItem.paperSource,
      // )
      // if (res && res.code !== 200) {
      //   this.$message.error(res.msg)
      //   return
      // }

      paperItem.source = paperItem.paperSource
      this.payCurrPaper = paperItem
      this.currPaper = paperItem
      this.showDownloadDialog()
      // this.queryOrder(paperItem)
    },
    showDownloadDialog() {
      // 监听下载试卷
      let dfreeTime = 0
      this.$refs.downloadDialog.showDialog(dfreeTime)
    },
    onDownloadPaper(formData) {
      let parms = formData
      parms.paperIdEnc = this.payCurrPaper.paperIdEnc
      parms.source = this.payCurrPaper.source
      parms.downloadtype = 2
      let copyOffset = getElementXyHw(this.$refs.downloadDialog.getBodyEl())
      this.Bus.$emit('addCpFileDownLoad', {
        ...parms,
        copyOffset: copyOffset,
      })

      if (this.$refs.downloadDialog) {
        this.$refs.downloadDialog.hideDialog()
      }
    },
    // 获取试卷列表数据
    getPaperList() {
      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        paperSource: this.paperSource, // 1:组卷下载 2：试卷下载
        beginTime: this.timeData.timeBegin ? this.returnChangeTime(this.timeData.timeBegin) : '',
        endTime: this.timeData.timeEnd ? this.returnChangeTime(this.timeData.timeEnd) : '',
        pageNum: this.pageData.currPage,
        pageSize: this.pageData.pageSize,
      }
      this.apiGet({ urlPath: '/paper-builder/personal/getPaperDownload' }, parms).then(res => {
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
    // 分页
    handleCurrentChange(currPage) {
      this.pageData.currPage = currPage
      this.pageData.list = []
      this.getPaperList()
    },
    // 选择时间
    OnSelectTime(currVal) {
      this.timeData = currVal
      this.pageData.currPage = 1
      this.getPaperList()
    },
    OnSelectType(val) {
      this.paperSource = val.code
      this.pageData.currPage = 1
      this.getPaperList()
    },
  },
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
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

.general-custom {
  display: inline-block;
  width: 70px;
  height: 24px;
  line-height: 24px;
  background: #487FFF;
  border-radius: 12px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #ffffff;
  text-align: center;
  margin: 0 20px 0 30px;
}

.el-pagination {
  padding: 4px 5px 0;
}

.user-content-right .item-content {
  padding: 30px 20px 20px;
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
