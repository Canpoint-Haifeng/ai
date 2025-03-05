<template>
  <div class="paper-operate">
    <div class="item">
      <el-button
        class="btn btn-border"
        @click="showScoreDialog"
      >
        <i class="iconfont icon-pencil_3_line" /> 分值设置
      </el-button>
      <el-button
        class="btn btn-border"
        @click="showAnalysisDialog"
      >
        <i class="iconfont icon-chart_line_line" /> 组卷分析
      </el-button>
    </div>
    <div class="item">
      <el-button
        class="btn btn-border"
        @click="showSaveDialog"
      >
        <i class="iconfont icon-baocun" /> 保存试卷
      </el-button>
      <!-- <el-button class="btn btn-border" @click="showAnswerSheet"
        ><i class="iconfont icondatika"></i></template> 下载答题卡</el-button
      > -->
      <el-button
        class="btn btn-border"
        @click=""
      >
        <i class="iconfont icon-share_3_line" /> 分享组卷
      </el-button>
    </div>

    <div class="item item-save">
      <el-button
        class="btn"
        @click="onShowDownLoadPaper"
      >
        <i class="iconfont icon-plus-download" /> 下载试卷
      </el-button>
    </div>
    <div
      v-if="paperData.zhzyteacher"
      class="zhzyteacher-segment"
    >
      <div
        class="zhzyteacher-task orange"
        @click="onRecommendTask"
      >
        安排学习任务
      </div>
    </div>
    <!-- <div class="share-paper-box" @click="showPaperShare">
      <span class="iconfont iconhaotifenxiang"></span
      ><SharePaperPopover
        ref="sharePaperPopoverRef"
        :subjectCode="currSubject.subjectCode"
        :paperIdEnc="paperIdEnc"
        :source="source"
        :reloadImgUrl="true"
        ><span #reference"></span></SharePaperPopover
      >分享组卷
    </div> -->
    <el-dialog
      v-if="scoreDialog.visible"
      :visible="scoreDialog.visible"
      :title="scoreDialog.title"
      :modal-append-to-body="false"
      :lock-scroll="false"
      :width="scoreDialog.width"
      @update:visible="scoreDialog.visible = $event"
    >
      <div class="score-dialog-content">
        <div class="score-scroll">
          <div class="score-title clearfix">
            <span class="text fl">试卷总分：<em class="total">{{ paperData.totalScore }}</em></span>
            <span
              class="score-empty color-9 fr"
              @click="emptyScore"
            ><i class="iconfont iconnonebg-delete" />清空分数</span>
          </div>
          <div class="score-body font-12">
            <el-row class="score-thead">
              <el-col
                :span="4"
                class="score-col"
              >
                题号
              </el-col>
              <el-col
                :span="5"
                class="score-col"
              >
                难度
              </el-col>
              <el-col
                :span="8"
                class="score-col"
              >
                知识点
              </el-col>
              <el-col
                :span="7"
                class="score-col"
              >
                设置分数
              </el-col>
            </el-row>
            <el-row class="score-tbody">
              <el-row
                v-for="(item, index) in simpleQuestionList"
                :key="index"
                class="score-group"
              >
                <el-row class="group-header">
                  <el-col
                    :span="17"
                    class="score-col"
                  >
                    <span class="title color-3 font-b">{{ (index + 1) | simplifiedChinese }}.
                      {{ item.questionTypeName }}（
                      <strong class="num">{{ item.score }}</strong>分）</span>
                  </el-col>
                  <el-col
                    :span="7"
                    class="score-col"
                  >
                    <cp-number-input
                      ref="scoreInput"
                      v-model="item.pscore"
                      class="operate-cp-number-input"
                      @blur="setScore($event, index)"
                    />
                    <span class="text">分/题</span>
                  </el-col>
                </el-row>
                <el-row
                  v-for="(subItem, subIndex) in item.list"
                  :key="subItem.questionId"
                  class="group-item"
                >
                  <el-col
                    :span="4"
                    class="score-col"
                  >
                    <span class="text">{{ subItem.questionNum }}</span>
                  </el-col>
                  <el-col
                    :span="5"
                    class="score-col"
                  >
                    <span class="text">{{
                      subItem.questionInfo.difficulty | isEmptyObject('name')
                    }}</span>
                  </el-col>
                  <el-col
                    v-if="subItem.questionInfo.knowledge"
                    :span="8"
                    class="score-col"
                  >
                    <el-tooltip
                      placement="top"
                      effect="light"
                      popper-class="custom-popover knowledge-popover"
                    >
                      <template #content>
                        <div>
                          <!-- <span class="text" v-for="(childItem, childIndex) in subItem.questionInfo.knowledge" :key="childIndex">{{childItem.name}},  </span> -->
                          <div
                            v-html="
                              subItem.questionInfo.knowledge
                                .map(item => item.name)
                                .join('  , ')
                            "
                          />
                        </div>
                      </template>
                      <div
                        class="knowledge-col"
                        v-html="
                          subItem.questionInfo.knowledge
                            .map(item => item.name)
                            .join('  , ')
                        "
                      />
                    </el-tooltip>
                  </el-col>
                  <el-col
                    v-else
                    :span="8"
                    class="score-col"
                  >
                    <span class="text">-</span>
                  </el-col>
                  <el-col
                    :span="7"
                    class="score-col"
                  >
                    <cp-number-input
                      v-model="subItem.score"
                      class="operate-cp-number-input"
                      @blur="setItemScore($event, index, subIndex)"
                    />
                    <span class="text">分</span>
                  </el-col>
                </el-row>
              </el-row>
            </el-row>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="btn btn-gray"
            @click="scoreDialog.visible = false"
          >
            取消
          </el-button>
          <el-button
            class="btn btn-shadow"
            @click="commitScore"
          >
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 试卷分析 -->
    <analysis-dialog
      ref="analysisDialog"
      :question-analysis="questionAnalysis"
    />
    <!-- 保存组卷 -->
    <el-dialog
      v-if="saveDialog.visible"
      :visible="saveDialog.visible"
      :title="saveDialog.title"
      :modal-append-to-body="false"
      :lock-scroll="false"
      :width="saveDialog.width"
      @update:visible="saveDialog.visible = $event"
    >
      <div class="save-dialog-content">
        <el-form
          ref="form"
          :model="formData"
          :rules="formRules"
          label-width="95px"
        >
          <el-form-item
            label="试卷名称："
            prop="paperName"
          >
            <el-input
              v-model="formData.paperName"
              class="form-input-paper-maker"
              maxlength="50"
              minlength="2"
            />
          </el-form-item>
          <el-form-item label="">
            <span class="form-item-info color-9 font-12">注：保存后的试卷可在
              <em
                class="text"
                @click="entryMyPaper"
              > 我的组卷-我的卷库 </em>中查看
            </span>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="btn btn-gray"
            @click="saveDialog.visible = false"
          >
            取消
          </el-button>
          <el-button
            class="btn btn-shadow"
            @click="savePaper('form')"
          >
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
import { dealDecimal, checkPaperQuestionSource } from '@/common/js/util'
// import paperPayMixin from '@/common/mixins/paperPayMixin'
import AnalysisDialog from '@/components/AnalysisDialog/AnalysisDialogMaker'
import { CpNumberInput } from '@/components/CpFan/index'
import CpWarningDialog from '@/components/AuthorityVip/CpWarningDialog'
import CpCommonDialog from '@/components/AuthorityVip/CpCommonDialog'
// import DownloadDialog from '@/components/DownloadDialog/DownloadDialog'
import SharePaperPopover from '@/components/PaperItem/SharePaperPopover.vue'

