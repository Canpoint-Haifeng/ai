<template>
  <div v-if="paperData">
    <div class="paper-header-info">
      <div class="header-left">
        <div class="iconfont-block">
          <SharePaperPopover
            :paper-id-enc="paperData.paperIdEnc"
            :subject-code="currSubject.subjectCode"
            @show-app-login="showAppLogin"
          >
            <template #reference>
              <div class="paper-share-block">
                <span class="iconfont iconfenxiang" />分享
              </div>
            </template>
          </SharePaperPopover>
        </div>
        <div
          class="iconfont-block"
          @click="onShowAnalysisDialogLogin()"
        >
          <span class="iconfont iconfenxi" />分析
        </div>
        <div
          class="iconfont-block"
          @click="showCollectDialog"
        >
          <span
            class="iconfont"
            :class="{
              iconshoucang: !collectStatus,
              iconquxiaoshoucang: collectStatus,
            }"
          />{{ collectStatus ? '取消收藏' : '收藏' }}
        </div>
      </div>
      <div class="header-right">
        <div
          class="add-basket"
          @click="onAddBatchQuestionBox"
        >
          <span class="el-icon-plus" />全部加入试题篮
        </div>
        <div
          class="download-all-paper"
          @click="queryOrderLogin"
        >
          整卷下载
        </div>
      </div>
    </div>
    <div class="paper-container clearfix">
      <div class="paper-main fl">
        <div class="paper-header">
          <h2
            class="paper-title color-3 font-20"
            v-html="paperData.latexPaperName || paperData.paperName"
          />
          <div
            class="paper-desc color-9 font-12"
            v-html="paperData.latexPaperDesc || paperData.paperDesc"
          />
          <div class="paper-info color-9 font-12">
            <span class="item">
              <em class="text">{{
                paperData.provinceName || provinceName || '全国'
              }}</em>
            </span>
            <span
              v-if="paperData.gradeName"
              class="item"
            >
              {{ paperData.gradeName || '--' }}
            </span>
            <span
              v-if="paperData.paperType"
              class="item"
            >
              <em v-if="paperData.paperType">{{ paperData.paperType }}</em>
              <em v-else>--</em>
            </span>

            <span class="item">浏览：
              <em
                v-if="paperData.viewCount"
                class="text"
              >{{ paperData.viewCount }}次</em>
              <em
                v-else
                class="text"
              >-</em>
            </span>
            <!-- <span class="item">下载：
              <em class="text" v-if="paperData.downCount">{{paperData.downCount}}次</em>
              <em class="text" v-else>-</em>
            </span> -->
            <span class="item">题量：
              <em
                v-if="paperData.paperTotalCount"
                class="text"
              >{{
                paperData.paperTotalCount
              }}</em>
              <em
                v-else
                class="text"
              >-</em>
            </span>
            <span class="item">
              <em class="text">{{ paperData.timeModified | datetime('YYYY/MM/DD') }}更新</em>
            </span>
            <!-- <span class="item">类型：
              <em class="text" v-if="paperData.paperType">{{paperData.paperType}}</em>
              <em class="text" v-else>-</em>
            </span> -->
          </div>
        </div>
        <div
          ref="paperDetailQuesListRef"
          class="paper-body"
        >
          <paper-detail-body
            :paper-structure="paperData.paperStructure"
            :show-share-question="true"
            :show-layered-name="true"
            @check-similar-quesiton="onCheckSimilarQuesiton"
            @check-question-detail="onCheckQuestionDetail"
            @collect-question="onCollectQuestion"
            @show-report-dialog="onShowReportDialog"
            @add-question-box="onAddQuestionBox"
            @delete-question-box="onDeleteQuestionBox"
            @show-login="onShowLogin"
            @add-question-type="onAddQuestionType"
            @toggle-explain="onToggleExplainHander"
          />
        </div>
      </div>
    </div>
    <!--试题篮组件-->
    <app-tool-basket />
    <!-- 收藏成功提示框 -->
    <collect-message
      ref="collectMessage"
      collect-path="/paper/resources/collect?tabActiveName=QuesCollect"
      dialog-title="试题"
    />

    <!-- 显示相似题  -->
    <cp-simailar-dialog
      ref="simailarDialog"
      @collect-question="onCollectQuestion"
      @check-question-detail="onCheckQuestionDetail"
      @show-report-dialog="onShowReportDialog"
      @add-question-box="onAddQuestionBox"
      @delete-question-box="onDeleteQuestionBox"
    />
    <!-- 纠错提示框 -->
    <report-dialog
      ref="reportDialog"
      @report-error="onReportError"
    />

    <!-- 收藏试卷 -->
    <!-- 取消收藏成功提示框 -->
    <collect-message
      ref="collectMessagePaper"
      :collect-status="1"
    />
    <!-- 试卷分析 -->
    <analysis-dialog
      ref="analysisDialog"
      :question-analysis="questionAnalysis"
    />

    <!-- 下载组卷 -->
    <download-dialog
      ref="downloadDialog"
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
    <!-- 登录弹窗 -->
    <app-login ref="appLogin" />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { getDigitalChinese, HTMLDecode } from '@/common/js/util.js'
