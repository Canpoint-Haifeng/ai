<template>
  <div class="content-container">
    <div class="paper-container clearfix">
      <div class="paper-main fl">
        <div class="paper-header">
          <div class="left">
            <div @click="queryOrderLogin(paperData)">
              <i class="icon iconfont icon-plus-download" />
              <span>试卷下载</span>
            </div>
            <div>
              <i class="icon iconfont icon-change" />
              <span>重新生成</span>
            </div>
          </div>
          <div class="middle">
            <h2
              class="paper-title color-3 font-20"
              v-html="paperData.paperName"
            />
            <div
              class="paper-desc color-9 font-12"
              @click="routerBack"
            >
              原卷：<span>{{ title }}</span>
            </div>
          </div>
          <div class="right">
            <el-button
              class="btn"
              @click="addBatchQuestionBox"
            >
              <i class="el-icon-plus" /> 全部加入试题篮
            </el-button>
          </div>
        </div>
        <div
          ref="paperDetailQuesListRef"
          class="paper-body"
        >
          <question-item
            v-for="(subItem, subIndex) in questionsData"
            :key="subIndex"
            :question-item="subItem"
            :question-index="subIndex"
            :show-error="false"
            :show-similar="true"
            @check-similar-quesiton="onCheckSimilarQuesiton"
            @check-edit-quesiton="onCheckEditQuesiton"
            @add-question-box="onAddQuestionBox"
            @delete-question-box="onDeleteQuestionBox"
            @check-question-detail="onCheckQuestionDetail"
            @collect-question="onCollectQuestion"
            @show-report-dialog="onShowReportDialog"
            @toggle-explain="onToggleExplain"
          />
        </div>
      </div>
      <!--试题篮组件-->
      <app-tool-basket />
      <!-- 收藏成功提示框 -->
      <collect-message ref="collectMessage" />
      <!-- 纠错提示框 -->
      <report-dialog
        ref="reportDialog"
        @report-error="onReportError"
      />
      <!-- 下载组卷 -->
      <download-dialog
        ref="downloadDialog"
        :curr-paper="paperData"
        @download-paper="onDownloadPaper"
      />

      <!-- 收藏成功提示框 -->
      <!-- <collect-message collectPath="/paper/resources/collect?tabActiveName=QuesCollect" dialogTitle="试题"
                ref="collectMessage">
            </collect-message> -->
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
      <!-- <report-dialog @reportError="onReportError" ref="reportDialog">
            </report-dialog> -->
      <!-- 登录弹窗 -->
      <!-- 登录弹窗 -->
      <app-login ref="appLoginRef" />
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { HTMLDecode } from '@/common/js/util'
import { mapState } from 'vuex'
import { API } from '@/api/config'
import { isLogin } from '@/common/js/util'
import questionItemMixin from '@/common/mixins/questionItemMixin'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import paperPayMixin from '@/common/mixins/paperPayMixin'
import QuestionItem from '@/components/QuestionItem/QuestionItem'
import PaperHearing from '@/components/PaperItem/PaperHearing.vue'
import PaperDetailBody from './paper-body/index.vue'

