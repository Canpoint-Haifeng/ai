<template>
  <div class="content-container">
    <!-- 知识点数据列表渲染 -->
    <div class="recommend-content paper-main">
      <knowledge-body
        :paper-data="paperData"
        :question-types="questionTypes"
        @show-report-dialog="onShowReportDialog"
        @refresh-paper="onRefreshPaper"
        @refresh-paper-data="refreshPaperData"
        @on-check-change-question="onCheckChangeQuestion"
      />
    </div>
    <!-- 删除弹窗 -->
    <base-dialog
      ref="deleteDialog"
      :addbody="true"
      @comfirm="onDeleteQuestion"
    >
      <template #dialogTips>
        <div

          class="dialog-tips"
        >
          确认删除试题？
        </div>
      </template>
    </base-dialog>
    <!-- 纠错提示框 -->
    <report-dialog
      ref="reportDialog"
      @report-error="onReportError"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import { mapState } from 'vuex'
import { API } from '@/api/config'
import CTS from '@/common/js/constant'
import BaseDialog from '@/components/BaseDialog/BaseDialog'
import KnowledgeBody from './components/smart-knowledge-body.vue'
import questionItemMixin from '@/common/mixins/questionItemMixin'
import { decrypt } from '@/common/js/util.js'
export default {
  components: { KnowledgeBody, BaseDialog },
  mixins: [questionItemMixin],
  props: {
  },
  data() {
    return {
      type: 'paper',
      loadView: false,
      paperData: {}, // 试卷信息
      questionTypes: [], //
      simpleQuestionList: [], // 右侧试题统计简易试题列表
      questionListOrder: [],
      questionId: 0, // 删除id
      source: null, // 删除试题来源
      currPaper: {},
      showFixed: false,
      pageInnerHeight: 700,
      changeQuestionData: null, // 换一题 存储试题数据
      paperSideBodyBottom: false,
      pageMode: false,
      // questionsData: {
      //   pageSize: 10,
      //   currPage: 1,
      //   totalCount: 0,
      //   list: [],
      // },
    }
  },
  watch: {
    // questionsData() {
    //   this.loadView = true
    //   this.$nextTick(() => {
    //     this.paperSideScoll()
    //   })
    // },
  },
  computed: {
    ...mapState(['currSubject', 'schoolVerify']),
  },
  created() {
    // this.questionId = '6d8c0d2a-b1d2-4a4d-b129-ac479de4f803'
    // this.source = 1
    // this.getPaperData()
  },
  mounted() { },
  methods: {
    // 获取试卷信息数据
    // getPaperData() {
    //   let baseUrl = API.TEMP_PAPER_PREVIEW
    //   let parms = {
    //     period: this.currSubject.periodCode,
    //     subject: this.currSubject.subjectCode,
    //   }
    //   if (this.$route.query && this.$route.query.paperInfoId) {
    //     parms.paperInfoId = this.$route.query.paperInfoId
    //     baseUrl = API.SCHOOL_PAPER_PRVIEW
    //   }
    //   let set = {
    //     showLoading: true,
    //     message: '加载中...',
    //   }
    //   // let isInitOrder = true
    //   return this.apiPost(baseUrl, parms, set).then(res => {
    //     if (res.code === CTS.constant.SUCCESS_CODE) {
    //       let arrList = res.data.list

    //       delete res.data.list
    //       this.paperData = res.data
    //       this.renderPaperDataList(arrList)
    //     } else {
    //       this.$router.push({
    //         name: 'chapterSelection',
    //       })
    //     }
    //   })
    // },

    async syncUploadFile(data) {
      let params = {
        fileName: this.paperData.paperName || this.paperData.paperHeadline,
        fileUrl: data.student,
        answerFileUrl: data.answer,
        userGuid: this.userInfo.userGuid,
        period: this.currSubject.periodCode,
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
        let url = `//cloudprint-teacher-console.canpoint.cn/#/set-task?resourceId=${res.resourceId
          }&resourceIdEnc=${res.resourceIdEnc}&title=${params.fileName}`
        this.openWindowLink(url)
      }
    },
    onSideMoveBottom() {
      let el = this.$refs.papersidebottom
      scrollIntoView(el, { time: 500, debug: true })
    },
    paperSideScoll(e) {
      let el = this.$refs.paperSideBodyRef
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
      this.queryOrder(paperItem)
    },
    showRecommendTask(paperItem) {
      paperItem.showClearBasket = false
      paperItem.showRecommendTask = true
      this.currPaper = paperItem
      this.queryOrder(paperItem)
    },

    // 获取试卷信息数据
    getPaperData() {
      let baseUrl = API.TEMP_PAPER_PREVIEW
      let parms = {
        period: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      if (this.$route.query && this.$route.query.paperInfoId) {
        parms.paperInfoId = this.$route.query.paperInfoId
        baseUrl = API.SCHOOL_PAPER_PRVIEW
      }
      let set = {
        showLoading: true,
        message: '加载中...',
      }
      // let isInitOrder = true
      return this.apiPost(baseUrl, parms, set).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          let data = decrypt(res.data)
          if (data) {
            data = JSON.parse(data)
            let arrList = data.list
            delete data.list
            this.paperData = data
            this.renderPaperDataList(arrList)
          }
        } else {
          this.$router.push({
            name: 'chapterSelection',
          })
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
      let getIndexId = function () {
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
        period: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        paramsJson: JSON.stringify(questionListOrder),
      }
      this.apiPost(API.QUESTION_INIT_ORDER, parms).then(res => {
        if (res.code !== CTS.constant.SUCCESS_CODE) {
          // this.$message.error(res.msg)
        }
      })
    },
    // 监听刷新试卷信息数据
    onRefreshPaper() {
      this.getPaperData()
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
      console.log('questionItem', questionItem)
      console.log('type', type)
      
      let qids = this.getQuestionList()
      this.changeQuestionData = {
        qid: questionItem.questionId,
        ordinal: questionItem.ordinal,
        type: type,
        source: questionItem.source,
      }
      this.$refs.changeSimailarDialog.show(questionItem, {
        period: this.currSubject.periodCode,
        subjectCode: this.currSubject.subjectCode,
        excludeQids: qids.join(','),
      })
    },
    async changeQuestionBox(questionItem) {
      console.log(questionItem)
      if (!(questionItem.questionInfo && questionItem.questionInfo.quesType)) {
        return
      }
      let params = {
        period: this.currSubject.periodCode,
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

      let res = await this.apiPost(API.PAPERMAKER_CHANGEONE, params, {
        showLoading: true,
      })
      if (res && res.code === CTS.constant.SUCCESS_CODE) {
        this.$refs.changeSimailarDialog.hide()
        await this.getPaperData()
        this.$refs['question-recycle-bin'].getQuestionRecycleList()

        this.$nextTick(() => {
          this.$nextTick(() => {
            this.Bus.$emit('scrollToElement', params.newQuestionId)
          })
        })
      } else {
        if (res) {
          this.$message.error(res.msg)
        } else {
          this.$message.error('网络错误')
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
      let parms = {
        period: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        questionId: this.questionId,
        source: this.source,
        is2Recycle: true,
      }
      let res = await this.apiPost(API.DELETE_BASKET, parms)
      if (res.code === CTS.constant.SUCCESS_CODE) {
        // this.$refs.deleteDialog.hide()
        // 更新分数数据
        await this.getPaperData()
        this.$refs['question-recycle-bin'].getQuestionRecycleList()
      }
    },
    // 关闭预览
    closePreview(route) {
      if (this.$route.query.id) {
        this.$router.push({
          path: './editbreakdowngroup',
          query: {
            id: this.$route.query.id,
          },
        })
      } else {
        this.$router.push({
          path: './grouppaper',
        })
      }
    },
    async downloadPaperEnd(params) {
      // 是否要清空
      if (params.clearBasket) {
        let parms = {
          period: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
        }
        let res = await this.apiPost(API.EMPTY_BASKET, parms)
        if (this.checkoutRes(res)) {
          await this.getPaperData()
          this.$refs['question-recycle-bin'].getQuestionRecycleList()
        }
      }
    },
    onDeleteQuestion() { },
  },
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.content-container {
  width: 100%;
  min-width: auto;
  min-height: 850px;
  margin-bottom: 70px;
}
.paper-main {
  width: 100%;
  padding: 60px 20px 30px 20px;
  box-sizing: border-box;
}
.paper-content {
  padding: 0 22px 40px 72px;
}
.paper-side {
  position: relative;
  width: 270px;
  margin-left: -270px;
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
      color: #487FFF;
      font-size: 12px;
      line-height: 30px;
    }
  }
  .paper-side-body-box {
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    width: 280px;
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
  top: 15px;
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
  top: 15px;
  color: #ffffff;
}
</style>
