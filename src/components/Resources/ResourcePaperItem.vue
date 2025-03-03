<template>
  <li
    class="paper-item"
    :class="{ deleteStyle: isDeleteStatus }"
  >
    <div
      class="paper-info"
      @click="paperEdit(paperItem)"
    >
      <div class="info-left color-9 font-12">
        <h3 class="paper-title color-3">
          {{ paperItem.fileName }}
        </h3>
        <div>
          <span class="item">题量 <em class="text">{{ paperItem.quesCount || '-' }}</em></span>
          <span class="item">{{ formatDate(paperItem.createTime, 'YYYY/MM/D') }}上传</span>
        </div>
        <!--<span class="item" v-if="isMyPaper">学科：<em class="text">{{paperItem.subjectName}}</em></span>-->
      </div>
      <div class="paper-operate">
        <span
          v-if="paperItem.status == 20 || paperItem.status == 22"
          class="operate-item"
          @click.stop="eidtPaperDetail(paperItem)"
        >
          <i class="icon iconfont icon-huati" />
          <div class="t">划题标注</div>
        </span>
        <!-- v-if="(paperItem.paperType=='0'&&paperItem.status>=30)||paperItem.status==25||paperItem.status==15" -->
        <!-- <span class="operate-item"  @click.stop="deletePaper(paperItem)">
          <i class="iconfont iconshanchu"></i>
          <div class="t">删除试卷</div>
        </span> -->
        <span
          v-if="paperItem.status == 5 || paperItem.status == 0"
          class="operate-item"
        >
          <div class="space" />
          <div
            class="t"
            style="color: #999999"
          >
            {{ paperItem.status == 0 ? '待解析' : '待审核' }}
          </div>
        </span>
        <span
          v-if="paperItem.status == 10"
          class="operate-item"
        >
          <div class="space" />
          <div
            class="t"
            style="color: #999999"
          >解析中</div>
        </span>
        <span
          v-if="paperItem.status == 15"
          class="operate-item-lg"
        >
          试卷解析失败，请点击
          <span
            class="item-btn"
            style="color: #ff6e5d"
            @click="reParse(paperItem)"
          >重试</span>
          <!-- 或
          <span class="item-btn" style="color: #487FFF" @click="reuploadWord(paperItem)">重新上传</span> -->
        </span>
        <!-- <i class="delete-item iconfont iconshanchu1" v-if="isDeleteStatus" @click.stop="deletePaper(paperItem)"></i> -->

        <!-- <span class="operate-btn" @click="checkPaperDetail(paperItem.paperIdEnc)">查看</span>
        <span class="operate-btn" v-show="isMyPaper" @click="paperEdit(paperItem.paperIdEnc)">编辑</span> -->
        <!-- <span class="operate-btn detect" v-show="isMyPaper" @click="deletePaper(paperItem.paperIdEnc)">删除</span> -->
      </div>
    </div>
    <i
      class="icon iconfont icon-guanbi"
      @click.stop="deletePaper(paperItem)"
    />
  </li>
</template>

<script>
// paperType 0自用 1普通共享 2征集共享
// 试卷状态
// PAPER_STATUS_WAIT_RESOLVE("待解析",0),
// PAPER_STATUS_WAIT_CHECK("待审核",5),
// PAPER_STATUS_RESOLVING("解析中",10),
// PAPER_STATUS_RESOLVE_FAIL("解析失败",15),
// PAPER_STATUS_RESOLVE_SUCCESS("划题标注",20),//解析成功
// PAPER_STATUS_GROUP_QUESTIONS_SUCCESS("划题完成",22),
// PAPER_STATUS_LABEL_SUCCESS("标注完成",23),
// PAPER_STATUS_REJECT("退稿",25),
// PAPER_STATUS_COMPLETE("完成",30),

import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { API } from '@/api/config'
import { formatDate } from '@/common/js/util'

