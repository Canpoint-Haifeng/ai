<template>
  <div class="content-container">
    <breadcrumb :crumbs-data="crumbsData" />
    <div class="paper-container clearfix">
      <div class="paper-main fl">
        <div class="paper-header">
          <h2
            class="paper-title color-3 font-20"
            v-html="
              paperData.latexPaperName || paperData.paperName || paperData.name
            "
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
            <!-- <span class="item">ID：{{paperIdEnc}}</span> -->

            <span class="item">浏览：
              <em
                v-if="paperData.viewCount >= 0"
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
              <em class="text">{{ paperData.updateTime | datetime('YYYY/MM/DD') }}更新</em>
            </span>
            <!-- <span class="item">类型：
              <em class="text" v-if="paperData.paperType">{{paperData.paperType}}</em>
              <em class="text" v-else>-</em>
            </span> -->
          </div>
        </div>
        <!-- <PaperHearing v-if="paperData.paperStructure" :period="paperData.period" :subject="paperData.subjectCode"
          :paperIdEnc="paperIdEnc" :source="paperData.source"></PaperHearing> -->
        <div
          ref="paperDetailQuesListRef"
          class="paper-body"
        >
          <paper-detail-body
            :paper-structure="paperData.paperStructure"
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
          <!-- <div class="paper-part"
             v-for="(bigQues, index) in paperData.paperStructure"
             :key="index">
            <ul class="question-list" >
              <div class="big-exam-question clearfix">
                <span class="big-ques-name">{{bigQues.questionTypeName}}</span>
                <span class="big-ques-button" @click="onAddQuestionType(bigQues)"><i class="iconfont iconadd">+</i></template>添加题型下试题</span>
              </div>
              <question-item
                v-for="(subItem, subIndex) in bigQues.children"
                :key="subIndex"
                :questionItem="subItem"
                :questionIndex="subIndex"
                :showSimilar="true"
                @checkSimilarQuesiton="onCheckSimilarQuesiton"
                @checkQuestionDetail="onCheckQuestionDetail"
                @collectQuestion="onCollectQuestion"
                @showReportDialog="onShowReportDialog"
                @addQuestionBox="onAddQuestionBox"
                @deleteQuestionBox="onDeleteQuestionBox"
                @showLogin="onShowLogin"
                @toggleExplain="onToggleExplainHander">
              </question-item>
            </ul>
          </div> -->
        </div>
      </div>
      <div class="paper-side fl">
        <paper-operate
          :paper-id-enc="paperIdEnc"
          :source="source"
          :paper-data="paperData"
          :paper-name="paperData.paperName"
          @change-all-explain="onChangeAllExplain"
          @add-batch-question-box="onAddBatchQuestionBox"
          @show-answer-sheet="onShowAnswerSheet"
          @show-app-login="showAppLogin"
        />
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
    <!-- 登录弹窗 -->
    <!-- 登录弹窗 -->
    <app-login ref="appLogin" />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { getDigitalChinese, HTMLDecode } from '@/common/js/util'
import { mapState } from 'vuex'
import { API } from '@/api/config'
import { isLogin, getToken, question2AnswerSheet } from '@/common/js/util'
import questionItemMixin from '@/common/mixins/questionItemMixin'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import QuestionItem from '@/components/QuestionItem/QuestionItem'
import PaperOperate from './paper-operate/paper-operate'
import PaperDetailBody from './paper-body/index.vue'
import PaperHearing from '@/components/PaperItem/PaperHearing.vue'

export default {
  components: {
    Breadcrumb,
    QuestionItem,
    PaperOperate,
    PaperDetailBody,
    PaperHearing,
  },
  mixins: [questionItemMixin],
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
      paperData: {},
      provinceName: '',
    }
  },
  computed: {
    ...mapState(['currSubject']),
  },
  created() {
    if (this.$route.query.paperIdEnc) {
      this.paperIdEnc = this.$route.query.paperIdEnc
      this.source = this.$route.query.source + ''
      this.provinceName = this.$route.query.pn
      // this.routerPaperDate()
    } else {
      console.log(1212)
      // this.$router.back()
    }
    if (this.$route.query.paperId) {
      this.getPaperPreview()
    }
  },
  unmounted() {
    document.title = '全品AI教研云-中小学题库-中小学试卷下载-在线组卷网'
  },
  methods: {
    onShowAnswerSheet() {
      if (!isLogin()) {
        this.showAppLogin()
        return
      }
      // 遍历 试题
      // this.questionsData
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
        paperUid: this.$route.query.paperId,
        source: 2,
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      let set = {
        showLoading: true,
        message: '加载中...',
      }
      this.apiGet(
        API.PAPER_BUILDER_PAPER_PREVIEW,
        parms,
        set,
      ).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          const data = res.data

          let arrList = res.data
          this.executePaperList(arrList)
        }
      })
    },
    executePaperList(arrList) {
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
          // item.isAddedToBox = item.questionInfo.isAddedToBox
          item.isCollect = item.questionInfo.isCollect
          item.canCollect = item.questionInfo.canCollect
          item.isQuestionBox = item.questionInfo.isQuestionBox
        }
      }

      // arrList.paperIdEnc = this.paperIdEnc
      console.log(arrList)
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
      document.title = HTMLDecode(arrList.name) || '全品AI教研云'
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
        subItem.isQuestionBox = subItem.questionInfo.isQuestionBox
        subItem.isCollected = subItem.questionInfo.isCollected
        subItem.canCollect = subItem.questionInfo.canCollect
      })
      return questionList
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
      console.log(questionList, 111)
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
            period: this.currSubject.periodCode,
            subjectCode: this.currSubject.subjectCode,
            isVerify: false,
            questionId: questionItem.questionInfo.questionId,
            source: questionItem.questionInfo.source,
          }
          this.apiGet(API.SCHOOL_QUES_GETQUESINFO, parms).then(res => {
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
          if (!subItem.isQuestionBox) {
            questionList.push({
              questionId: subItem.questionId,
              type: subItem.questionInfo.quesType.code,
              typeName: subItem.questionInfo.quesType.name,
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
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        paramsJson: JSON.stringify(questionList),
      }
      let set = {
        authCode: 0,
      }
      this.newPost(API.QUESTION_BATCH_ADD, parms, set).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$message.success('成功添加到试题篮!')
          if (bigques.children && bigques.children.length) {
            bigques.children.forEach(subItem => {
              subItem.isQuestionBox = 1
            })
          }
          this.Bus.$emit('addBasket')
        }
      })
    },
    // 监听全部加入试题篮
    onAddBatchQuestionBox() {
      let questionList = []
      let list = this.getPaperQuestionList(this.paperData.paperStructure)
      list.forEach(subItem => {
        if (!subItem.isQuestionBox) {
          questionList.push({
            questionId: subItem.questionId,
            type: subItem.questionInfo.quesType.code,
            typeName: subItem.questionInfo.quesType.name,
            source: subItem.source,
          })
        }
      })
      if (!questionList.length) {
        this.$message.error('无可添加的试题!')
        return
      }
      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        paramsJson: JSON.stringify(questionList),
      }
      let set = {
        authCode: 0,
      }
      this.newPost(API.QUESTION_BATCH_ADD, parms, set).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$message.success('成功添加到试题篮!')
          list.forEach(subItem => {
            if (!subItem.isQuestionBox) {
              subItem.isQuestionBox = 1
            }
          })
          this.Bus.$emit('addBasket')
        } else {
          this.$message.error(res.msg)
        }
      })
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
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  
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
  margin-bottom: 70px;
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
  position: sticky;
  top: 0;
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
</style>