import { mapState } from 'vuex'
import { API } from '@/api/config'
import { isLogin, getToken, question2AnswerSheet } from '@/common/js/util'
import questionItemMixin from '@/common/mixins/questionItemMixin'
import PaperDetailBody from '@/views/paper-detail/paper-body/index.vue'
import paperAnalysisMixin from '@/common/mixins/paperAnalysisMixin'
import paperPayMixin from '@/common/mixins/paperPayMixin'
import CollectMessage from '@/components/CollectMessage/CollectMessage'
import SharePaperPopover from '@/components/PaperItem/SharePaperPopover'

export default {
  components: {
    PaperDetailBody,
    CollectMessage,
    SharePaperPopover,
  },
  mixins: [questionItemMixin, paperPayMixin, paperAnalysisMixin],
  props: {
    paperItem: Object,
  },
  data() {
    return {
      crumbsData: [
        {
          path: '/paper/center',
          isLink: true,
          text: '试卷中心',
        },
        {
          path: '',
          isLink: false,
          text: '试卷详情',
        },
      ],
      paperIdEnc: '',
      source: '',
      paperData: null,
      provinceName: '',
      collectStatus: false, // true已收藏，false未收藏
    }
  },
  watch: {
    paperItem() {
      this.initPaperDetail()
    },
  },
  computed: {
    ...mapState(['currSubject']),
  },
  created() {
    this.initPaperDetail()
  },
  unmounted() {
    document.title = '全品AI教研云-中小学题库-中小学试卷下载-在线组卷网'
  },
  methods: {
    async initPaperDetail() {
      this.paperIdEnc = this.paperItem.paperIdEnc
      this.source = this.paperItem.source + ''
      this.provinceName = this.paperItem.provinceName || ''
      await this.getCollectStatus()
      this.routerPaperDate()
    },

    onShowAnalysisDialogLogin() {
      if (!isLogin()) {
        this.showAppLogin()
      } else {
        this.onShowAnalysisDialog(this.paperData)
      }
    },
    // 获取试卷收藏状态
    getCollectStatus() {
      if (!isLogin()) {
        return
      }
      let parms = {
        paperIdEnc: this.paperIdEnc,
      }
      return this.apiGet(API.MANAGE_PAPER_COLLECT_STATUS, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.collectStatus = res.data
        }
      })
    },
    // 显示收藏框
    showCollectDialog() {
      if (!isLogin()) {
        this.showAppLogin()
        return
      }
      let parms = {
        period: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        paperIdEnc: this.paperIdEnc,
        source: this.source,
        status: this.collectStatus ? 0 : 1,
        grade: this.paperData.grade,
        year: this.paperData.year || '',
        schoolId: this.paperData.schoolId,
      }
      this.apiGet(API.MANAGE_PAPER_COLLECT, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.collectStatus = !this.collectStatus
          this.$refs.collectMessagePaper.showMessage(parms.status)
        }
      })
    },
    getPaperQuestionList(list) {
      let questionList = []
      let stack = [...list]
      while (stack.length > 0) {
        let item = stack.shift()
        if (item && item.questionId) {
          questionList.push(item)
        } else {
          if (item.children && item.children.length) {
            stack.push(...item.children)
          }
        }
      }
      return questionList
    },
    // 监听全部加入试题篮
    onAddBatchQuestionBox() {
      if (!isLogin()) {
        this.showAppLogin()
        return
      }
      let questionList = []
      let list = this.getPaperQuestionList(this.paperData.paperStructure)
      list.forEach(subItem => {
        if (!subItem.isAddedToBox) {
          questionList.push({
            questionId: subItem.questionId,
            type: subItem.questionInfo.quesType.code,
            typeName: subItem.questionInfo.quesType.name,
            subjective: subItem.questionInfo.subjective.code,
            source: subItem.source,
          })
        }
      })
      if (!questionList.length) {
        this.$message.error('无可添加的试题!')
        return
      }
      let parms = {
        period: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        paramsJson: JSON.stringify(questionList),
      }
      let set = {
        authCode: 0,
      }
      this.apiPost(API.QUESTION_BATCH_ADD, parms, set).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$message.success('成功添加到试题篮!')
          list.forEach(subItem => {
            if (!subItem.isAddedToBox) {
              subItem.isAddedToBox = 1
            }
          })

          this.Bus.$emit('addBasket')
        }
      })
    },
    onShowAnswerSheet() {
      if (!isLogin()) {
        this.showAppLogin()
        return
      }
      // 遍历 试题
      // console.log(this.simpleQuestionList)
      let list = this.getPaperQuestionList(this.paperData.paperStructure)
      let questionlist = []
      list.forEach(subItem => {
        questionlist.push(subItem.questionInfo)
      })
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
      this.openWindowLink(
        'https://ti-demo.canpoint.cn:8433/answersht/v1.0/template/card/paper/?paper_type=A4&ti_params=' +
          params +
          '&pn=' +
          encodeURIComponent(pn) +
          '&sn=' +
          sn +
          '&token=' +
          getToken(),
      )
    },
    showAppLogin() {
      this.$refs.appLogin.showLogin()
    },
    routerPaperDate() {
      if (!isLogin()) {
        this.getNoTokenPaperDate()
      } else {
        let parms = {
          token: getToken(),
        }
        this.wayGet(API.TOKEN_VERIFY, parms).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.getPaperPreview()
          } else {
            this.getNoTokenPaperDate()
          }
        })
      }
    },
    getNoTokenPaperDate() {
      let parms = {
        period: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        paperIdEnc: this.paperIdEnc,
        source: this.source,
        viewCount: this.$route.query.viewCount || '',
      }
      let set = {
        showLoading: true,
        message: '加载中...',
      }

      this.apiPost(API.NOTOKEN_PAPER_QUERY, parms, set).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          let arrList = res.data
          this.executePaperList(arrList)
        }
      })
    },
    // 获取试卷列表数据
    getPaperPreview() {
      let parms = {
        period: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        paperIdEnc: this.paperIdEnc,
        source: this.source,
        viewCount: this.$route.query.viewCount || '',
      }
      let set = {
        showLoading: true,
        message: '加载中...',
      }
      this.apiPost(API.MANAGE_PAPER_PREVIEW, parms, set).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          let arrList = res.data
          this.executePaperList(arrList)
        }
      })
    },
    executePaperList(arrList) {
      this.paperData = null
      let stack = [...arrList.paperStructure]
      let questionNum = 0
      while (stack.length) {
        let item = stack.shift()
        if (!item.questionId) {
          let hasQues = false
          if (item.children && item.children.length) {
            item.children.forEach(subItem => {
              if (subItem.questionId) {
                hasQues = true
              }
            })
            item.hasQues = hasQues
            stack.unshift(...item.children)
          } else {
            item.hasQues = hasQues
          }
        } else {
          questionNum = questionNum + 1
          item.questionNum = questionNum
          item.showQuestionNum = true
          item.source = item.questionInfo.source
          item.isAddedToBox = item.questionInfo.isAddedToBox
          item.isCollected = item.questionInfo.isCollected
          item.canCollect = item.questionInfo.canCollect
        }
      }

      arrList.paperIdEnc = this.paperIdEnc
      this.paperData = arrList
      //  过滤html标签
      document.title = HTMLDecode(arrList.paperName) || '全品AI教研云'
      // 设置 title

      this.$nextTick(() => {
        this.onRenderJaxPage('paperDetailQuesListRef')
      })
    },
    executePaperList1(arrList) {
      let questionNum = 0
      let questionList = []
      arrList.paperStructure.forEach(item => {
        if (item.children && item.children.length) {
          let queslist = this.getPaperQuestionDtoList(
            item.children,
            questionNum,
          )
          questionNum += queslist.length
          questionList.push(...queslist)
        }
      })
      arrList.paperStructure = []
      let bigquestionNum = 1
      let currentBigQues = null
      questionList.forEach(item => {
        let quesType = {}
        if (item && item.questionInfo && item.questionInfo.quesType) {
          quesType = item.questionInfo.quesType
        }
        if (!currentBigQues) {
          currentBigQues = {
            questionTypeName:
              getDigitalChinese(bigquestionNum) + '、' + quesType.name,
            questionType: quesType.code,
            children: [item],
          }
          arrList.paperStructure.push(currentBigQues)
          bigquestionNum++
        } else {
          if (currentBigQues.questionType === quesType.code) {
            currentBigQues.children.push(item)
          } else {
            currentBigQues = {
              questionTypeName:
                getDigitalChinese(bigquestionNum) + '、' + quesType.name,
              questionType: quesType.code,
              children: [item],
            }
            arrList.paperStructure.push(currentBigQues)
            bigquestionNum++
          }
        }
      })
      arrList.paperIdEnc = this.paperIdEnc
      this.paperData = arrList
      //  过滤html标签
      document.title = HTMLDecode(arrList.paperName) || '全品AI教研云'
      // 设置 title

      this.$nextTick(() => {
        this.onRenderJaxPage('paperDetailQuesListRef')
      })
    },
    getPaperQuestionDtoList(list, num) {
      let questionList = this.getPaperQuestionList(list)
      let questionNum = num
      questionList.forEach(subItem => {
        questionNum = questionNum + 1
        subItem.questionNum = questionNum
        subItem.showQuestionNum = true
        subItem.source = subItem.questionInfo.source
        subItem.isAddedToBox = subItem.questionInfo.isAddedToBox
        subItem.isCollected = subItem.questionInfo.isCollected
        subItem.canCollect = subItem.questionInfo.canCollect
      })
      return questionList
    },

    // 监听试题答案解析
    onToggleExplainHander(questionItem) {
      if (!isLogin()) {
        if (!questionItem.showLogin) {
          this.$set(questionItem, 'showKnowledge', true)
          this.$set(questionItem, 'showLogin', true)
        } else {
          this.$set(questionItem, 'showKnowledge', false)
          this.$set(questionItem, 'showLogin', false)
        }
        return
      }

      if (questionItem.showExplain) {
        this.$set(questionItem, 'showExplain', false)
        this.$set(questionItem, 'showKnowledge', false)
      } else {
        if (questionItem.hasExplainData) {
          this.$set(questionItem, 'showExplain', true)
          this.$set(questionItem, 'showKnowledge', true)
        } else {
          let parms = {
            qids: questionItem.questionInfo.questionId,
          }
          this.apiGet(API.BACK_QUES_LIST_EXPLAIN, parms).then(res => {
            if (res.code === CTS.constant.SUCCESS_CODE) {
              this.$set(questionItem, 'showExplain', true)
              this.$set(questionItem, 'showKnowledge', true)
              this.$set(questionItem, 'hasExplainData', true)
              if (res.data && res.data.length) {
                questionItem.questionInfo = res.data[0]
              }
              questionItem.questionInfo.canCollect = questionItem.canCollect
            }
          })
        }
      }
    },
    onAddQuestionType(bigques) {
      if (!isLogin()) {
        this.showAppLogin()
        return
      }

      let questionList = []
      if (bigques && bigques.children && bigques.children.length) {
        let list = this.getPaperQuestionList(bigques.children)
        list.forEach(subItem => {
          if (!subItem.isAddedToBox) {
            questionList.push({
              questionId: subItem.questionId,
              type: subItem.questionInfo.quesType.code,
              typeName: subItem.questionInfo.quesType.name,
              subjective: subItem.questionInfo.subjective.code,
              source: subItem.source,
            })
          }
        })
      }
      if (!questionList.length) {
        this.$message.error('无可添加的试题!')
        return
      }
      let parms = {
        period: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        paramsJson: JSON.stringify(questionList),
      }
      let set = {
        authCode: 0,
      }
      this.apiPost(API.QUESTION_BATCH_ADD, parms, set).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$message.success('成功添加到试题篮!')
          if (bigques.children && bigques.children.length) {
            bigques.children.forEach(subItem => {
              subItem.isAddedToBox = 1
            })
          }
          this.Bus.$emit('addBasket')
        }
      })
    },
    queryOrderLogin() {
      if (!isLogin()) {
        this.showAppLogin()
      } else {
        this.eventStatistics([
          '_trackEvent',
          '试卷预览',
          '点击下载试卷',
          '次数',
        ])
        this.queryOrder(this.paperData)
      }
    },
    // 监听获取所有答案和解析
    onChangeAllExplain(showAllExplain) {
      if (!isLogin()) {
        if (this.paperData && this.paperData.paperStructure) {
          let questionList = this.getPaperQuestionList(
            this.paperData.paperStructure,
          )
          questionList.forEach(subItem => {
            this.$set(subItem, 'showLogin', showAllExplain)
            this.$set(subItem, 'showKnowledge', showAllExplain)
          })
        }
        return
      }

      if (showAllExplain) {
        // 显示所有答案
        let questionIds = []
        let questionList = this.getPaperQuestionList(
          this.paperData.paperStructure,
        )
        questionList.forEach(subItem => {
          if (!subItem.hasExplainData) {
            questionIds.push(subItem.questionId)
          }
        })

        let parms = {
          qids: questionIds.join(','),
        }
        if (questionIds.length > 0) {
          this.apiGet(API.BACK_QUES_LIST_EXPLAIN, parms).then(res => {
            if (res.code === CTS.constant.SUCCESS_CODE) {
              let list = this.getPaperQuestionList(
                this.paperData.paperStructure,
              )
              list.forEach(subItem => {
                this.$set(subItem, 'showExplain', true)
                this.$set(subItem, 'showKnowledge', true)
                this.$set(subItem, 'hasExplainData', true)
                if (res.data && res.data.length) {
                  const currQuestionItemInfo = res.data.find(
                    resItem => subItem.questionId === resItem.questionId,
                  )
                  if (currQuestionItemInfo) {
                    subItem.questionInfo = currQuestionItemInfo
                    subItem.questionInfo.canCollect = subItem.canCollect
                  }
                }
              })
            }
          })
        } else {
          let list = this.getPaperQuestionList(this.paperData.paperStructure)
          list.forEach(subItem => {
            subItem.showExplain = true
            subItem.showKnowledge = true
          })
        }
      } else {
        // 隐藏所有答案
        let list = this.getPaperQuestionList(this.paperData.paperStructure)
        list.forEach(subItem => {
          this.$set(subItem, 'showExplain', false)
          this.$set(subItem, 'showKnowledge', false)
        })
      }
    },
    // 监听试题篮删除试题类型或清空
    onDeleteBasket() {
      this.getPaperPreview()
    },
  },
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.big-exam-question {
  padding: 20px 0;
  .big-ques-name {
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #333333;
    line-height: 30px;
  }
  .big-ques-button {
    float: right;
    width: 130px;
    line-height: 30px;
    border: 1px dashed $color-button-d;
    text-align: center;
    color: $color-button-d;
    border-radius: 15px;
    font-size: 12px;
    cursor: pointer;
  }
  .big-ques-button:hover {
    border: 1px dashed $color-button-d-hover;
    color: $color-button-d-hover;
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
  padding: 0 20px;
  box-sizing: border-box;
}
.paper-side {
  position: relative;
  width: 270px;
  margin-left: -270px;
  background: $color-white;
}
.paper-header {
  padding: 38px 0 18px 0;
  text-align: center;
  .paper-title {
    margin-bottom: 15px;
  }
  .paper-desc {
    margin-bottom: 20px;
    line-height: 20px;
  }
  .paper-info {
    .item {
      margin-right: 36px;
    }
  }
}
.question-type {
  padding: 20px 0;
  line-height: 20px;
}

.paper-header-info {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px 0px 20px;
  .header-left {
    .iconfont-block {
      display: inline-block;
      line-height: 30px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      cursor: pointer;
      user-select: none;
      .iconfont {
        color: #666666;
        padding-right: 5px;
      }
      margin-right: 30px;
    }
  }
  .header-right {
    .add-basket {
      display: inline-block;
      line-height: 28px;
      border: 1px solid #487fff;
      border-radius: 4px;
      text-align: center;
      width: 130px;
      color: #487fff;
      margin-right: 20px;
      font-size: 12px;
      cursor: pointer;
      user-select: none;
      .el-icon-plus {
        padding-right: 5px;
      }
      &:hover {
        border: 1px solid #3e73cd;
        color: #3e73cd;
      }
    }
    .download-all-paper {
      display: inline-block;
      line-height: 30px;
      background: #487fff;
      border-radius: 4px;
      width: 90px;
      text-align: center;
      color: white;
      font-size: 12px;
      cursor: pointer;
      user-select: none;
      &:hover {
        background-color: #3e73cd;
      }
    }
  }
}
</style>