export default {
  name: 'ResourcePaperItem',
  props: {
    paperItem: {
      type: Object,
      require: true,
      default: () => { },
    },
    paperDetail: {
      type: Boolean,
      default: false,
    },
    isDownloadDialog: {
      type: Boolean,
      default: false,
    },
    isMyPaper: {
      type: Boolean,
      default: false,
    },
    isAddBook: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['reParse', 'reuploadWord', 'showDeleteDialog', 'showDownloadDialog', 'showShareDialog', 'showAddBookDialog'],
  setup(props, { emit }) {
    const store = useStore()
    const router = useRouter()
    
    // Computed properties
    const currSubject = computed(() => store.state.currSubject)
    
    const isDeleteStatus = computed(() => {
      if (
        props.paperItem.status >= 30 ||
        props.paperItem.status == 25 ||
        props.paperItem.status == 15 ||
        props.paperItem.status == 20 ||
        props.paperItem.status == 22
      ) {
        return true
      } else {
        return false
      }
    })
    
    // Methods
    const reParse = (paperItem) => {
      emit('reParse', paperItem)
    }
    
    const reuploadWord = (paperItem) => {
      emit('reuploadWord', paperItem)
    }
    
    // 删除组卷
    const deletePaper = (paperItem) => {
      emit('showDeleteDialog', paperItem)
    }
    
    const showDownloadDialog = (paperItem) => {
      emit('showDownloadDialog', paperItem)
    }
    
    const showShareDialog = (paperItem) => {
      emit('showShareDialog', paperItem)
    }
    
    // 显示 添加到图书的dialog
    const showAddBookDialog = (paperItem) => {
      emit('showAddBookDialog', paperItem)
    }
    
    // 试卷下载
    const downloadPaper = () => {
      let parms = {
        paperVersion: 'doc',
        paperSize: 'A4',
        paperType: 'normal',
        paperId: props.paperItem.paperId,
      }
      let set = {
        responseType: 'blob',
      }
      apiPost(API.MANAGE_PAPER_DOWNLOAD, parms, set).then((res) => {
        console.log('试卷下载成功')
      })
    }
    
    // 编辑
    const paperEdit = (paperItem) => {
      if (paperItem.status >= 30) {
        checkPaperDetail(paperItem)
      }
    }
    
    // 查看详情
    const checkPaperDetail = async (paperItem) => {
      let viewCount = paperItem.viewCount || paperItem.totalCountView || 0
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
      queryStr += '&subject=' + currSubject.value.subjectCode
      window.open(router.resolve('/paper/detail').href + queryStr)
    }
    
    const eidtPaperDetail = (row) => {
      if (row.status === 20) {
        router.push({ path: './editword', query: { id: row.id } })
      } else if (row.status === 22 && row.schoolPaperId) {
        router.push({
          path: './cuteques',
          query: { id: row.id, paperId: row.schoolPaperId },
        })
      }
    }
    
    return {
      currSubject,
      isDeleteStatus,
      reParse,
      reuploadWord,
      deletePaper,
      showDownloadDialog,
      showShareDialog,
      showAddBookDialog,
      downloadPaper,
      paperEdit,
      checkPaperDetail,
      eidtPaperDetail,
      formatDate
    }
  }
}
</script>

<style lang="scss" scoped>
.paper-item {
  min-height: 108px;
  padding: 24px 20px;
  border: 1px solid $color-border;
  box-sizing: border-box;
  border-radius: 6px;
  margin-bottom: 16px;
  position: relative;

  &:hover {
    box-shadow: 0px 0px 10px 0px rgba(42, 77, 138, 0.2);

    .delete-item {
      display: inline-block !important;
    }
  }

  .paper-title {
    width: 500px;
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
    @include flex();
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
          margin-left: 5px;
        }
      }
    }

    .paper-operate {
      .operate-item-lg {
        color: #999999;
        display: inline-block;
        padding-top: 40px;

        .item-btn {
          cursor: pointer;
        }
      }

      .operate-item.gray {
        color: #999999;

        &>i {
          background-color: #f2f2f0;
          color: #bababa;

          &:hover {
            color: #bababa;
          }
        }
      }

      .operate-item {
        text-align: center;
        color: $color-text-d;
        cursor: pointer;
        width: 65px;
        display: inline-block;

        &>i {
          background: #487FFF22;
          border-radius: 6px;
          padding: 8px;
          font-size: 24px;
          color: #487FFF;
          display: inline-block;

          &:hover {
            color: #3e73cd;
          }
        }

        .space {
          width: 40px;
          height: 40px;
          display: inline-block;
        }

        .t {
          font-size: 12px;
          padding-top: 7px;
          color: #666666;
          font-weight: normal;
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

  .icon-guanbi {
    position: absolute;
    color: $color-theme-l;
    font-size: 16px;
    top: 0;
    right: 0;
    display: none;
  }

  &:hover {
    .icon-guanbi {
      display: block;
    }
  }
}

.paper-item.deleteStyle {
  &:hover {
    border: 1px solid #487FFF;
    box-shadow: 0 0px 0px #ccc;

    .delete-item {
      display: inline-block !important;
    }
  }
}
</style>
