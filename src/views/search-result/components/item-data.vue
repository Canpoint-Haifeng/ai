<template>
  <li class="paper-item">
    <div class="paper-info">
      <div
        class="info-left color-9 font-12"
        @click="checkPaperDetail(paperItem)"
      >
        <div class="types">
          <img
            src="../img/tb.png"
            alt=""
          >
          <span>教案</span>
        </div>
        <div class="middle">
          <h3 class="paper-title color-3">
            {{ paperItem.name }}
          </h3>
          <span
            :style="{
              width: '52px',
              height: '20px',
              textAlign: 'center',
              lineHeight: '20px',
              color: suitType[paperItem.suitType - 1].color,
              backgroundColor: suitType[paperItem.suitType - 1].bg,
            }"
          >{{
            suitType[paperItem.suitType - 1].name
          }}</span>
          <div>
            <span
              class="item"
              style="color: #8491A5;"
            >{{ paperItem.createTime |
              datetime('YYYY/MM/DD HH:mm:ss') }}</span>
            <span class="item"><em
                                 v-if="paperItem.previewNum"
                                 class="text"
                               >{{ paperItem.previewNum }}</em>
              <em
                v-else
                class="text"
              >0</em> 浏览</span>
            <span class="item"><em
                                 v-if="paperItem.usedNum"
                                 class="text"
                               >{{ paperItem.usedNum }}</em>
              <em
                v-else
                class="text"
              >0</em> 使用</span>
            <span class="item"><em
                                 v-if="paperItem.collectNum"
                                 class="text"
                               >{{ paperItem.collectNum }}</em>
              <em
                v-else
                class="text"
              >0</em> 收藏</span>
            <span class="item"><em
                                 v-if="paperItem.downNum"
                                 class="text"
                               >{{ paperItem.downNum }}</em>
              <em
                v-else
                class="text"
              >0</em> 下载</span>
            <span class="item"><em
                                 v-if="paperItem.likeNum"
                                 class="text"
                               >{{ paperItem.likeNum }}</em>
              <em
                v-else
                class="text"
              >0</em> 点赞</span>
          </div>
        </div>
      </div>
      <div class="paper-operate">
        <span
          :class="{ 'operate-item': true, 'gray': paperItem.downLoad }"
          @click.stop="showDownloadDialog(paperItem)"
        >
          <i class="icon iconfont icon-download_2_line" />
          <div class="t">下载</div>
        </span>
        <span
          class="operate-item"
          @click.stop="startPaper(paperItem)"
        >
          <i class="icon iconfont icon-document_2_line" />
          <div class="t">开始备课</div>
        </span>
      </div>
    </div>
  </li>
</template>
<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
export default {
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
        subjectCode: [String, Number],
        isShowPaper: {
            type: Boolean,
            default: false,
        },
        isChapter: {
            type: Number
        }
    },
    data() {
        return {
            suitType: [
                { name: '基础课', bg: 'rgba(69, 216, 55, 0.10)', color: '#45D837' },
                { name: '标准课', bg: 'rgba(72, 127, 255, 0.10)', color: '#487FFF' },
                { name: '拔高课', bg: 'rgba(255, 105, 0, 0.10)', color: '#FF6900' }
            ],
        }
    },
    created() {
    },
    methods: {
        startPaper(paperItem) {
            const params = {
                lessonInfoId: paperItem.id,
                lessonType: paperItem.lessonType,
            }
            this.apiPost({ urlPath: '/lesson-app/lessonPreparation/copyLesson' }, params).then((res) => {
                if (res.code == 200) {
                    this.$router.push({
                        path: '/teachingPlanEdit',
                        query: {
                            id: res.data,
                            type: paperItem.lessonType,
                            source: 2
                        }
                    })
                } else {
                    this.$message.error(res.msg)
                }
            })
        },
        // 显示下载提示框
        showDownloadDialog(paperItem) {
            if (paperItem.downLoad) return
            this.$emit('showDownloadDialog', paperItem)
        },
        // 查看详情
        checkPaperDetail(paperItem) {
            this.$emit('checkPaperDetail', paperItem)
        },
    },
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.paper-item {
    // width: 874px;
    padding: 20px 20px;
    border: 1px solid transparent;
    border-bottom: 1px solid $color-border;
    box-sizing: border-box;
    //border-radius: 6px;
    margin-bottom: 20px;
    position: relative;

    &:hover {
        border: 1px solid #487FFF;
        border-radius: 6px;

        .delete-item {
            position: absolute;
            color: $color-theme-l;
            font-size: 16px;
            top: 0;
            right: 0;
            display: none;
        }
    }

    .paper-info {
        display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
        justify-content: space-between;

        .info-left {
            display: flex;
            cursor: pointer;

            .types {
                width: 59px;
                height: 72px;
                position: relative;
                margin-right: 20px;

                img {
                    width: 59px;
                    height: 72px;
                    background-image: cover;
                }

                span {
                    position: absolute;
                    left: 16px;
                    top: 42px;
                    color: #fff;
                    font-size: 10px;
                }
            }

            .middle {
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .paper-title {
                    display: inline-block;
                    max-width: 450px;
                    line-height: 20px;
                    font-size: $font-size-medium;
                    font-weight: normal;
                    transition: 0.2s;

                    &:hover {
                        color: $color-theme;
                    }
                }

                .item {
                    margin-right: 10px;
                    color: #666666;
                    border-radius: 4px;

                    .text {
                        color: #ff7e3d;
                    }
                }
            }

            .type {

                span {
                    //background: rgba(72, 127, 255, 0.1);
                    border-radius: 2px 2px 2px 2px;
                    border-radius: 4px;
                    padding: 3px 5px;
                    color: #487FFF;
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