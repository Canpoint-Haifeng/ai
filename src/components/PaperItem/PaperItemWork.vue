<template>
  <li class="paper-item">
    <div class="paper-info">
      <div class="info-left color-9 font-12">
        <h3
          class="paper-title color-3"
          @click="checkPaperDetail(paperItem)"
          v-html="
            paperItem.latexPaperName ||
              paperItem.paperName ||
              paperItem.paperIdEnc
          "
        />
        <div>
          <span
            v-if="paperItem.typeName"
            class="item"
          ><em v-if="paperItem.typeName">{{ paperItem.typeName }}</em><em v-else>--</em></span>
          <span class="item">浏览<em
            v-if="paperItem.totalCountView"
            class="text"
          >{{ paperItem.totalCountView }}次</em><em
            v-else
            class="text"
          >0</em></span>
          <span class="item">题量<em
            v-if="paperItem.totalCount"
            class="text"
          >{{
            paperItem.totalCount
          }}</em><em
            v-else
            class="text"
          >0</em></span>
          <span class="item">{{ datetime(paperItem.timeModified, 'YYYY/MM/DD') }}更新</span>
        </div>
      </div>
      <div class="paper-operate">
        <span
          v-show="showPaperView"
          class="operate-item"
          @click.stop="checkPaperDetail(paperItem)"
        >
          <i class="iconfont iconyulan1" />
          <div class="t">预览</div>
        </span>
        <span
          v-show="isAddBook"
          class="operate-item"
          @click.stop="showAddBookDialog(paperItem)"
        >
          <i class="iconfont iconsoutibaowangyeUIshijueyuansu-28" />
          <div class="t">添加到图书</div>
        </span>
        <span
          class="operate-item"
          @click.stop="DownLoadPaper(paperItem)"
        >
          <i class="iconfont iconsoutibaowangyeUIshijueyuansu-15" />
          <div class="t">下载</div>
        </span>

        <span
          class="operate-item"
          @click.stop="showAnalysisDialog(paperItem)"
        >
          <i class="iconfont iconsoutibaowangyeUIshijueyuansu-18" />
          <div class="t">分析</div>
        </span>
        <span
          v-if="
            !userGuid ||
              !(
                paperItem.createGuid == userGuid ||
                paperItem.creatorGuid == userGuid
              )
          "
          class="operate-item"
          @click.stop="showCollectDialog(paperItem)"
        >
          <i
            class="iconfont"
            :class="{
              'iconsoutibaowangyeUIshijueyuansu-16': !(
                paperItem.isCollected === 1
              ),
              'iconsoutibaowangyeUIshijueyuansu-20':
                paperItem.isCollected === 1,
            }"
          />
          <div class="t">
            {{ paperItem.isCollected === 1 ? '取消收藏' : '收藏' }}
          </div>
        </span>
      </div>
    </div>
    <div
      v-if="showMakeByCanpoint"
      class="make-by-canpoint"
    >
      <img
        :src="makeByCanpoint"
        alt=""
      >
    </div>
  </li>
</template>

<script>
  import { computed } from 'vue'
  
  export default {
    props: {
      paperItem: {
        type: Object,
        require: true,
        default: () => {},
      },
      userGuid: Number,
      isAddBook: {
        type: Boolean,
        default: false,
      },
      showPaperView: {
        type: Boolean,
        default: false,
      },
    },
    setup(props, { emit }) {
      const datetime = (date, format) => {
        // Implementation of datetime filter
        if (!date) return '';
        // Simple implementation - in a real app, use a date library like dayjs
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        
        if (format === 'YYYY/MM/DD') {
          return `${year}/${month}/${day}`;
        } else if (format === 'YYYY-MM-DD') {
          return `${year}-${month}-${day}`;
        }
        return date;
      };
      
      // Import image
      const makeByCanpoint = require('@/assets/images/make_by_canpoint.png');
      
      // Computed properties
      const showMakeByCanpoint = computed(() => {
        if (props.paperItem.source == 2 && props.paperItem.period == '11') {
          return true;
        } else {
          return false;
        }
      });
      
      // Methods
      const showCollectDialog = (item) => {
        let params = Object.assign({}, item);
        params.status = item.isCollected === 1 ? 0 : 1;
        emit('onShowCollectDialog', params);
      };
      
      const showAddBookDialog = (paperItem) => {
        emit('showAddBookDialog', paperItem);
      };
      
      const DownLoadPaper = (paperItem) => {
        emit('onShowDownLoadPaper', paperItem);
      };
      
      const checkPaperDetail = (paperItem) => {
        emit('checkPaperDetail', paperItem);
      };
      
      const showAnalysisDialog = (paperItem) => {
        emit('showAnalysisDialog', paperItem);
      };
      
      return {
        datetime,
        makeByCanpoint,
        showMakeByCanpoint,
        showCollectDialog,
        showAddBookDialog,
        DownLoadPaper,
        checkPaperDetail,
        showAnalysisDialog
      };
    },
  }
</script>

<style lang="scss" scoped>
  .paper-item {
    min-height: 108px;
    padding: 24px 20px 14px 20px;
    border: 1px solid $color-border;
    box-sizing: border-box;
    border-radius: 6px;
    margin-bottom: 16px;
    position: relative;
    &:hover {
      box-shadow: 0px 0px 10px 0px rgba(42, 77, 138, 0.2);
    }
    .paper-title {
      display: inline-block;
      margin-bottom: 26px;
      max-width: 500px;
      line-height: 20px;
      cursor: pointer;
      font-size: $font-size-medium;
      font-weight: 400;
      transition: 0.2s;
      overflow: hidden;
      &:hover {
        color: $color-theme;
      }
    }
    .paper-info {
      @include flex();
      justify-content: space-between;
      .info-left {
        width: 450px;
        .item {
          display: inline-block;
          margin-right: 10px;
          color: #666666;
          background: #f0f0f0;
          border-radius: 4px;
          padding: 3px 5px;
          margin-bottom: 10px;
          .text {
            color: #ff7e3d;
          }
        }
      }
      .paper-operate {
        .operate-item.gray {
          color: #999999;
          & > i {
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
          & > i {
            background: #487FFF22;
            border-radius: 10px;
            padding: 10px;
            font-size: 30px;
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
      }
    }
  }
  .make-by-canpoint {
    position: absolute;
    top: -6px;
    right: -8px;
    img {
      width: 61px;
      height: 26px;
    }
  }
</style>
