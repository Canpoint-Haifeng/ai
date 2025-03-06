<template>
  <div class="content-container">
    <breadcrumb :crumbs-data="crumbsData" />
    <div class="tab">
      <div
        :class="{ active: isPaperMode }"
        @click="isPaperMode = true"
      >
        <section>
          <i class="iconfont icon-paper_fill" />
          <span>题型模式</span>
        </section>
      </div>
      <div
        :class="{ active: !isPaperMode }"
        @click="isPaperMode = false"
      >
        <section>
          <i class="iconfont icon-bulb_fill" />
          <span>知识点模式</span>
        </section>
      </div>
    </div>
    <div
      v-if="loadView"
      class="paper-container clearfix"
    >
      <div>
        <div
          class="paper-main fl"
          :class="!isPaperMode ? 'w-full' : ''"
        >
          <div>
            <!-- 默认显示 -->
            <KnowledgeView v-if="!isPaperMode" />
            <template v-else>
              <paper-seal />
              <!-- 试卷正文内容 -->
              <div
                ref="paperMakerquesRef"
                class="paper-content"
              >
                <!-- 试卷头部设置 -->
                <paper-header
                  :paper-data="paperData"
                  :question-types="questionTypes"
                />
                <!-- 试卷主题部分     操作栏的事件在这个页面抛出-->
                <paper-body
                  :paper-data="paperData"
                  :questions-data="questionsData"
                  :question-types="questionTypes"
                  @show-delete-dialog="onShowDeleteDialog"
                  @show-report-dialog="onShowReportDialog"
                  @refresh-paper="onRefreshPaper"
                  @refresh-paper-data="refreshPaperData"
                  @on-check-change-question="onCheckChangeQuestion"
                />
              </div>
              <!-- <question-recycle-bin
                ref="question-recycle-bin"
                @getPaperData="getPaperData"
              ></question-recycle-bin> -->
            </template>
            <!-- 装订线 -->

            <!-- <div class="paper-body-close-view paper_return">
              <div @click="returnLastPage">返回设置</div>
            </div>
            <div class="paper-body-close-view paperMode">
              <div @click="changeMode">
                <span v-if="isPaperMode">知识点模式 </span>
                <span v-else>试卷模式</span>
              </div>
            </div> -->
          </div>
        </div>
      </div>

      <div class="paper-side fl">
        <div class="paper-side-body">
          <div
            v-show="paperSideBodyBottom && isPaperMode"
            class="paper-side-body-bottom"
          >
            <span
              class="box-animation-iconfont iconfont iconxiangxiahua"
            />
          </div>
          <div
            ref="paperSideBodyRef"
            class="paper-side-body-box"
            @scroll="paperSideScoll"
          >
            <paper-operate
              :id="id"
              ref="paperOperateRef"
              :class="{ hide: !isPaperMode }"
              :paper-data="JSON.parse(JSON.stringify(paperData))"
              :simple-question-list-score="
                JSON.parse(JSON.stringify(simpleQuestionList))
              "
              :questions-data="questionsData"
              @refresh-paper="onRefreshPaper"
              @show-down-load-paper="onShowDownLoadPaper"
              @show-recommend-task="showRecommendTask"
              @show-answer-sheet="onShowAnswerSheet"
            />
            <paper-set
              v-show="isPaperMode"
              ref="paperSetRef"
              :paper-data="paperData"
            />
            <paper-edit
              v-show="isPaperMode"
              :paper-data="paperData"
              :questions-data="questionsData"
              @refresh-paper="onRefreshPaper"
              @refresh-paper-recycle="onResetPaperDateAndRecycle"
              @to-recycle="toRecycle"
              @refresh-paper-type="refreshPaperType"
              @refresh-paper-data="refreshPaperData"
            />
            <analysis
              v-if="!isPaperMode"
              ref="analysisRef"
              :paper-data="knowledgeData"
              @open-analysis-modal="openAnalysisModal"
            />
            <div ref="papersidebottom" />
          </div>
        </div>
      </div>
    </div>
    <!-- 下载组卷 -->
    <download-dialog
      ref="downloadDialog"
      :curr-paper="currPaper"
      @download-paper="onDownloadPaper"
    />
    <!-- 支付提示框 -->
    <pay-dialog
      v-if="payData.weChatQrcode"
      ref="payDialog"
      :pay-data="payData"
      @change-pay-type="onChangePayType"
      @balance-pay="onBalancePay"
      @entry-my-wallet="onEntryMyWallet"
      @close-pay-dialog="onClosePayDialog"
    />
    <!-- 纠错提示框 -->
    <report-dialog
      ref="reportDialog"
      @report-error="onReportError"
    />
    <base-dialog
      ref="deleteDialog"
      @comfirm="onDeleteBasket"
    >
      <template #dialogTips>
        <div class="dialog-tips">
          确认删除试题？
        </div>
      </template>
    </base-dialog>
    <collect-message
      ref="collectMessage"
      dialog-title="试题"
      collect-path="/paper/resources/collect?tabActiveName=QuesCollect"
    />
    <CpChangeSimailarDialog
      ref="changeSimailarDialog"
      @collect-question="onCollectQuestion"
      @check-question-detail="onCheckQuestionDetail"
      @show-report-dialog="onShowReportDialog"
      @change-question-box="changeQuestionBox"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import {
  question2AnswerSheet,
  getToken,
  ArrayExtentFind,
  ArrayExtentRemoveItem,
} from '@/common/js/util'
import { API } from '@/api/config'
import { mapState } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import PaperSeal from '@/views/paper-maker/paper-seal/paper-seal'
import PaperHeader from '@/views/paper-maker/paper-header/paper-header'
import PaperBody from './components/smart-paper-body'
import PaperOperate from './components/paper-operate.vue'
// import QuestionRecycleBin from '@/components/QuestionItem/question-recycle-bin'
import PaperSet from '@/views/paper-maker/paper-set/paper-set'
import PaperEdit from '@/views/paper-maker/paper-edit/paper-edit'
import BaseDialog from '@/components/BaseDialog/BaseDialog'
import CpChangeSimailarDialog from '@/components/CpFan/cp-change-simailar-dialog/index'

