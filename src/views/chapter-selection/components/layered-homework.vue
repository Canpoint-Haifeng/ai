<template>
  <div>
    <div v-if="initPaperData">
      <div class="layered-tabs">
        <layered-block-item
          v-for="item in tabsList"
          :key="item.code"
          :node="item"
          :current-code="currentCode"
          @select-item="selectItem"
        />
      </div>
      <div v-if="currentCode">
        <div v-if="paperData.list.length">
          <div class="layered-paper-list">
            <div
              class="paper-list-content"
              :class="paperData.totalCount > 6 ? 'unfitted' : ''"
            >
              <div class="paper-list-body">
                <div class="paper-list-panel">
                  <div
                    v-for="item in paperData.list"
                    :key="item.paperId"
                    class="paper-list-item"
                    @click="selectCurrentPaper(item)"
                  >
                    <div
                      class="paper-name"
                      :class="currentPaperId === item.paperId ? 'activate' : ''"
                      v-html="item.latexPaperName || item.paperName"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="paperData.totalCount > 6"
              class="paper-list-control"
            >
              <div class="control-item">
                <span
                  class="el-icon-arrow-up"
                  :class="paperData.currPage > 1 ? 'activate' : 'disable'"
                  @click="prePage"
                />
              </div>
              <div class="control-item">
                <span
                  class="el-icon-arrow-down"
                  :class="
                    paperData.currPage < paperData.totalPage
                      ? 'activate'
                      : 'disable'
                  "
                  @click="nextPage"
                />
              </div>
            </div>
          </div>
          <div class="layered-paper-segment min-height750">
            <homework-paper-detail
              v-if="paperItem"
              :paper-item="paperItem"
            />
          </div>
        </div>
        <div
          v-else
          class="block-layered-content"
        >
          <noresult-common text="很遗憾，没有找到您要的试卷" />
        </div>
      </div>
      <div v-else>
        <item-two
          :teach-current-code="teachCurrentCode"
          :volume-current-code="volumeCurrentCode"
          :version-grade-code="gradeCurrentCode"
          :check-node-code-level="checkNodeCodeLevel"
          :check-node-code="checkNodeCode"
        />
      </div>
    </div>
    <div
      v-else
      class="loading-segment"
    >
      <CpLoading />
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
  import CTS from '@/common/js/constant'
  import { mapState } from 'vuex'
  import { API } from '@/api/config'
  import HomeworkPaperDetail from './homework-paper-detail'
  import layeredBlockItem from './layered-block-item'
  import ItemTwo from '../two-selection'
  import { CpLoading } from '@/components/CpFan/index'
  import NoresultCommon from '@/components/Noresult/Noresult-common'
  export default {
    components: {
      HomeworkPaperDetail,
      layeredBlockItem,
      ItemTwo,
      CpLoading,
      NoresultCommon,
    },
    computed: {
      ...mapState(['currSubject']),
      currentPaperId() {
        if (this.paperItem) {
          return this.paperItem.paperId
        } else {
          return ''
        }
      },
    },
    props: {
      teachCurrentCode: String,
      volumeCurrentCode: String,
      checkNodeCode: String, // 获取章节
      checkNodeCodeLevel: String,
      versionGradeCode: String,
    },
    watch: {
      volumeCurrentCode(val, old) {
        this.paperData.currPage = 1
        this.getPaperList(true) // 监听章节选择变化
      },
      checkNodeCode(v) {
        if (v) {
          this.paperData.currPage = 1
          this.getPaperList(true) // 监听章节选择变化
        }
      },
    },
    data() {
      return {
        tabsList: [
          {
            code: '',
            name: '更多',
            tips: '选自全品教辅，夯实基础',
          },
        ],
        currSort: 1,
        paperData: {
          pageSize: 6,
          currPage: 1,
          totalPage: 0,
          totalCount: 0,
          list: [],
        },
        paperItem: null,
        currentCode: '',
        initPaperData: false,
        currentPage: 0,
      }
    },
    mounted() {
      this.getDivideList()
    },
    methods: {
      prePage() {
        this.paperData.currPage -= 1
        this.getPaperList(false)
      },
      nextPage() {
        this.paperData.currPage += 1
        this.getPaperList(false)
      },
      selectItem(item) {
        this.currentCode = item.code
        this.paperData.currPage = 1
        this.getPaperList(true)
      },
      // 获取 分层 属性
      async getDivideList() {
        let res = await this.$store.dispatch('getDictValByCode', {
          vm: this,
          cid: 100464,
          code: this.currSubject.periodCode,
        })

        if (res && res.children) {
          let list = []
          res.children.forEach((item) => {
            let codeType = (item.code + '').substring(2, 4)
            list.push({
              code: item.code,
              name: item.name,
              codeType: codeType,
              tips: this.getDivideTips(codeType),
            })
          })
          list.push({ code: '', name: '更多', tips: '选自全品教辅，夯实基础' })
          this.currentCode = list[0].code
          this.tabsList = list
          this.getPaperList(true)
        }

        if (!this.currentCode) {
          this.initPaperData = true
        }
      },
      selectCurrentPaper(item) {
        this.paperItem = item
      },
      getPaperList(selectItem = false) {
        if (!this.checkNodeCode || !this.currentCode) return
        let parms = {
          period: this.currSubject.periodCode,
          subjectCode: this.currSubject.subjectCode,
          paperName: '',
          version: this.teachCurrentCode ? this.teachCurrentCode : '',
          chapterLevel: this.checkNodeCodeLevel ? this.checkNodeCodeLevel : '',
          chapterCode: this.checkNodeCode ? this.checkNodeCode : '',
          layeredLevels: this.currentCode,
          sort: this.currSort, // 排序
          currPage: this.paperData.currPage, // 当前试卷页数
          pageSize: this.paperData.pageSize, // 当前试卷每页条数
        }

        if (this.currSubject.periodCode == '13') {
          parms.grade = this.versionGradeCode || ''
        } else {
          parms.volume = this.volumeCurrentCode || ''
          parms.grade = this.versionGradeCode || ''
        }

        this.apiGet(API.MANAGE_PAPER_TONG_LIST, parms).then(
          (res) => {
            this.initPaperData = true
            if (res.code === CTS.constant.SUCCESS_CODE) {
              if (res.data) {
                if (res.data.list) {
                  let list = res.data.list.map((item) => {
                    item.source = 2
                    return item
                  })
                  res.data.list = list
                }
                this.paperData = res.data
                if (selectItem) {
                  if (
                    this.paperData &&
                    this.paperData.list &&
                    this.paperData.list.length
                  ) {
                    this.paperItem = this.paperData.list[0]
                  } else {
                    this.paperItem = null
                  }
                }
              }
            }
          },
          () => {
            this.initPaperData = true
          },
        )
      },
      getDivideTips(codeType) {
        let tispName = {
          11: '加深记忆，掌握新知',
          12: '强化理解，培养能力',
          13: '激活思维，提升素养',
        }
        return tispName[codeType] || ''
      },
    },
  }
