<template>
  <div>
    <div class="primary-question-content">
      <div class="ques-tit">
        <span class="tit">同步教案</span>
        <img src="@/assets/images/new.svg">
        <span
          class="more"
          @click="seeMore"
        >
          更多
          <i class="el-icon-arrow-right" />
        </span>
        <span class="clearfix" />
      </div>
      <div class="primary-segmenet">
        <div class="ques-left ques-sync">
          <div
            v-for="item in syncPaperPrimaryPapers"
            :key="item.id"
            class="ques-left-item"
            :class="{ active: item.id === currentSyncId }"
            @click="selectSyncPaper(item)"
          >
            <div class="item-name">
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="ques-right">
          <ul
            v-if="tbPaperList.length"
            :class="
              tbPaperList.length === 1 ||
                tbPaperList.length === 5 ||
                tbPaperList.length === 9
                ? 'even'
                : 'odd'
            "
          >
            <li
              v-for="item in tbPaperList"
              :key="item.paperId"
              @click="seeDetail(item)"
            >
              <span class="spot" />
              <p>
                <ellipsis-tooltip
                  :text="item.latexPaperName || item.paperName"
                />
              </p>
              <span class="num">{{
                item.timeModified | datetime('YYYY-MM-DD')
              }}</span>
            </li>
          </ul>
          <noresult-common
            v-else
            v-slot:empty
            :min-height="minHeight"
            text="暂无数据"
          />
        </div>
      </div>
    </div>

    <div class="primary-question-content">
      <div class="ques-tit">
        <span class="tit">专题备考</span>
        <img src="@/assets/images/new.svg">
        <span
          class="more"
          @click="seeMore"
        >
          更多
          <i class="el-icon-arrow-right" />
        </span>
        <span class="clearfix" />
      </div>
      <div class="primary-segmenet">
        <div class="ques-left ques-reference">
          <div
            v-for="item in studyPaperPrimaryPapers"
            :key="item.id"
            class="ques-left-item"
            :class="{ active: item.id === currentStudyId }"
            @click="selectStudyPaper(item)"
          >
            <div class="item-name">
              {{ item.name }}
            </div>
          </div>
        </div>
        <div class="ques-right">
          <ul
            v-if="bkPaperList.length"
            :class="
              bkPaperList.length === 1 ||
                bkPaperList.length === 5 ||
                bkPaperList.length === 9
                ? 'even'
                : 'odd'
            "
          >
            <li
              v-for="item in bkPaperList"
              :key="item.paperId"
              @click="seeDetail(item)"
            >
              <span class="spot" />
              <p>
                <ellipsis-tooltip
                  :text="item.latexPaperName || item.paperName"
                />
              </p>
              <span class="num">{{
                item.timeModified | datetime('YYYY-MM-DD')
              }}</span>
            </li>
          </ul>
          <noresult-common
            v-else
            v-slot:empty
            :min-height="minHeight"
            text="暂无数据"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
  import CTS from '@/common/js/constant'
  import { API } from '@/api/config'
  import EllipsisTooltip from '@/components/EllipsisTooltip/ellipsis-tooltip'
  import NoresultCommon from '@/components/Noresult/Noresult-common'
  import { paperPrimaryConfig } from '@/common/config/tikuCfg'
  import { mapState } from 'vuex'
  export default {
    components: { EllipsisTooltip, NoresultCommon },
    data() {
      return {
        minHeight: 275,
        tbPaperList: [],
        bkPaperList: [],
        syncPaperPrimaryPapers: [],
        studyPaperPrimaryPapers: [],
        currentSyncId: '',
        currentStudyId: '',
      }
    },
    computed: {
      ...mapState(['currSubject']),
    },
    watch: {
      currSubject() {
        this.initPageData()
      },
    },
    mounted() {
      this.initPageData()
    },
    methods: {
      async initPageData() {
        if (this.currSubject.subjectCode) {
          let syncPapers = []
          for (let item of paperPrimaryConfig) {
            if (item.type == 1 && item.period == this.currSubject.subjectCode) {
              syncPapers.push({ ...item, list: [], init: false })
            }
          }
          this.syncPaperPrimaryPapers = syncPapers

          syncPapers = []
          for (let item of paperPrimaryConfig) {
            if (item.type == 2 && item.period == this.currSubject.subjectCode) {
              syncPapers.push({ ...item, list: [], init: false })
            }
          }

          this.studyPaperPrimaryPapers = syncPapers
          await this.selectSyncPaper(this.syncPaperPrimaryPapers[0])
          this.selectStudyPaper(this.studyPaperPrimaryPapers[0])
        }
      },
      async selectSyncPaper(item) {
        if (!item) return
        let data = await this.getPapers(item)
        this.tbPaperList = data.list
        this.currentSyncId = item.id
      },
      async selectStudyPaper(item) {
        if (!item) return
        let data = await this.getPapers(item)
        this.bkPaperList = data.list
        this.currentStudyId = item.id
      },
      async getPapers(item) {
        if (item.init) {
          return item
        }
        try {
          let parms = {
            period: this.currSubject.periodCode,
            subjectCode: this.currSubject.subjectCode,
            pageSize: 12,
          }
          // let paperList = await this.apiGet(API.MANAGE_PAPER_LIST, {
          //   ...parms,
          //   type: item.code,
          // })
          // item.list = paperList.data.list || []
          // item.init = true
          return item
        } catch (e) {
          return item
        }
      },
      // 更多
      seeMore() {
        this.$router.push('/paper/center')
      },
      // 点击查看
      seeDetail(paperItem) {
        this.$emit('seeDetail', paperItem)
      },
    },
  }