import paperMixin from '@/common/mixins/paperMixin'
import scrollIntoView from 'scroll-into-view'
import questionItemMixin from '@/common/mixins/questionItemMixin'
import windowScrollResetMixin from '@/common/mixins/windowScrollResetMixin'
import KnowledgeView from './KnowledgeView.vue'
import analysis from './components/analysis.vue'
import { decrypt } from '@/common/js/util'
import aaa from './a'
export default {
  components: {
    Breadcrumb,
    PaperHeader,
    PaperBody,
    PaperSeal,
    PaperOperate,
    // QuestionRecycleBin,
    PaperSet,
    PaperEdit,
    BaseDialog,
    CpChangeSimailarDialog,
    KnowledgeView,
    analysis,
  },
  mixins: [paperMixin, questionItemMixin, windowScrollResetMixin],
  provide() {
    return {
      context: this,
    }
  },
  setup() {
    const paperOperateRef = ref(null)
    const analysisRef = ref(null)
    const changeSimailarDialog = ref(null)
    const paperSideBodyRef = ref(null)
    const papersidebottom = ref(null)
    const paperSetRef = ref(null)
    
    const state = reactive({
      id: '',
      isPaperMode: true,
      loadView: true,
      paperData: {}, // 试卷信息
      questionsData: [], // 题目数据列表
      questionTypes: [], //
      knowledgeData: [],
      simpleQuestionList: [], // 右侧试题统计简易试题列表
      questionListOrder: [],
      questionId: 0, // 删除id
      source: null, // 删除试题来源
    })

    return {
      ...toRefs(state),
      paperOperateRef,
      analysisRef,
      changeSimailarDialog,
      paperSideBodyRef,
      papersidebottom,
      paperSetRef
    }
      crumbsData: [
        {
          path: '',
          isLink: false,
          text: '组卷中心',
        },
        {
          path: '',
          isLink: false,
          text: '组卷预览',
        },
      ],
      currPaper: {},
      showFixed: false,
      pageInnerHeight: 700,
      changeQuestionData: null, // 换一题 存储试题数据
      paperSideBodyBottom: false,
      changeType: 1,
      type: 1, // 1知识点，2章节，3专题
    }
  },
  watch: {
    questionsData() {
      this.$nextTick(() => {
        this.paperSideScoll()
      })
    },
  },
  computed: {
    ...mapState(['currSubject', 'userInfo']),
  },
  async created() {
    const type = sessionStorage.getItem('pathType')
    console.log(type)
    this.type = type
    await this.getKnowledgeData()
    // this.initWindowsEvent()
    // console.log(aaa)
    console.log(JSON.parse(decrypt(aaa)), 1111111)
  },
  mounted() {
    // this.getBookCategoryId(this.currSubject)
    // this.renderScrollFixed()
    window.addEventListener('beforeunload', this.saveId)
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', this.saveId)
    this.unmountedWindowsEvent()
  },
  methods: {
    openAnalysisModal() {
      paperOperateRef.value.showAnalysisDialog()
    },
    saveId() {
      sessionStorage.setItem('pageId', this.id)
    },
    async getKnowledgeData() {
      const id = sessionStorage.getItem('pageId')
      if (id) {
        this.id = id
        this.getPaperData()
        this.getInfo(id)
      } else {
        let params = sessionStorage.getItem('questionParams')
        if (params) {
          params = JSON.parse(params)
          // params.difficultyInfo = JSON.stringify(params.difficultyInfo)
          // // params.difficultInfo = JSON.stringify(params.difficultInfo)
          // // params.knowledgeInfo = JSON.stringify(params.knowledgeInfo)
          // params.quesTypeInfo = JSON.stringify(params.quesTypeInfo)
          // params.modeShowInfo = JSON.stringify(params.modeShowInfo)
          // if (params.type == 2) {
          //   params.chapterInfo = JSON.stringify(params.chapterInfo)
          // } else if (params.type == 1) {
          //   params.knowledgeInfo = JSON.stringify(params.knowledgeInfo)
          // } else {
          //   params.specialCatalogInfo = JSON.stringify(
          //     params.specialCatalogInfo,
          //   )
          // }
          const url =
            sessionStorage.advanced === '1'
              ? '/paper-builder/paper-generate/smart-generate/senior'
              : '/paper-builder/paper-generate/v2/smart-generate/normal'
          const res = await this.newPost({ urlPath: url }, params)
          if (res.code === CTS.constant.SUCCESS_CODE) {
            // const id = res.data
            this.id = res.data
            this.getPaperData()
            this.getInfo()
          } else {
            this.$message.error(res.msg)
          }
        }
      }
    },
    async getInfo(id) {
      let set = {
        showLoading: true,
        message: '加载中...',
      }
      const url = '/paper-builder/paper-generate/getKnowledgeModeQuestionList'
      const params = {
        id: this.id,
      }
      const res = await this.apiGet({ urlPath: url }, params, set)
      if (res.code === CTS.constant.SUCCESS_CODE) {
        // this.getPaperData()
        // let data = decrypt(res.data)
        document.body.click()
        let data = res.data
        if (data) {
          // data = JSON.parse(data)
          this.knowledgeData = data
          let num = 1
          this.knowledgeData.forEach(v => {
            if (v.knowledgeTags) {
              v.knowledgeTags = JSON.parse(v.knowledgeTags)
            }
            v.children &&
              v.children.forEach(c => {
                c.quesList = c.questionList
                c.quesList &&
                  c.quesList.forEach(x => {
                    x.questionNum = num++
                    x.showQuestionNum = true
                  })
              })
          })
          analysisRef.value &&
            analysisRef.value.initChart(state.knowledgeData)
        }
      } else {
        this.$message.error(res.msg)
      }
    },
    questionSort(data) {
      let num = 1
      data.forEach(v => {
        v.children.forEach(c => {
          c.quesList &&
            c.quesList.forEach(x => {
              x.questionNum = num++
            })
        })
      })
    },
    // 换题
    async questionChange(ques, type, newData, kCode) {
      console.log(ques, type, newData, kCode)
      // this.changeQuestionBox(newData)
      const url = '/paper-builder/paper-generate/question/change'
      const params = {
        quesChangeType: type,
        smartPaperDetailsId: this.id,
        originalQid: ques ? ques.questionId : '',
      }
      switch (type) {
        case 2:
          params.newQid = newData.questionId
          break
        case 4:
          params.newQid = newData.questionId
          params.originalKnowledge = kCode
          delete params.originalQid
          break
        case 5:
          params.originalKnowledge = ques
          params.newKnowledge = newData
          delete params.originalQid
          break
        case 6:
          delete params.originalQid
          params.originalKnowledge = ques
          break
        default:
      }
      const res = await this.apiPost({ urlPath: url }, params)
      if (res.code === CTS.constant.SUCCESS_CODE) {
        this.$message.success('操作成功!')
        this.$refs.changeSimailarDialog.hide()
        await this.getPaperData()
        await this.getInfo()
        if (type === 2) {
          this.$nextTick(() => {
            this.Bus.$emit('scrollToElement', params.newQid)
          })
        }
      } else {
        this.$message.error(res.msg)
      }
    },
    returnLastPage() {
      this.$router.back()
    },
    changeMode() {
      this.isPaperMode = !this.isPaperMode
    },
    async syncUploadFile(data) {
      let params = {
        fileName: this.paperData.paperName || this.paperData.paperHeadline,
        fileUrl: data.student,
        answerFileUrl: data.answer,
        userGuid: this.userInfo.userGuid,
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      let res = await this.wayGet(API.APPID_SYNCUPLOADFILE, params, {
        showLoading: true,
      }).then(
        res => {
          if (this.checkoutRes(res)) {
            return res.data
          } else {
            this.showMessage(res.msg)
            return null
          }
        },
        () => {
          this.showMessage('网络错误')
          return null
        },
      )
      if (res) {
        let url = `//cloudprint-teacher-console.canpoint.cn/#/set-task?resourceId=${
          res.resourceId
        }&resourceIdEnc=${res.resourceIdEnc}&title=${params.fileName}`
        this.openWindowLink(url)
      }
    },
    onSideMoveBottom() {
      let el = papersidebottom.value
      scrollIntoView(el, { time: 500, debug: true })
    },
    paperSideScoll(e) {
      let el = paperSideBodyRef.value
      if (el) {
        let offsetHeight = el.offsetHeight
        let scrollTop = el.scrollTop
        let scrollHeight = el.scrollHeight
        // console.log(offsetHeight, scrollTop, scrollHeight)
        if (offsetHeight + scrollTop >= scrollHeight) {
          // 隐藏滚动到底部
          this.paperSideBodyBottom = false
        } else {
          // 显示 滚动到底部
          this.paperSideBodyBottom = true
        }
      }
    },
    renderScrollFixed(e) {
      let comparisonTop = this.getPageScrollTop()
      let offsetTop =
        this.offsetDis(document.querySelector('.paper-side')).top - 50
      // console.log(offsetTop, comparisonTop)
      if (offsetTop > 0) {
        if (comparisonTop >= offsetTop) {
          this.showFixed = true
        } else {
          this.showFixed = false
        }
      }
      this.pageInnerHeight = Math.max(400, window.innerHeight - (70 + 140 + 20))
      this.paperSideScoll()
    },
    onShowDownLoadPaper(paperItem) {
      paperItem.showClearBasket = true
      this.currPaper = paperItem
      // this.queryOrder(paperItem)
      this.showDownloadDialog()
    },
    showRecommendTask(paperItem) {
      paperItem.showClearBasket = false
      paperItem.showRecommendTask = true
      this.currPaper = paperItem
      this.queryOrder(paperItem)
    },

    // 获取试卷信息数据
    async getPaperData() {
      let baseUrl = API.TEMP_PAPER_PREVIEW
      let parms = {
        // smartPaperDetailsId: this.id,
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      // if (this.$route.query && this.$route.query.paperInfoId) {
      //   parms.paperInfoId = this.$route.query.paperInfoId
      //   baseUrl = API.SCHOOL_PAPER_PRVIEW
      // }
      let set = {
        showLoading: true,
        message: '加载中...',
      }
      return this.apiGet(baseUrl, parms, set).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          const data = res.data
          // 矩阵变换
          data.totalScore = +data.totalScoreShow
          data.list.forEach(item => {
            item.score = +item.scoreShow
            item.list.forEach(subItem => {
              subItem.score = +subItem.scoreShow
              subItem.list.forEach(v => {
                v.score = +v.scoreShow
              })
            })
          })
          this.paperData = data
          this.renderPaperDataList(res.data.list)
          this.$nextTick(() => {
            paperSetRef.value.handlPaperData()
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    renderPaperDataList(arrList, initId = 1) {
      this.questionTypes = []
      let questionListOrder = {
        questionTypeOrderDtoList: [],
        questionOrderDtoList: [],
      }
      let indexId = initId
      let getIndexId = function() {
        return indexId++
      }
      let typeIndex = 0
      let questionNum = 0
      arrList.forEach((item, index) => {
        item.list.sort(this.sortNumber)
        item.id = getIndexId()
        item.makertype = 1
        item.groupName = {
          ordinal: item.ordinal,
          text: item.name,
          isShowInput: false,
          index: index,
          element: 'groupNameInput',
        }
        item.groupDesc = {
          ordinal: item.ordinal,
          text: item.desc,
          isShowInput: false,
          index: index,
          element: 'groupDescInput',
        }
        item.list.forEach((subItem, subIndex) => {
          subItem.list.sort(this.sortNumber)
          typeIndex = typeIndex + 1
          subItem.id = getIndexId()
          subItem.makertype = 2
          this.questionTypes.push(subItem.questionTypeName)
          questionListOrder.questionTypeOrderDtoList.push({
            type: subItem.questionType,
            ordinal: typeIndex,
          })
          subItem.typeIndex = typeIndex
          subItem.typesInfo = {
            text: subItem.questionTypeName,
            typeCode: subItem.questionType,
            isShowInput: false,
            index: typeIndex - 1,
            element: 'questionTypeInput',
          }
          subItem.pordinal = item.ordinal
          subItem.list.forEach(childItem => {
            questionNum = questionNum + 1
            childItem.id = getIndexId()
            childItem.makertype = 3
            childItem.questionNum = questionNum
            childItem.ordinal = questionNum
            childItem.showQuestionNum = true
            childItem.oldscore = childItem.score
            questionListOrder.questionOrderDtoList.push({
              questionId: childItem.questionId,
              ordinal: questionNum,
            })
          })
        })
      })
      this.simpleQuestionList = [...arrList[0].list, ...arrList[1].list]
      this.questionsData = arrList
      // this.paperData = { ...this.paperData, list: arrList }
      this.initQuestionOrder(questionListOrder)
      this.$nextTick(() => {
        this.onRenderJaxPage('paperMakerquesRef')
      })
    },
    // 排序函数
    sortNumber(order1, order2) {
      return order1.ordinal - order2.ordinal
    },
    // 更新试题排序
    initQuestionOrder(questionListOrder) {
      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        paramsJson: JSON.stringify(questionListOrder),
      }
      this.newPost(API.QUESTION_INIT_ORDER, parms).then(res => {
        if (res.code !== CTS.constant.SUCCESS_CODE) {
          // this.$message.error(res.msg)
        }
      })
    },
    // 监听刷新试卷信息数据
    onRefreshPaper() {
      this.getPaperData()
    },
    refreshPaperType(params) {
      let arrlist = JSON.parse(JSON.stringify(this.questionsData))
      let targetType = this.getQuestionTypeByPaperData(params.type, arrlist)
      if (!targetType) return
      let quesDict = this.getQuestionSort(params, 'type')
      let originPart = ArrayExtentFind(arrlist, 'ordinal', targetType.pordinal)
      if (!originPart) return
      if (params.isCross === 0) {
        originPart.list.forEach(item => {
          item.ordinal = quesDict[item.questionType] || 1
          item.pordinal = params.sectionId
        })
      } else {
        let targetPart = ArrayExtentFind(arrlist, 'ordinal', params.sectionId)
        if (!targetPart) return
        ArrayExtentRemoveItem(originPart.list, 'questionType', params.type)
        targetPart.list.push(targetType)
        originPart.list.forEach(item => {
          item.ordinal = quesDict[item.questionType] || 1
          item.pordinal = params.sectionId
        })
      }
      this.renderPaperDataList(arrlist)
    },
    refreshPaperData(params) {
      let arrlist = JSON.parse(JSON.stringify(this.questionsData))
      let targetType = this.getQuestionTypeByPaperData(
        params.crossType,
        arrlist,
      )
      if (!targetType) {
        console.error('targetType', targetType)
        return
      }
      let quesDict = this.getQuestionSort(params)
      if (params.isCross == 0) {
        // 没有跨题型 根据试题id 进行排序
        targetType.list.forEach(item => {
          item.ordinal = quesDict[item.questionId] || 1
        })

        // console.log(targetType.list, quesDict)
        // 重新排序刷新内存数据
      } else {
        // 有跨题型
        // 1、移除原有题型的 试题 并且返回
        let originType = this.getQuestionTypeByPaperData(params.type, arrlist)
        if (!originType) {
          console.error('没有找到该题型originType', params.type)
          return
        }
        let curremtItem = ArrayExtentRemoveItem(
          originType.list,
          'questionId',
          params.questionId,
        )

        if (originType.list.length == 0) {
          // 移除 题型
          let part = ArrayExtentFind(arrlist, 'ordinal', originType.pordinal)
          if (part && part.list) {
            ArrayExtentRemoveItem(part.list, 'questionType', params.type)
          }
        }
        if (!curremtItem) {
          console.error('没有找到该试题', originType)
          return
        }
        // 2、将试题放在 目标题型中
        targetType.list.push(curremtItem)
        // 3、排序
        targetType.list.forEach(item => {
          item.ordinal = quesDict[item.questionId] || 1
        })
      }
      console.log(arrlist)
      this.renderPaperDataList(arrlist)
    },
    getQuestionSort(params, key = 'questionId') {
      let list = JSON.parse(params.paramsJson)
      let dict = {}
      for (let item of list) {
        dict[item[key]] = item.ordinal
      }
      return dict
    },
    getQuestionTypeByPaperData(type, questionsData) {
      for (let part of questionsData) {
        if (part.list && part.list.length) {
          let el = part.list.find(item => {
            return item.questionType === type
          })
          if (el) {
            return el
          }
        }
      }
      return null
    },
    onCheckChangeQuestion({ questionItem, type }) {
      let qids = this.getQuestionList()
      this.changeQuestionData = {
        qid: questionItem.questionId,
        ordinal: questionItem.ordinal,
        type: type,
        source: questionItem.source,
      }
      changeSimailarDialog.value.show(questionItem, {
        stage: this.currSubject.periodCode,
        subjectCode: this.currSubject.subjectCode,
        excludeQids: qids.join(','),
      })
    },
    async changeQuestionBox(questionItem) {
      this.questionChange(
        { questionId: this.changeQuestionData.qid },
        2,
        questionItem.questionInfo,
      )
      return
      console.log(questionItem)
      questionItem.questionInfo = { ...questionItem }
      if (!(questionItem.questionInfo && questionItem.questionInfo.quesType)) {
        return
      }
      let params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        oldQuestionId: this.changeQuestionData.qid,
        oldType: this.changeQuestionData.type,
        oldSource: this.changeQuestionData.source,
        oldQuestionSort: this.changeQuestionData.ordinal,
        newQuestionId: questionItem.questionInfo.questionId,
        newSource: questionItem.source,
        newType: questionItem.questionInfo.quesType.code,
        newTypeName: questionItem.questionInfo.quesType.name,
      }

      let res = await this.newPost(API.PAPERMAKER_CHANGEONE, params, {
        showLoading: true,
      })
      if (res && res.code === CTS.constant.SUCCESS_CODE) {
        this.$refs.changeSimailarDialog.hide()
        await this.getPaperData()
        await this.getInfo()
        // this.$refs['question-recycle-bin'].getQuestionRecycleList()

        this.$nextTick(() => {
          this.$nextTick(() => {
            this.Bus.$emit('scrollToElement', params.newQuestionId)
          })
        })
      } else {
        if (res) {
          // this.$message.error(res.msg)
        } else {
          // this.$message.error('网络错误')
        }
      }
    },
    // 获取当前试题 id list
    getQuestionList() {
      let questionlist = []
      for (let fragment of this.simpleQuestionList) {
        for (let ques of fragment.list) {
          questionlist.push(ques.questionId)
        }
      }
      return questionlist
    },
    onShowDeleteDialog(questionId, source) {
      this.questionId = questionId
      this.source = source
      // this.$refs.deleteDialog.show()
      this.onDeleteBasket()
    },
    async onResetPaperDateAndRecycle() {
      await this.getPaperData()
      // this.$refs['question-recycle-bin'].getQuestionRecycleList()
    },
    onShowAnswerSheet() {
      // 遍历 试题
      // this.questionsData
      // console.log(this.simpleQuestionList)
      let questionlist = []
      for (let fragment of this.simpleQuestionList) {
        for (let ques of fragment.list) {
          questionlist.push(ques.questionInfo)
        }
      }
      if (questionlist.length <= 0) {
        this.$message.error('当前试卷无试题，请添加试题后下载')
        return
      }
      let pn = this.paperData.paperHeadline || this.paperData.paperName || ''
      let sn = this.currSubject.subjectName
      let params = question2AnswerSheet(
        questionlist,
        this.currSubject.subjectCode.substr(2, 2) == '13',
      )
      let urlBase = 'https://ti-demo.canpoint.cn:8433/answersht'
      // if(import.meta.env.NODE_ENV === 'development')
      // {
      //   urlBase = 'http://localhost:8089'
      // }
      this.openWindowLink(
        urlBase +
          '/v1.0/template/card/paper/?paper_type=A4&ti_params=' +
          params +
          '&pn=' +
          encodeURIComponent(pn) +
          '&sn=' +
          sn +
          '&token=' +
          getToken(),
      )
    },
    // 监听删除试题
    async onDeleteBasket() {
      this.questionChange({ questionId: this.questionId }, 3)
      // let parms = {
      //   stage: this.currSubject.periodCode,
      //   subject: this.currSubject.subjectCode,
      //   questionId: this.questionId,
      //   source: this.source,
      //   is2Recycle: true,
      //   removeType: 1,
      // }
      // let res = await this.newPost(API.DELETE_BASKET, parms)
      // if (res.code === CTS.constant.SUCCESS_CODE) {
      //   // this.$refs.deleteDialog.hide()
      //   // 更新分数数据
      //   await this.getPaperData()
      //   // this.$refs['question-recycle-bin'].getQuestionRecycleList()
      // }
    },
    async downloadPaperEnd(params) {
      // 是否要清空
      if (params.clearBasket) {
        let parms = {
          stage: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
        }
        let res = await this.newPost(API.EMPTY_BASKET, parms)
        if (this.checkoutRes(res)) {
          await this.getPaperData()
          // this.$refs['question-recycle-bin'].getQuestionRecycleList()
        }
      }
    },
    // 跳转试题回收转锚点
    toRecycle() {
      this.$emit('toRecycle')
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  
.hide {
  position: absolute;
  left: -9999px;
}

.content-container {
  min-height: 850px;
  margin-bottom: 70px;
  margin-top: 286px;

  .tab {
    display: flex;
    background: #f7f7f7;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 20px;

    > div {
      color: #7b7b7b;
      position: relative;
      transform: skew(20deg);

      &::before {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
      }

      section {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
        transform: skew(-20deg);
        cursor: pointer;
      }

      span {
        font-weight: bold;
        font-size: 18px;
      }

      i {
        font-size: 24px;
        margin-right: 8px;
      }

      &:not(.active) {
        flex: 1;
      }

      &.active {
        width: 800px;
        background: #487fff;
        color: #fff;

        &::before {
          background: radial-gradient(
            circle at 100% 0,
            transparent,
            transparent 20px,
            #487fff 10px
          );
          bottom: 0;
        }

        &::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 100%;
          background-color: #487fff;
          top: 0;
          transform: skew(-20deg);
        }
      }

      &:nth-child(1).active {
        border-top-right-radius: 15px;

        &::before {
          right: -20px;
        }

        &::after {
          left: -10px;
        }
      }

      &:nth-child(2).active {
        transform: skew(-20deg);

        section {
          transform: skew(20deg);
        }

        border-top-left-radius: 15px;

        &::before {
          transform: rotateX(180deg);
          background: radial-gradient(
            circle at 0 100%,
            transparent,
            transparent 20px,
            #487fff 20px
          );
          left: -20px;
        }

        &::after {
          right: -10px;
        }
      }
    }
  }
}

.paper-container {
  min-height: 825px;
}

.paper-main {
  position: relative;
  width: 914px;
  min-height: 825px;
  background: $color-white;
  margin-right: 286px;

  &.w-full {
    // width: 100%;
  }
}

.paper-content {
  padding: 0 22px 40px 72px;
}

.paper-side {
  position: relative;
  width: 270px;
  margin-left: -270px;
  position: sticky;
  top: 0;
}

.paper-side-body {
  width: 280px;

  .paper-side-body-bottom {
    cursor: pointer;
    position: absolute;
    bottom: 0;
    z-index: 99;
    background-color: #ffffffcc;
    text-align: center;
    width: 270px;

    .iconfont {
      color: #487fff;
      font-size: 12px;
      line-height: 30px;
    }
  }

  .paper-side-body-box {
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    width: 280px;
    height: 80vh;
  }

  &.show-fixed {
    position: fixed;
    top: 65px;
  }
}

.paper-body-close-view {
  width: 106px;
  height: 36px;
  line-height: 36px;
  border-radius: 18px;
  text-align: center;
  font-size: 14px;
  //   border: 1px solid #65a2ff;
  //   box-shadow: 0px 8px 24px 0px rgba(101, 162, 255, 0.22);
  cursor: pointer;

  & > i {
    padding-right: 5px;
  }
}

.paper_return {
  position: absolute;
  top: 10px;
  right: 140px;
  width: 106px;
  height: 34px;
  line-height: 34px;
  border-radius: 18px 18px 18px 18px;
  border: 1px solid #4b8ff5;
  color: #4b8ff5;
  font-size: 14px;
  text-align: center;
}

.paperMode {
  position: absolute;
  background: #4b8ff5;
  right: 20px;
  top: 10px;
  color: #ffffff;
}
</style>