export default {
  components: {
    Breadcrumb,
    QuestionItem,
    PaperHearing,
    PaperDetailBody,
  },
  mixins: [questionItemMixin, paperPayMixin],
  data() {
    return {
      paperIdEnc: '',
      source: '',
      paperData: {},
      provinceName: '',
      questionsData: [],
      title: '',
    }
  },
  computed: {
    ...mapState(['currSubject']),
  },
  mounted() {
    // 监听添加试题
    this.Bus.$on('addBasket', this.onAddBasket)
    this.Bus.$on('refreshBasket', this.onAddBasket)
  },
  created() {
    this.title = this.$route.query.title
    if (this.$route.query.questionIds) {
      this.getPaperPreview()
    }
  },
  setup() {
    const appLoginRef = ref(null)
    
    const showAppLogin = () => {
      appLoginRef.value.showLogin()
    }
    
    return {
      appLoginRef,
      showAppLogin
    }
  },
  methods: {
    getQuestions(data, array) {
      data.forEach(v => {
        if (v.list) {
          this.getQuestions(v.list, array)
        } else {
          array.push(v.questionInfo)
        }
      })
      return array
    },
    // 获取试卷列表数据
    async getPaperPreview() {
      let params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        questionIds: this.$route.query.questionIds,
      }
      let set = {
        showLoading: true,
        message: '加载中...',
      }
      const data = await this.newPost(
        { urlPath: '/paper-builder/paper-generate/v2/parallel-generate' },
        params,
        set,
      ).then()
      if (data.code === CTS.constant.SUCCESS_CODE) {
        // let baseUrl = API.TEMP_PAPER_PREVIEW
        // let parms = {
        //     stage: this.currSubject.periodCode,
        //     subject: this.currSubject.subjectCode,
        // }
        this.paperData = data.data
        this.executeQuestionNum(data.data.questionVoList)
        // this.apiGet(baseUrl, parms, set).then(res => {
        //     if (res.code === CTS.constant.SUCCESS_CODE) {
        // this.paperData = res.data
        // this.executeQuestionNum(data.data.questionVoList)
        //     }
        // })
      }
    },
    onAddBasket() {
      this.getPaperPreview()
    },
    executeQuestionNum(data) {
      let list = []
      data.map((sub, index) => {
        list.push({
          createGuid: sub.createGuid,
          hideCollect: sub.createGuid == this.userInfo.userGuid,
          isQuestionBox: sub.isQuestionBox,
          isCollect: sub.isCollect,
          source: sub.source,
          questionInfo: sub,
          // questionNum: index + 1 + (page - 1) * pageSize,
          showQuestionNum: true,
          showExplain: !!this.isShowAnswerAndAnalysis,
          showKnowledge: !!this.isShowAnswerAndAnalysis,
          questionId: sub.questionId,
        })
      })
      this.questionsData = list
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
    queryOrderLogin(paperData) {
      if (!isLogin()) {
        this.$emit('showAppLogin')
      } else {
        let parms = {
          stage: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
          paperName: paperData.paperHeadline,
        }
        let set = {
          showLoading: true,
          message: '加载中...',
        }
        // this.newPost({ urlPath: '/paper-builder/paper/savePaper' }, parms, set).then(res => {
        //     if (res.code === CTS.constant.SUCCESS_CODE) {
        //         paperData.paperId = res.data
        this.queryOrder(paperData)
        //     }
        // })
      }
    },
    // 监听全部加入试题篮
    addBatchQuestionBox() {
      let questionList = []
      let list = this.getPaperQuestionList(this.paperData.questionVoList)
      list.forEach(subItem => {
        if (!subItem.isQuestionBox) {
          questionList.push({
            questionId: subItem.questionId,
            type: subItem.quesType.code,
            typeName: subItem.quesType.name,
            source: this.paperData.source,
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
          this.getPaperPreview()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    routerBack() {
      let queryStr =
        '?source=' +
        this.$route.query.source +
        '&viewCount=' +
        this.$route.query.viewCount +
        '&pn=' +
        this.$route.query.pn +
        '&paperId=' +
        this.$route.query.paperId +
        '&isCollect=' +
        this.$route.query.isCollect
      queryStr += '&subject=' + this.currSubject.subjectCode
      window.open(this.$router.resolve('/paper/detail').href + queryStr)
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
  min-height: 1200px;
  margin-bottom: 70px;
}

.paper-main {
  min-width: 1200px;
  min-height: 825px;
  background: $color-white;
  padding: 0 20px;
  box-sizing: border-box;
}

.paper-header {
  padding: 38px 0 18px 0;
  display: flex;
  align-items: center;

  .right,
  .left {
    width: 200px;
    display: flex;

    div {
      display: flex;
      margin-left: 10px;
      color: $color-theme;
      cursor: pointer;
      flex-direction: column;

      i {
        text-align: center;
      }

      span {
        margin-top: 5px;
      }
    }
  }

  .right {
    height: 35px;

    .btn {
      padding: 0 10px;
    }
  }

  .middle {
    flex: 1;
    text-align: center;
  }

  .paper-title {
    margin-bottom: 15px;
  }

  .paper-desc {
    margin-bottom: 20px;
    line-height: 20px;
    cursor: pointer;

    span {
      color: $color-theme;
    }
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