</script>

<style scoped lang="scss">
  @use "@/assets/css/variables" as *;
  .primary-question-content {
    background: #fff;
    margin-top: 16px;
    border-radius: 6px;
    .ques-tit {
      height: 60px;
      line-height: 60px;
      border-bottom: 1px solid #eeeeee;
      .tit {
        font-size: 20px;
        font-weight: bold;
        color: #333333;
        padding-left: 28px;
      }

      img {
        width: 35px;
        position: relative;
        top: -8px;
        left: 15px;
      }

      .more {
        float: right;
        padding-right: 20px;
        font-size: 15px;
        color: $color-theme;
        cursor: pointer;
      }

      .more:hover {
        color: $color-theme-d;
      }

      .clearfix {
        clear: both;
      }
    }
  }

  .primary-segmenet {
    display: flex;
    .ques-sync {
      background-image: url('http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/31859eb3-b05f-4921-be4a-9cec1792cb62.png');
      background-size: 263px 276px;
      background-repeat: no-repeat;
    }
    .ques-reference {
      background-image: url('http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/fad5e982-8935-44cd-baea-58009ef69b8e.png');
      background-size: 263px 276px;
      background-repeat: no-repeat;
    }

    .ques-left {
      width: 263px;
      box-sizing: border-box;
      padding: 0 0 0 20px;
      .ques-left-item {
        position: relative;
        width: 243px;
        height: 46px;
        // padding-right: 20px;
        box-sizing: border-box;
        line-height: 45px;
        cursor: pointer;
        text-align: center;
        .item-name {
          line-height: 45px;
          margin-top: 8px;
          font-size: 16px;
          color: #333333;
        }

        &.active {
          &::before {
            content: '';
            background-image: url('../../../assets/images/index/index-paper-circle.png');
            background-size: 8px 8px;
            width: 8px;
            height: 8px;
            display: block;
            position: absolute;
            top: -8px;
            right: 0;
            transform: rotate(180deg);
          }
          &::after {
            content: '';
            background-image: url('../../../assets/images/index/index-paper-circle.png');
            background-size: 8px 8px;
            width: 8px;
            height: 8px;
            display: block;
            position: absolute;
            top: 45px;
            right: 0;
            transform: rotate(90deg);
          }
          .item-name {
            background: #ffffff;
            border-radius: 23px 0px 0px 23px;
            color: #487FFF;
          }
        }
      }
    }

    .ques-right {
      flex: 1;
      height: 275px;

      ul {
        border-right: 1px solid #eeeeee;
        margin-top: 9px;
        display: flex;
        flex-wrap: wrap;

        li {
          display: flex;
          align-items: center;
          height: 43px;
          background: #fff;
          width: 50%;
          background: #fafafa;
          cursor: pointer;
          box-sizing: border-box;

          // margin-bottom: 5px;
          .spot {
            display: inline-block;
            width: 4px;
            height: 4px;
            background: #a5bac5;
            margin-left: 18px;
            margin-right: 5px;
          }

          p {
            color: #333333;
            flex: 1;
            height: auto;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            line-height: 40px;
          }

          .num {
            padding-right: 20px;
            color: #666666;
          }
        }

        li:nth-child(1),
        li:nth-child(2),
        li:nth-child(5),
        li:nth-child(6),
        li:nth-child(9),
        li:nth-child(10) {
          background: #fafafa;
          border-right: 1px solid #eeeeee;
          // margin-right: 8px;
        }

        li:nth-child(3),
        li:nth-child(4),
        li:nth-child(7),
        li:nth-child(8) {
          background: #fff;
          border-right: 1px solid #eeeeee;
          // margin-left: 8px;
        }

        li:nth-child(even) {
          border-right: none;
        }

        li:hover {
          background-color: #f6fbff;

          p,
          .num {
            color: #487FFF;
          }

          .spot {
            background: #487FFF;
          }
        }
      }

      .even {
        background: #fafafa;
      }

      .odd {
        background: #fff;
      }
    }
  }
</style>
