<template>
  <li class="paper-item">
    <div class="paper-info">
      <div class="info-left color-9 font-12">
        <h3 class="paper-title color-3">
          {{ paperItem.paperName }}
        </h3>
        <div>
          <span class="item">{{ paperItem.localName || '全国' }}</span>
          <span class="item">{{ paperItem.gradeName }}</span>
          <span class="item">{{ paperItem.createrTime | dateStrBig('YYYY/MM/DD') }}创建</span>
        </div>
      </div>
      <div class="paper-operate">
        <span
          class="operate-item"
          @click.stop="showDownloadDialog(paperItem)"
        >
          <i class="iconfont iconxiazai" />
          <div class="t">下载</div>
        </span>
        <!-- <span class="operate-item" @click.stop="showCopyPaperDialog(paperItem)">
          <i class="iconfont iconfuzhi" ></i>
          <div class="t">试卷复制</div>
        </span> -->
        <span
          v-show="isMyPaper"
          class="operate-item"
          @click.stop="paperEdit(paperItem)"
        >
          <i class="iconfont iconbianji" />
          <div class="t">使用细目表</div>
        </span>
        <!-- <span class="operate-item gray" v-if="paperItem.sharedStatus&&paperItem.paperIdEnc&&paperItem.canShared">
          <i class="iconfont iconfenxiang"></i>
          <div class="t">已分享</div>
        </span>
        <span class="operate-item" v-if="!paperItem.sharedStatus&&paperItem.paperIdEnc&&paperItem.canShared"  @click.stop="showShareDialog(paperItem)">
          <i class="iconfont iconfenxiang"></i>
          <div class="t">试卷分享</div>
        </span> -->
        <i
          v-show="isMyPaper"
          class="delete-item iconfont iconshanchu1"
          @click.stop="deletePaper(paperItem)"
        />
      </div>
    </div>
  </li>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
  // import { API } from '@/api/config'
  import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
    props: {
      paperItem: {
        type: Object,
        require: true,
        default: () => {})

    return {
      })

    return {
      paperDetail: {
        type: Boolean,
        default: false,
      })

    return {
      isDownloadDialog: {
        type: Boolean,
        default: false,
      })

    return {
      isMyPaper: {
        type: Boolean,
        default: false,
      })

    return {
    })

    return {
    created() {
      // console.log(this.isMyPaper, this.isDownloadDialog, 'isMyPaper')
    })

    return {
    methods: {
      // 删除组卷
      deletePaper(paperItem) {
        this.$emit('showDeleteDialog', paperItem)
      })

    return {
      // 试卷下载
      // downloadPaper() {
      //   let parms = {
      //     paperVersion: 'doc',
      //     paperSize: 'A4',
      //     paperType: 'normal',
      //     paperId: this.paperItem.paperId
      //   }
      //   let set = {
      //     responseType: 'blob'
      //   }
      //   this.apiPost(API.MANAGE_PAPER_DOWNLOAD, parms, set).then(res => {
      //     console.log('试卷下载成功')
      //   })
      // })

    return {
      // 显示下载试卷提示框
      showDownloadDialog(paperItem) {
        this.$emit('showDownloadDialog', paperItem)
      })

    return {
      // 试卷复制
      // showCopyPaperDialog(paperItem) {
      //   this.$emit('showCopyPaperDialog', paperItem)
      // })

    return {
      // 编辑
      paperEdit(paperItem) {
        this.$emit('showEditPaperDialog', paperItem)
      })

    return {
      showShareDialog(paperItem) {
        this.$emit('showShareDialog', paperItem)
      })

    return {
      // 查看详情
      checkPaperDetail(paperItem) {
        this.$router.push({
          name: 'paperView',
          query: {
            paperIdEnc: paperItem.paperIdEnc,
            source: paperItem.source,
          })

    return {
        })
      })

    return {
    })

    return {
  }
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
  .paper-item {
    min-height: 108px;
    padding: 26px 20px;
    border: 1px solid $color-border;
    box-sizing: border-box;
    border-radius: 6px;
    margin-bottom: 16px;
    position: relative;
    &:hover {
      border: 1px solid #487FFF;
      border-radius: 6px;
      .delete-item {
        display: inline-block !important;
      }
    }
    .paper-title {
      display: inline-block;
      max-width: 500px;
      line-height: 20px;
      margin-bottom: 26px;
      cursor: pointer;
      font-size: $font-size-medium;
      font-weight: 400;
      transition: 0.2s;
      &:hover {
        color: $color-theme;
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
          margin-right: 10px;
          color: #666666;
          background: #f0f0f0;
          border-radius: 4px;
          padding: 3px 5px;
          .text {
            color: #ff7e3d;
          }
        }
      }
      .paper-operate {
        // .operate-item.gray{
        //   color:#999999;
        //   &>i{
        //     background-color: #F2F2F0;
        //     color:#BABABA;
        //     &:hover{
        //       color:#BABABA;
        //     }
        //   }
        // }
        .operate-item {
          text-align: center;
          color: $color-text-d;
          cursor: pointer;
          width: 65px;
          display: inline-block;

          & > i {
            background: #487FFF22;
            border-radius: 10px;
            padding: 10px;
            font-size: 20px;
            color: #487FFF;
            display: inline-block;
            &:hover {
              color: #3e73cd;
            }
          }
          .t {
            font-size: 12px;
            padding-top: 8px;
          }
        }
        .operate-item:not(:last-child) {
          padding-right: 5px;
        }
        .delete-item {
          position: absolute;
          top: -10px;
          right: -10px;
          color: #ff6e5d;
          font-size: 20px;
          display: none;
          cursor: pointer;
        }
      }
    }
  }
</style>