export default {
  // mixins: [ paperPayMixin ],
  components: {
    AnalysisDialog,
    CpNumberInput,
    SharePaperPopover,
    // DownloadDialog
    // BaseDialog
  },
  props: {
    simpleQuestionListScore: {
      type: Array,
      default: () => [],
    },
    paperData: {
      type: Object,
      default: () => {},
    },
    questionsData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    let validateName = (rule, value, callback) => {
      if (value.trim() === '') {
        return callback(new Error('请输入组卷名称'))
      }
      if (value.length < 2 || value.length > 100) {
        return callback(new Error('长度在2到100个字符'))
      }
      if (CTS.constant.inputNameReg.test(value)) {
        return callback(new Error('组卷名称格式错误'))
      } else {
        callback()
      }
    }
    return {
      simpleQuestionList: [],
      // isShowAnswer: false,
      scoreDialog: {
        visible: false,
        title: '分值设置',
        showClose: true,
        width: '600px',
      },
      questionAnalysis: {},
      saveDialog: {
        visible: false,
        title: '保存试卷',
        showClose: true,
        width: '500px',
      },
      formData: {
        paperName: '',
      },
      formRules: {
        paperName: [
          { required: true, validator: validateName, trigger: 'blur' },
        ],
      },
      downloadData: {}, // 保存选择的试卷下载类型
      paperIdEnc: '',
      source: '',
    }
  },
  computed: {
    ...mapState(['currSubject']),
  },
  created() {
    // console.log(this.paperData)
    // this.paperData.totalScore = this.paperData.totalScore
  },
  mounted() {
    // 监听试卷标题修改
    this.Bus.$on('editPaperHeadline', this.onEditPaperHeadline)
    // 监听大题名称修改
    this.Bus.$on('editQuestionTypeName', this.onEditQuestionTypeName)
  },
  unmounted() {
    this.Bus.$off('editPaperHeadline')
    this.Bus.$off('editQuestionTypeName')
  },
  methods: {
    onHomeworkTask() {
      this.openWindowLink(
        'http://cloudprint-teacher-co-*nsole.canpoint.cn/#/set-task',
      )
    },
    async onRecommendTask() {
      if (this.paperData.totalCount <= 0) {
        this.$message.error('当前试卷无试题，请添加试题后下载试卷')
        return
      }
      if (this.paperData.totalCount > 100) {
        this.$message.error('单卷试题请勿选择超过100道')
        return
      }

      let res = await this.savePaperHttp()
      if (res) {
        this.$emit('showRecommendTask', res)
      }
    },
    showAnswerSheet() {
      this.$emit('showAnswerSheet')
    },
    async onShowDownLoadPaper() {
      if (this.paperData.totalCount <= 0) {
        this.$message.error('当前试卷无试题，请添加试题后下载试卷')
        return
      }
      if (this.paperData.totalCount > 100) {
        this.$message.error('单卷试题请勿选择超过100道')
        return
      }
      if (!this.paperData.paperUid) {
        this.$message.error('请先保存试卷')
        return
      }
      return this.$emit('showDownLoadPaper', this.paperData)
      this.czcTrackEvent(['_trackEvent', '组卷预览', '点击下载试卷', '次数'])

      let res = await this.savePaperHttp()
      if (res) {
        this.$emit('showDownLoadPaper', res)
      }
    },
    async showPaperShare() {
      if (this.paperData.totalCount <= 0) {
        this.$message.error('当前试卷无试题，请添加试题后再分享')
        return
      }
      if (checkPaperQuestionSource(this.questionsData)) {
        let res = await this.savePaperHttp()
        if (res) {
          this.paperIdEnc = res.paperIdEnc
          this.source = 1
          this.$nextTick(() => {
            this.$refs.sharePaperPopoverRef.onShow()
          })
        }
      } else {
        this.showMessage('试卷存在上传或改编试题暂不支持分享')
      }
    },
    async savePaperHttp() {
      let flag = await this.checkQuestionSource()
      if (!flag) return
      // 检查paperName 是否有
      let paperName = this.paperData.paperName || this.paperData.paperHeadline
      if (paperName) {
        let parms = {
          stage: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
          paperName: paperName,
        }
        return this.newPost(API.PAPER_SAVE, parms, {
          showLoading: true,
        }).then(
          res => {
            if (res.code === CTS.constant.SUCCESS_CODE) {
              let paperIdEnc = res.data
              this.checkToEditSharePaper(res.data)
              return {
                paperIdEnc: paperIdEnc,
                source: 1,
                paperName: paperName,
              }
            } else if (res.code === CTS.constant.SYSTEM_ERROR_CODE) {
              this.saveDialog.visible = false
              if (res.msg == '1015') {
                // 1015
                CpWarningDialog.install({
                  code: res.msg,
                  resData: res.data || {},
                  onBuyVip: v => {
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
              return null
            } else {
              this.$message.error(res.msg)
              return null
            }
          },
          () => {
            return null
          },
        )
      } else {
        return null
      }
    },
    // 每道题型分值设置
    setScore(event, index) {
      if (!event.target.value) {
        return
      }
      // if (!CTS.constant.scoreReg.test(event.target.value)) {
      //   event.target.value = ''
      //   this.$message.error('请输入正确分数值！')
      //   return
      // }
      let typeTotalScore = 0
      this.paperData.totalScore = 0
      this.simpleQuestionList[index].list.forEach(item => {
        item.score = event.target.value
        typeTotalScore += parseFloat(event.target.value)
      })
      this.simpleQuestionList[index].score = dealDecimal(typeTotalScore, 1)
      this.simpleQuestionList.forEach(item => {
        this.paperData.totalScore += item.score
      })

      this.paperData.totalScore = dealDecimal(this.paperData.totalScore, 1)
      this.$forceUpdate()
    },
    // 每道题分值设置
    setItemScore(event, index, subIndex) {
      if (!event.target.value) {
        return
      }
      // if (!CTS.constant.scoreReg.test(event.target.value)) {
      //   event.target.value = ''
      //   this.$message.error('请输入正确分数值！')
      //   return
      // }
      let typeTotalScore = 0
      this.paperData.totalScore = 0
      this.simpleQuestionList[index].list[subIndex].score = event.target.value
      this.simpleQuestionList[index].list.forEach(item => {
        typeTotalScore += parseFloat(item.score)
      })
      this.simpleQuestionList[index].score = dealDecimal(typeTotalScore, 1)
      this.simpleQuestionList.forEach(item => {
        this.paperData.totalScore += item.score
      })
      this.paperData.totalScore = dealDecimal(this.paperData.totalScore, 1)
      this.$forceUpdate()
    },
    // 清空分数
    emptyScore() {
      this.paperData.totalScore = 0
      this.simpleQuestionList.forEach(item => {
        item.score = 0
        this.$refs.scoreInput[item.typeIndex - 1].value = ''
        item.list.forEach(subItem => {
          subItem.score = 0
        })
      })
      this.$forceUpdate()
    },
    // 显示设置分值提示框
    showScoreDialog() {
      if (this.paperData.totalCount <= 0) {
        this.$message.error('当前试卷无试题，请添加试题后设置分数')
        return
      }
      let list = JSON.parse(JSON.stringify(this.simpleQuestionListScore))
      list.forEach(item => {
        item.pscore = ''
      })
      console.log(list, 111111)
      this.simpleQuestionList = list
      this.scoreDialog.visible = true
    },
    // 提交分值设置分数
    commitScore() {
      let scoreList = {
        totalScore: this.paperData.totalScore,
        questionTypeScoreDtoList: [],
        questionScoreDtoList: [],
      }
      this.simpleQuestionList.forEach(item => {
        scoreList.questionTypeScoreDtoList.push({
          questionType: item.questionType,
          ordinal: item.pordinal,
          score: parseFloat(item.score) || 0,
        })
        item.list.forEach(subItem => {
          scoreList.questionScoreDtoList.push({
            questionId: subItem.questionId,
            score: parseFloat(subItem.score) || 0,
            ordinal: item.pordinal,
          })
        })
      })
      if (!this.paperData.totalScore) {
        this.$message.error('没有设置分数，不能提交哦')
        return
      }
      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        paramsJson: JSON.stringify(scoreList),
      }
      this.newPost(API.QUESTION_SETTING_SCORE, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.scoreDialog.visible = false
          this.$emit('refreshPaper')
        }
      })
    },
    // 监听试卷标题修改
    onEditPaperHeadline(paramsObj) {
      this.paperData.paperHeadline = paramsObj.text
      this.paperData.paperName = paramsObj.text
    },
    // 监听大题名称修改
    onEditQuestionTypeName(paramsObj) {
      this.simpleQuestionList.forEach(item => {
        const index = item.list.findIndex(
          subItem => subItem.questionType === paramsObj.typeCode,
        )
        if (index > -1) {
          item.list[index].questionTypeName = paramsObj.text
          item.list[index].typesInfo.text = paramsObj.text
        }
      })
      console.log('paper-operate.vue')
    },
    showSaveDialogDelay() {
      if (this.paperData.totalCount <= 0) {
        this.$message.error('当前试卷无试题，请添加试题后保存')
        return
      }
      if (this.paperData.totalCount > 100) {
        this.$message.error('单卷试题请勿选择超过100道')
        return
      }

      this.formData.paperName =
        this.paperData.paperName || this.paperData.paperHeadline
      this.saveDialog.visible = true
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    // 显示保存临时试卷提示框
    showSaveDialog() {
      this.eventStatistics(['_trackEvent', '组卷预览', '保存试卷', '次数'])
      setTimeout(() => {
        this.showSaveDialogDelay()
      }, 100)
    },
    // 判断 试卷是否 有 source !=1 的
    checkQuestionSource() {
      if (checkPaperQuestionSource(this.questionsData)) {
        return true
      } else {
        return new Promise((resolve, reject) => {
          CpCommonDialog.openDialog({
            moduleC: 'CpConfigDialog',
            data: {
              cancelHide: true,
              title: '组卷提示',
              content:
                '试卷存在上传或改编试题暂不支持分享，继续操作将取消当前试卷分享。',
              comfirm: state => {
                if (state === 1) {
                  resolve(true)
                } else {
                  resolve(false)
                }
              },
            },
          })
        })
      }
    },
    // 保存 成功后 如果 试题 有 source !=1  需要告诉后端
    checkToEditSharePaper(paperIdEnc) {
      // 试卷存在上传或改编试题暂不支持分享，继续操作将取消当前试卷分享。
      if (!checkPaperQuestionSource(this.questionsData)) {
        let params = {
          paperIdEnc: paperIdEnc,
        }
        this.apiPost(API.CENTER_SHAREPAPER_CHECKTOEDITSHAREPAPER, params).then(
          res => {
            console.log(res)
          },
          () => {},
        )
      }
    },
    // 保存临时试卷为正式试卷
    async savePaper(formName) {
      let flag = await this.checkQuestionSource()
      if (!flag) return
      this.$refs[formName].validate(valid => {
        if (valid) {
          let parms = {
            stage: this.currSubject.periodCode,
            subject: this.currSubject.subjectCode,
            paperName: this.formData.paperName,
          }
          // let url = this.paperData.paperId ? API.PAPER_UPDATE : API.PAPER_SAVE
          this.newPost(API.PAPER_SAVE, parms, { showLoading: true }).then(
            res => {
              if (res.code === CTS.constant.SUCCESS_CODE) {
                // 不调整
                this.saveDialog.visible = false
                this.$message.success('组卷保存成功！')
                this.paperData.paperHeadline = this.formData.paperName
                this.checkToEditSharePaper(res.data)
                this.$emit('refreshPaper')
              } else if (res.code === CTS.constant.SYSTEM_ERROR_CODE) {
                this.saveDialog.visible = false
                if (res.msg == '1015') {
                  // 1015
                  CpWarningDialog.install({
                    code: res.msg,
                    resData: res.data || {},
                    onBuyVip: v => {
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
              } else {
                this.$message.error(res.msg)
              }
            },
          )
        } else {
          return false
        }
      })
    },
    // 显示试卷分析提示框
    showAnalysisDialog() {
      if (this.paperData.totalCount <= 0) {
        this.$message.error('当前试卷无试题，请添加试题后查看试卷分析')
        return
      }
      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      let set = {
        showLoading: true,
        message: '加载中...',
      }
      this.apiGet(API.TEMP_PAPER_ANALYZE, parms, set).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.questionAnalysis = res.data
          this.$refs.analysisDialog.showDialog()
        }
      })
    },

    // 进入我组卷
    entryMyPaper() {
      // this.$router.push({
      //   name: 'myPaper'
      // })
      this.$router.push('/paper/resources/papers')
    },
    // 监听创建试卷订单
    /* onCreateOrder(downloadData) {
    this.downloadData = downloadData
    let parms = {}
    if (this.paperData.paperId) {
      parms = {
        paperId: this.paperData.paperId,
        productDetail: this.paperData.paperName,
        orderType: 1
      }
    } else {
      parms = {
        productDetail: this.paperData.paperHeadline,
        orderType: 1
      }
    }
    this.apiPost(API.CREATE_ORDER, parms).then(res => {
      if (res.code === CTS.constant.SUCCESS_CODE) {
        const result = res.data
        this.$refs.downloadDialog.hideDialog()
        if (result.orderNumCloud) { // 需要支付
          this.payData.orderNumCloud = result.orderNumCloud
          this.payData.amountOrder = result.amountOrder
          this.payData.buyerBalanceAvailable = result.buyerBalanceAvailable
          this.weChatPay()
        } else { // 不需要支付直接下载
          console.log('直接下载')
          this.downloadPaperMaker()
        }
      } else {
        this.$message.error(res.msg)
      }
    })
  }, */
    // 监听组卷下载
    /* downloadPaperMaker() {
    let parms = this.downloadData
    if (this.paperData.paperId) {
      parms.paperId = this.paperData.paperId
    } else {
      parms.period = this.currSubject.periodCode
      parms.subject = this.currSubject.subjectCode
    }
    let set = {
      responseType: 'blob'
    }
    let url = this.paperData.paperId ? API.PAPER_DOWNLOAD : API.TEMP_PAPER_DOWNLOAD
    this.apiPost(url, parms, set).then(res => {
      this.$refs.downloadDialog.hideDialog()
    })
  } */
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.paper-operate {
  // height: 225px;
  background: $color-white;
  margin-bottom: 16px;
  padding: 30px 14px 20px 14px;
  box-sizing: border-box;

  .item {
    margin-bottom: 16px;

    .btn {
      width: 113px;
      height: 40px;
      padding: 0;
      font-size: $font-size-medium;

      &:first-child {
        margin-right: 6px;
      }

      &.btn-border {
        color: $color-text-d;

        i {
          font-size: 14px;
        }
      }
    }

    .btn-border {
      border: 1px solid #e2e2e2;
    }

    .btn-border.is-disabled:hover {
      color: $color-text-d;
      font-size: $font-size-medium;
      background: $color-white;
    }

    .btn-border:hover {
      border: 1px solid $color-theme;
      color: $color-theme;
    }
  }

  .item-download,
  .item-save {
    .btn {
      width: 100%;
    }
  }
}

.score-dialog-content {
  max-height: 500px;
  overflow: hidden;

  .score-scroll {
    padding: 0 20px;
    height: 500px;
    overflow-y: auto;
  }
}

.score-title {
  padding: 20px 0 14px 0;

  .total {
    margin-left: 8px;
    font-weight: bold;
    color: $color-theme-l;
  }

  .score-empty {
    cursor: pointer;
    color: #333333;

    .iconfont {
      margin-right: 2px;
    }

    &:hover {
      color: $color-theme;
    }
  }
}

.score-thead {
  background: $color-table-bg;

  .score-col {
    .text {
      color: $color-text-d;
    }

    &:last-child {
      padding: 0 30px;
    }
  }
}

.score-col {
  padding: 0 13px;
  line-height: 32px;
  text-align: left;
}

.score-group {
  .group-header {
    border-bottom: 1px solid $color-background-l;

    .line {
      display: inline-block;
      width: 2px;
      height: 10px;
      background: $color-theme;
      margin-right: 8px;
    }

    .num {
      color: $color-theme-l;
    }
  }

  .group-item {
    border-bottom: 1px solid $color-background-l;

    .score-col:nth-child(2),
    .score-col:nth-child(3),
    .score-col:nth-child(4) {
      border-left: 1px solid $color-background-l;
    }
  }

  .knowledge-col {
    overflow: hidden;
    white-space: nowrap;
  }

  .score-input {
    width: 70px;
    height: 20px;
    margin-left: 17px;
    line-height: 20px;
    padding: 0 10px;
    box-sizing: border-box;
    border: 1px solid $color-border;
    margin-right: 8px;
  }
}

.save-dialog-content {
  padding: 48px 20px 0;

  .form-item-info {
    .text {
      color: $color-theme;
      cursor: pointer;
    }
  }
}

.operate-cp-number-input {
  width: 100px;
}

.operate-cp-number-input :deep(.el-input__inner)) {
    line-height: 24px;
    padding: 0 10px;
    height: 24px;
    font-size: 12px;
    width: 70px;
    margin-left: 17px;
    border-radius: 4px;
  }
}

.form-input-paper-maker {
  :deep(.el-input__inner)) {
      border-radius: 4px;
    }
  }
}

.share-paper-box {
  text-align: center;
  cursor: pointer;
  user-select: none;

  .iconfont {
    display: inline-block;
    padding-right: 5px;
    color: #fea600;
  }
}

.zhzyteacher-segment {
  padding-bottom: 16px;

  .zhzyteacher-task {
    width: 100%;
    line-height: 40px;
    text-align: center;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    user-select: none;
  }

  .blue {
    background-color: $color-theme;
  }

  .orange {
    background-color: #fea600;

    &:hover {
      background-color: #f87d27;
    }
  }
}
</style>