</script>

<style scoped lang="scss">
  @use "@/assets/css/variables" as *;
  .layered-tabs {
    display: flex;
    justify-content: space-between;
    padding-bottom: 16px;
  }

  .layered-paper-list {
    display: flex;
    background-color: white;
    margin-bottom: 16px;
    .paper-list-content {
      padding: 16px 0px 0px 20px;
      min-height: 62px;
      box-sizing: border-box;
      flex: 1;
      width: 840px;
      overflow: hidden;
      &.unfitted {
        width: 875px;
        min-height: 108px;
      }
    }
    .paper-list-control {
      width: 74px;
      padding: 20px 0;
      box-sizing: border-box;
      min-height: 108px;
      background-color: #f6f6f6;

      display: flex;
      justify-content: space-between;
      flex-direction: column;

      .control-item {
        text-align: center;
      }
      span {
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 12px;
        background-color: #d6d6d6;
        display: inline-block;
        line-height: 24px;
        text-align: center;
        cursor: pointer;
        user-select: none;
      }
      .activate {
        background-color: $color-theme;
      }
      .disable {
        pointer-events: none;
      }
    }
  }
  .layered-paper-segment {
    background-color: white;
    margin-bottom: 20px;
  }

  .paper-list-body {
    .paper-list-panel {
      .paper-list-item {
        display: inline-block;
        height: 30px;
        margin-right: 16px;
        margin-bottom: 16px;
        .paper-name {
          overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
          padding: 0 10px;
          max-width: 259px;
          line-height: 28px;
          border-radius: 4px;
          background: #fafcfe;
          border: 1px solid #e2eaf2;
          color: #6a7585;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          cursor: pointer;

          &.activate {
            border: 1px solid $color-theme;
            background: #eff5fe;
            color: $color-theme;
          }
        }
      }
    }
  }

  .paper-list-content.unfitted
    .paper-list-body
    .paper-list-panel
    .paper-list-item
    .paper-name {
    max-width: 235px;
  }
  .loading-segment {
    padding: 50px;
    background-color: white;
    height: 900px;
  }
  .block-layered-content {
    background-color: white;
    height: 800px;
  }
</style>
