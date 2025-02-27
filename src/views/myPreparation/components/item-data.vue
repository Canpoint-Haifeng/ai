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
          <h3
            class="paper-title color-3"
            :title="paperItem.name"
          >
            {{ paperItem.name }}
          </h3>
          <span
            v-if=" paperItem.suitType"
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
            <span class="item">{{ paperItem.createTime | datetime('YYYY/MM/DD HH:mm:ss') }}</span>
            <span
              v-if="$route.query.type === '1'"
              class="item"
            >知识点 <em
              v-if="paperItem.totalCount"
              class="text"
            >{{ paperItem.totalCount
            }}</em>
              <em
                v-else
                class="text"
              >-</em></span>
          </div>
        </div>
      </div>
      <div class="paper-operate">
        <span
          v-show="currentIndex === '0'"
          class="operate-item"
          @click.stop="paperEdit(paperItem)"
        >
          <i class="icon iconfont icon-edit_line" />
          <div class="t">编辑</div>
        </span>
        <span
          v-show="currentIndex === '0'"
          class="operate-item"
          @click.stop="showContributeDialog(paperItem)"
        >
          <i class="icon iconfont icon-pencil_3_line" />
          <div class="t">投稿</div>
        </span>
        <span
          :class="{ 'operate-item': true, 'gray': paperItem.downLoad }"
          @click.stop="showDownloadDialog(paperItem)"
        >
          <i class="icon iconfont icon-download_2_line" />
          <div class="t">下载</div>
        </span>

        <span
          v-show="currentIndex === '0'"
          class="operate-item"
          @click.stop="deletePaper(paperItem)"
        >
          <i class="icon iconfont icon-delete_2_line" />
          <div class="t">删除</div>
        </span>
        <span
          v-show="currentIndex === '1'"
          class="operate-item"
          @click.stop="collectPaper(paperItem)"
        >
          <i class="icon iconfont icon-star_fill" />
          <div class="t"> 取消收藏 </div>
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
        currentIndex: {
            type: String,
            default: '0'
        },
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
        // 删除组卷
        deletePaper(paperItem) {
            this.$emit('showDeleteDialog', paperItem)
        },
        // 收藏组卷
        collectPaper(paperItem) {
            this.$emit('showcollectDialog', paperItem)
        },
        // 显示下载提示框
        showDownloadDialog(paperItem) {
            if (paperItem.downLoad) return
            this.$emit('showDownloadDialog', paperItem)
        },
        // 投稿
        showContributeDialog(paperItem) {
            this.$emit('showContributeDialog', paperItem)
        },
        // 编辑
        paperEdit(paperItem) {
            this.$emit('showEditPaperDialog', paperItem)
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
    width: 874px;
    padding: 20px 20px;
    border-bottom: 1px solid $color-border;
    box-sizing: border-box;
    border-radius: 6px;
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
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;

                    &:hover {
                        color: $color-theme;
                    }
                }
            }

            .item {
                font-weight: normal;
                font-size: 12px;
                color: #8491A5;
                margin-right: 16px;

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