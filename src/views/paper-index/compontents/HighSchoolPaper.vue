<template>
  <div>
    <div class="question-content">
      <!-- <div class="ques-left">
        <div class="ques-tit">
          <span class="tit">同步专题</span>
          <img src="@/assets/images/hot.svg" />
          <span class="more" @click="seeMore">
            更多
            <i class="el-icon-arrow-right"></i>
          </span>
          <span class="clearfix"></span>
        </div>
        <ul>
          <li>
            <span class="spot"></span>
            <p>
              <ellipsis-tooltip
                text="2021年春季】统编版语文二年级下册 同步字词基础训练级下册 同步字词基础级下册 同步字词基础（含答案"
              ></ellipsis-tooltip>
            </p>
            <span class="num">1213次</span>
          </li>
          <li>
            <span class="spot"></span>
            <p>
              <ellipsis-tooltip
                text="2021年春季】统编版语文二年级下册 同步字词基础训练"
              ></ellipsis-tooltip>
            </p>
            <span class="num">1213次</span>
          </li>
          <li>
            <span class="spot"></span>
            <p>
              <ellipsis-tooltip
                text="2021年春季】统编版语文二年级下册 同步字词基础训练"
              ></ellipsis-tooltip>
            </p>
            <span class="num">1213次</span>
          </li>
        </ul>
      </div> -->
      <div class="ques-right">
        <div class="ques-tit">
          <span class="tit">同步卷</span>
          <img src="@/assets/images/hot.svg">
          <span
            class="more"
            @click="seeMore"
          >
            更多
            <i class="el-icon-arrow-right" />
          </span>
          <span class="clearfix" />
        </div>
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
          text="暂无数据"
        />
      </div>
    </div>
    <div class="question-content">
      <!-- <div class="ques-left">
        <div class="ques-tit">
          <span class="tit">备考专题</span>
          <img src="@/assets/images/hot.svg" />
          <span class="more" @click="seeMore">
            更多
            <i class="el-icon-arrow-right"></i>
          </span>
          <span class="clearfix"></span>
        </div>
        <ul>
          <li>
            <span class="spot"></span>
            <p>
              <ellipsis-tooltip
                text="2021年春季】统编版语文二年级下册 同步字词基础训练级下册 同步字词基础级下册 同步字词基础（含答案"
              ></ellipsis-tooltip>
            </p>
            <span class="num">1213次</span>
          </li>
          <li>
            <span class="spot"></span>
            <p>
              <ellipsis-tooltip
                text="2021年春季】统编版语文二年级下册 同步字词基础训练"
              ></ellipsis-tooltip>
            </p>
            <span class="num">1213次</span>
          </li>
          <li>
            <span class="spot"></span>
            <p>
              <ellipsis-tooltip
                text="2021年春季】统编版语文二年级下册 同步字词基础训练"
              ></ellipsis-tooltip>
            </p>
            <span class="num">1213次</span>
          </li>
        </ul>
      </div> -->
      <div class="ques-right">
        <div class="ques-tit">
          <span class="tit">备考卷</span>
          <img src="@/assets/images/hot.svg">
          <span
            class="more"
            @click="seeMore"
          >
            更多
            <i class="el-icon-arrow-right" />
          </span>
          <span class="clearfix" />
        </div>
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
          text="暂无数据"
        />
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
  import { mapState } from 'vuex'
  import { ArrayExtentFind } from '@/common/js/util'
  import { paperIndexConfig } from '@/common/config/tikuCfg'
  export default {
    components: { EllipsisTooltip, NoresultCommon },
    computed: {
      ...mapState(['currSubject']),
    },
    data() {
      return {
        tbPaperList: [],
        bkPaperList: [],
      }
    },
    mounted() {
      this.searchPaperList()
    },
    methods: {
      // 更多
      seeMore() {
        this.$router.push('/paper/center')
      },
      // 点击查看
      seeDetail(paperItem) {
        this.$emit('seeDetail', paperItem)
      },
      // 获取试卷列表数据
      async searchPaperList() {
        let parms = {
          period: this.currSubject.periodCode,
          subjectCode: this.currSubject.subjectCode,
          pageSize: 10,
        }
        let typeItem = ArrayExtentFind(
          paperIndexConfig,
          'code',
          this.currSubject.subjectCode,
        )
        let tbtype = 13
        let bktype = 12
        if (typeItem) {
          tbtype = typeItem.sync_type
          bktype = typeItem.refer_type
        }

        // let tbPaperList = await this.apiGet(API.MANAGE_PAPER_LIST, {
        //   ...parms,
        //   type: tbtype,
        // })
        // let bkPaperList = await this.apiGet(API.MANAGE_PAPER_LIST, {
        //   ...parms,
        //   type: bktype,
        // })

        // this.tbPaperList = tbPaperList.data.list
        // this.bkPaperList = bkPaperList.data.list
      },
    },
  }
</script>

<style scoped lang="scss">
  @use "@/assets/css/variables" as *;
  .question-content {
    background: #fff;
    margin-top: 16px;
    display: flex;
    border-radius: 6px;
    padding-bottom: 6px;

    .ques-left {
      display: none;
    }

    .ques-left,
    .ques-right {
      width: 100%;

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

      ul {
        border-right: 1px solid #eeeeee;
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;

        li {
          display: flex;
          align-items: center;
          height: 40px;
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

    .ques-right {
      ul {
        border-right: none;
      }
    }
  }
</style>
