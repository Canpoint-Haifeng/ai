import CTS from '@/common/js/constant'
import { mapState } from 'vuex'
import { API } from '@/api/config'
import { isLogin, getToken } from '@/common/js/util'
import QuestionItem from '@/components/QuestionItem/QuestionItem'
import CollectMessage from '@/components/CollectMessage/CollectMessage'
import ReportDialog from '@/components/ReportDialog/ReportDialog'
import { prefixStyle } from '@/common/js/dom'
import CpWarningDialog from '@/components/AuthorityVip/CpWarningDialog'
import RecommendQuestionDia from '@/components/AnalysisDialog/RecommendQuestionDia'
import { CpSimilarDialog } from '@/components/CpFan/index.js'

const transform = prefixStyle('transform')
const transformOrigin = prefixStyle('transformOrigin')
const questionItemMixin = {
  components: {
    QuestionItem,
    CollectMessage,
    ReportDialog,
    CpSimilarDialog,
    RecommendQuestionDia,
  },
  computed: {
    ...mapState(['currSubject', 'userInfo']),
  },
  data() {
    return {
      teachBook: '',
    }
  },
  mounted() {
    this.Bus.$on('showLogin', this.onShowLogin)
    this.Bus.$on('deleteBasket', this.onDeleteBasket)
  },
  unmounted() {
    this.Bus.$off('showLogin')
    this.Bus.$off('deleteBasket')
  },
  methods: {
    async getBookCategoryId(currSubject) {
      if (currSubject && currSubject.periodCode) {
        let strParams = {
          periodCode: currSubject.periodCode,
          subjectCode: currSubject.subjectCode,
        }
        return this.getInvokeData(
          3,
          strParams,
          this.userInfo.userGuid || '',
        ).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            // textbookVersionCode
            // gradeCode
            // volumeCode
            let paramValue = res.data.paramValue
            return [
              paramValue['textbookVersionCode'],
              paramValue['gradeCode'],
              paramValue['volumeCode'],
            ].join('')
          }
        })
      }
    },
    async onCheckEditQuesiton(questionItem) {
      // @NotNull(message = "学段学科不能为空") Integer subjectCode,
      // @NotNull(message = "试题来源不能为空") Integer source,
      // @NotBlank(message = "试题id不能为空") String questionId,
      // @NotNull(message = "编辑类型不能为空") Integer editType,
      // String questionSource,
      // String grade,
      // String year
      // 判断是否 还有编辑的次数
      if (questionItem.questionInfo.editType == 1) {
        let code = await this.apiGet(
          API.RESOURCE_EDIT_CANADAPTED,
          {},
          { authCode: 1 },
        ).then(
          (res) => {
            if (res.code === CTS.constant.SUCCESS_CODE) {
              return 1
            } else {
              return res.code
            }
          },
          (err) => {
            console.log(err)
            return '1011'
          },
        )

        if (code == '1010' || code == '1011') {
          CpWarningDialog.install({
            code: code + '',
            onBuyVip: (v) => {
              if (v === 2) {
                this.$router.push({
                  path: '/open/campus/service',
                })
              } else {
                // CpBuyVip.install({})
              }
            },
          })
          return
        }
      }

      let questionSource = ''
      let grade = ''
      let year = ''

      if (questionItem.questionInfo.questionSource) {
        questionSource = questionItem.questionInfo.questionSource.code
      }
      if (questionItem.questionInfo.grade) {
        grade = questionItem.questionInfo.grade.code
      }
      if (questionItem.questionInfo.year) {
        year = questionItem.questionInfo.year.code
      }
      let queryparam = {
        source: questionItem.questionInfo.source,
        qid: questionItem.questionInfo.questionId,
        et: questionItem.questionInfo.editType,
        qs: questionSource,
        gr: grade,
        year: year,
      }
      this.$router.push({ path: '/question/edit', query: queryparam })
    },
    onCheckSimilarQuesiton(questionItem) {
      if (!isLogin()) {
        this.$refs.appLogin.showLogin()
      } else {
        if (this.$refs.simailarDialog) {
          let httpParams = {
            period: this.currSubject.periodCode,
            subjectCode: this.currSubject.subjectCode,
            excludeQids: questionItem.questionId,
            pageNum: 1,
            pageSize: 5,
          }
          this.$refs.simailarDialog.show(questionItem, httpParams)
        }
      }
    },
    // 推荐试题
    onRecommendQuestion(questionItem) {
      if (!isLogin()) {
        this.$refs.appLogin.showLogin()
      } else {
        if (this.$refs.recommendQuestionRef) {
          this.$refs.recommendQuestionRef.show(questionItem)
        }
      }
    },
    // -----------------------分割线 ------------------
    // 监听试题评分
    onChangeRateScore(rateScore, questionId) {
      let parms = {
        period: this.currSubject.periodCode,
        subjectCode: this.currSubject.subjectCode,
        questionId: questionId,
        rateScore: rateScore,
      }
      this.newPost(API.QUESTION_TATESCORE, parms).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$message.success('已对题目评分，感谢您的评价！')
        }
      })
    },
    // 监听查看试题详情
    async onCheckQuestionDetail(questionItem) {
      if (!isLogin()) {
        this.$refs.appLogin.showLogin()
      } else {
        let qscource = ''
        let year = ''
        let source = questionItem.source || '1'
        let useCount = ''
        let updateTime = ''

        if (questionItem && questionItem.questionInfo) {
          if (questionItem.questionInfo.questionSource) {
            qscource = questionItem.questionInfo.questionSource.code || ''
          }
          if (questionItem.questionInfo.year) {
            year = questionItem.questionInfo.year.code || ''
          }
          if (questionItem.questionInfo.useCount) {
            useCount = questionItem.questionInfo.useCount || 0
          }
          if (questionItem.questionInfo.updateTime) {
            updateTime = questionItem.questionInfo.updateTime || ''
          }
        }
        let queryStr =
          '?questionId=' +
          questionItem.questionInfo.questionId +
          '&source=' +
          source +
          '&qscource=' +
          qscource +
          '&year=' +
          year
        if (useCount) {
          queryStr += '&useCount=' + useCount
        }
        //  学段学科 已传进去
        if (this.currSubject.subjectCode) {
          queryStr += '&subject=' + this.currSubject.subjectCode
        }

        if (updateTime) {
          queryStr += '&ut=' + updateTime
        }

        this.openWindowLink(this.$router.resolve('/question/detail').href+queryStr)
      }
    },
    // 监听收藏试题
    onCollectQuestion(questionItem) {
      if (!isLogin()) {
        this.$refs.appLogin.showLogin()
        return
      }
      // * @apiParam {String} questionType 试题类型
      //      * @apiParam {String} difficulty 难度
      //      * @apiParam {String} questionSource 试题来源
      //      * @apiParam {String} grade 年级

      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        questionId: questionItem.questionId,
        isCollect: questionItem.isCollect === 1 ? 2 : 1,
        source: questionItem.source || 1,
      }

      let set = {
        authCode: 1,
      }
      this.newPost(API.COLLECT_QUESTION, parms, set).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          questionItem.isCollect = questionItem.isCollect === 1 ? 2 : 1
          this.$refs.collectMessage.showMessage(questionItem.isCollect === 1)
          if (this.onCollectQuestionEnd) {
            this.onCollectQuestionEnd()
          }
        } else {
          if (res.msg === '1002') {
            CpWarningDialog.install({
              code: '1002',
              onBuyVip: (v) => {
                if (v === 2) {
                  this.$router.push({
                    path: '/open/campus/service',
                  })
                } else {
                  // CpBuyVip.install({})
                }
              },
            })
          } else {
            this.$message.error(res.msg)
          }
        }
      })
    },
    // 监听显示试题纠错提示框
    onShowReportDialog(questionItem) {
      if (!isLogin()) {
        this.$refs.appLogin.showLogin()
      } else {
        let parms = {
          token: getToken(),
        }
        this.$refs.reportDialog.showDialog(questionItem)
        // this.wayGet(API.TOKEN_VERIFY, parms).then((res) => {
        //   if (res.code === CTS.constant.SUCCESS_CODE) {
        //     this.$refs.reportDialog.showDialog(questionItem)
        //   } else {
        //     this.$refs.appLogin.showLogin()
        //     this.$message.error('验证已经失效，请重新登录!')
        //   }
        // })
      }
    },
    // 监听试题纠错提交
    onReportError(formData, questionItem) {
      let parms = {
        period: this.currSubject.periodCode,
        subjectCode: this.currSubject.subjectCode,
        questionId: questionItem.questionInfo.questionId,
        errorType: formData.errorType.join(','),
        errorDescription: formData.errorDescription,
        source: questionItem.source || 1,
      }
      let set = {
        authCode: 1,
      }
      this.newPost(API.QUESTION_CORRECTION, parms, set).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$refs.reportDialog.hideDialog()
          this.$message.success('纠错已提交！')
        }
      })
    },
    // 监听添加试题到试题篮
    onAddQuestionBox(questionItem, event) {
      // 判断有没有登录
      if (!isLogin()) {
        this.$refs.appLogin.showLogin()
        return
      }
      let parms = {
        questionId: questionItem.questionInfo.questionId,
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        typeName: questionItem.questionInfo.quesType.name || 'xiajiba',
        type: questionItem.questionInfo.quesType.code,
        source: questionItem.source || 1,
      }
      let set = {
        authCode: 0,
      }
      this.newPost(API.ADD_QUESTION_BOX, parms, set).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          // this.$message.success('成功添加到试题篮!')
          questionItem.isQuestionBox = 1
          this.Bus.$emit('addBasket', questionItem.questionInfo.questionId)
          this.$nextTick(() => {
            this.animateAddBox(questionItem.questionInfo.questionId)
          })
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 监听移除试题从试题篮
    onDeleteQuestionBox(questionItem) {
      // 判断有没有登录
      if (!isLogin()) {
        this.$refs.appLogin.showLogin()
        return
      }
      let parms = {
        questionId: questionItem.questionInfo.questionId,
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        source: questionItem.source || 1,
        is2Recycle: questionItem.is2Recycle,
        type: questionItem.questionInfo.quesType.code,
        removeType: 1,
      }
      let set = {
        authCode: 1,
      }
      this.newPost(API.DELETE_BASKET, parms, set).then((res) => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          // this.$message.success('移除试题!')
          questionItem.isQuestionBox = 0
          this.Bus.$emit('refreshBasket', questionItem.questionInfo.questionId)
          /* if (showView) { // 试题详情页移出试题篮
            this.Bus.$emit('deleteBasketDetail', questionItem.questionInfo.questionId)
          } else {

          } */
          this.$nextTick(() => {
            this.animateRemoveBox(questionItem.questionInfo.questionId)
          })
        }
      })
    },
    // 添加试题篮动画
    animateAddBox(questionId) {
      const questionLi = document.getElementById(questionId)
      const basketBtn = document.getElementById('basket-btn')
      const questionLiRect = questionLi.getBoundingClientRect()
      const basketBtnRect = basketBtn.getBoundingClientRect()
      const scrollTop = document.documentElement.scrollTop // 获取滚动条高度
      const questionLiClone = questionLi.cloneNode(true) // 复制节点
      const ul = document.createElement('ul')
      ul.appendChild(questionLiClone)
      document.body.appendChild(ul)
      ul.style.cssText = `
        background-color: #fff;
        position: absolute;
        top: ${questionLiRect.top + scrollTop}px;
        left: ${questionLiRect.left}px;
        width: ${questionLiRect.width}px;
        height: ${questionLiRect.height}px;
        z-index: 10;
        opacity: 1;
        overflow: hidden;
        transition: 0.8s;
      `
      const disX = basketBtnRect.left - questionLiRect.left + 20
      const disY = basketBtnRect.top - questionLiRect.top + 50
      /* eslint-disable */
      let rf = ul.offsetHeight
      /* eslint-enable */
      ul.style[transform] = `translate3d(${disX}px, ${disY}px, -100px)`
      ul.style[transformOrigin] = 'right bottom'
      ul.style.cssText += `
        opacity: 0.5;
        width: 10px;
        height: 10px;
      `
      setTimeout(() => {
        // console.log('end add')
        document.body.removeChild(ul)
      }, 800)
    },
    // 移除试题篮动画
    animateRemoveBox(questionId) {
      const questionLi = document.getElementById(questionId)
      const basketBtn = document.getElementById('basket-btn')
      const questionLiRect = questionLi.getBoundingClientRect()
      const basketBtnRect = basketBtn.getBoundingClientRect()
      const scrollTop = document.documentElement.scrollTop // 获取滚动条高度
      const questionLiClone = questionLi.cloneNode(true) // 复制节点
      const ul = document.createElement('ul')
      ul.appendChild(questionLiClone)
      document.body.appendChild(ul)
      ul.style.cssText = `
        background-color: #fff;
        position: absolute;
        top: ${basketBtnRect.top + scrollTop}px;
        left: ${basketBtnRect.left}px;
        width: ${basketBtnRect.width}px;
        height: ${basketBtnRect.height}px;
        z-index: 10;
        opacity: 0;
        overflow: hidden;
        transition: 0.8s;
      `
      const disX = questionLiRect.left - basketBtnRect.left
      const disY = questionLiRect.top - basketBtnRect.top
      /* eslint-disable */
      let rf = ul.offsetHeight
      /* eslint-enable */
      ul.style[transform] = `translate3d(${disX}px, ${disY}px, -100px)`
      ul.style[transformOrigin] = 'right bottom'
      ul.style.cssText += `
        opacity: 1;
        width: ${questionLiRect.width}px;
        height: ${questionLiRect.height}px;
      `
      setTimeout(() => {
        // console.log('end remove')
        document.body.removeChild(ul)
      }, 800)
    },
    // 监听显示登录弹框
    onShowLogin() {
      this.$refs.appLogin.showLogin()
    },
    // 监听试题答案解析
    onToggleExplain(questionItem, questionIndex) {
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
      let currQuestionItem = questionItem
      if (currQuestionItem.showExplain) {
        this.$set(currQuestionItem, 'showExplain', false)
        this.$set(currQuestionItem, 'showKnowledge', false)
      } else {
        let parms = {
          period: this.currSubject.periodCode,
          subjectCode: this.currSubject.subjectCode,
          isVerify: false,
          questionId: questionItem.questionInfo.questionId,
          source: questionItem.source,
        }
        let set = {
          authCode: 1,
        }
        // SCHOOL_QUES_GETQUESINFO BACK_QUES_LIST_EXPLAIN
        this.apiGet(API.SCHOOL_QUES_GETQUESINFO, parms, set).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.$set(currQuestionItem, 'showExplain', true)
            this.$set(currQuestionItem, 'showKnowledge', true)
            let editType = currQuestionItem.questionInfo.editType
            res.data.editType = editType
            currQuestionItem.questionInfo = res.data
          }
        })
      }
    },
    // 监听试题详情答案解析
    onToggleExplainDetail() {
      this.questionDetail.showExplain = !this.questionDetail.showExplain
      this.questionDetail.showKnowledge = !this.questionDetail.showKnowledge
    },
    getCurrQuestionId(cques) {
      if (cques && cques.questionInfo) {
        return cques.questionInfo.questionId || ''
      } else {
        return ''
      }
    },
  },
}

export default questionItemMixin
