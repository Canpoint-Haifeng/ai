import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue'
<template>
  <li class="paper-item">
    <div class="paper-info">
      <div class="info-left color-9 font-12">
        <h3
          class="paper-title color-3"
          @click="checkPaperDetail(paperItem)"
          v-html="paperItem.paperName || paperItem.name ? paperItem.paperName || paperItem.name : '2023年湖北省-鄂州市九年级中考真题初中-数学人教版'"
        />
        <div>
          <span class="item">{{ paperItem.provinceName || '课堂例题' }}</span>
          <span class="item">浏览 <em
            v-if="paperItem.totalCountView"
            class="text"
          >{{ paperItem.totalCountView }}</em>
            <em
              v-else
              class="text"
            >0</em></span>
          <span class="item">题量 <em
            v-if="paperItem.questionNum"
            class="text"
          >{{ paperItem.questionNum }}</em>
            <em
              v-else
              class="text"
            >0</em></span>
          <!-- <span class="item">{{ paperItem.timeModified | datetime('YYYY/MM/DD') }}更新</span> -->
        </div>
      </div>
      <div class="paper-operate">
        <span
          :class="{ 'operate-item': true, 'gray': paperItem.downLoad }"
          @click.stop="DownLoadPaper(paperItem)"
        >
          <i class="icon iconfont icon-plus-download" />
          <div class="t">下载</div>
        </span>
        <span
          class="operate-item"
          @click.stop="showAnalysisDialog(paperItem)"
        >
          <i class="icon iconfont icon-analysis" />
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
            :class="{
              'icon iconfont icon-quxiaoshoucang': (
                paperItem.isCollect === 1
              ),
              'icon iconfont icon-nobg-star':
                paperItem.isCollect !== 1,
            }"
          />
          <div class="t">
            {{ paperItem.isCollect === 1 ? '取消收藏' : '收藏' }}
          </div>
        </span>
      </div>
    </div>
    <!-- <div class="make-by-canpoint" v-if="showMakeByCanpoint">
      <img :src="makeByCanpoint" alt="" />
    </div> -->
  </li>
</template>

<script>
import makeByCanpointImg from '@/assets/images/make_by_canpoint.png'


export default defineComponent({
  name: 'PaperItem',
  props: {
    paperItem: {
      type: Object,
      require: true,
      default: () => { })

    return {
    })

    return {
    userGuid: Number,
    isAddBook: {
      type: Boolean,
      default: false,
    })

    return {
    showPaperView: {
      type: Boolean,
      default: false,
    })

    return {
  })

    return {
  emits: ['onShowCollectDialog', 'showAddBookDialog', 'onShowDownLoadPaper', 'checkPaperDetail', 'showAnalysisDialog'],
  setup(props, { emit }) {
    const makeByCanpoint = ref(makeByCanpointImg)
    
    const showMakeByCanpoint = computed(() => {
      if (props.paperItem.source == 2 && props.paperItem.period == '11') {
        return true
      } else {
        return false
      }
    })
    
    const showCollectDialog = (item) => {
      let params = Object.assign({})

    return { item)
      params.status = item.isCollect === 1 ? 2 : 1
      emit('onShowCollectDialog', params)
    }
    
    // 显示 添加到图书的dialog
    const showAddBookDialog = (paperItem) => {
      emit('showAddBookDialog', paperItem)
    }
    
    const DownLoadPaper = (paperItem) => {
      if (paperItem.downLoad) return
      emit('onShowDownLoadPaper', paperItem)
    }
    
    // 查看详情
    const checkPaperDetail = (paperItem) => {
      emit('checkPaperDetail', paperItem)
    }
    
    const showAnalysisDialog = (paperItem) => {
      emit('showAnalysisDialog', paperItem)
    }
    
    const state = reactive({
      makeByCanpoint,
      showMakeByCanpoint,
      showCollectDialog,
      showAddBookDialog,
      DownLoadPaper,
      checkPaperDetail,
      showAnalysisDialog
    }
  }
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
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
    display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
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
