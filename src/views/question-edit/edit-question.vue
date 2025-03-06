<template>
  <div class="edit-question-box">
    <div class="execute-ques-box">
      <div class="execute-ques-title clearfix">
        <span>{{ questionTypeName || '' }}</span>
        <span
          class="save-question-btn"
          @click="selfQuesEditSave"
        >保存此题</span>
      </div>
      <div class="execute-ques-content">
        <div class="c-edit-box">
          <span
            class="c-edit-btn"
            @click="openEditQuestion"
          >
            <i class="iconfont iconbianji" />编辑
          </span>
        </div>
        <render-question
          v-if="currentQues"
          :ques="currentQues"
          :show-explain="true"
          :stage-subject="stageSubject"
        />
      </div>
    </div>

    <div class="execute-ques-box box-top">
      <div class="execute-ques-title">
        <span>知识点</span>
      </div>
      <div class="execute-ques-attribute knowledge">
        <cp-cascader-search
          v-if="mainPointCid"
          :searchpopwidth="searchpopwidth"
          :main-points-tree="mainPointsTree"
          :main-point-cid="mainPointCid"
          :attr-vals="mainPointsVals"
          @change-attributes="changeAttributes"
        />
        <div class="attr-list clearfix">
          <span
            v-for="(sub, subindex) in mainPointsList"
            :key="'attrcell' + subindex"
          >
            <span v-html="sub.name" />
            <i
              class="el-icon-error attrs-close"
              @click="removeMainPoint(sub.code)"
            />
          </span>
        </div>
      </div>
    </div>
    <div class="execute-ques-box box-around">
      <div class="execute-ques-title">
        <span>难易度</span>
      </div>
      <div class="execute-ques-attribute">
        <el-radio-group
          v-model="difficultyValue"
          @change="demarcateAttr"
        >
          <el-radio
            v-for="sub in difficultyList"
            :key="sub.code"
            :label="sub.code"
          >
            {{ sub.name }}
          </el-radio>
        </el-radio-group>
      </div>
    </div>

    <popup-separate-question
      ref="separateQuestionRef"
      @change-q-structure="getCurrentQuestion"
    />

    <cp-message-dialog ref="cpMessageDialogRef" />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
  import CTS from '@/common/js/constant'
  import { API } from '@/api/config'
  import {
    RenderQuestion,
    cpCascaderSearch,
    CpMessageDialog,
  } from '@/components/CpFan/index.js'
  import { mapState } from 'vuex'
  import questionAttributeMixin from '@/common/mixins/questionAttributeMixin'
  import popupSeparateQuestion from '@/components/Dialog/popup-separate-question'
  import { verifyQuestion } from '@/common/js/question-verify'
  export default {
    components: {
      RenderQuestion,
      cpCascaderSearch,
      popupSeparateQuestion,
      CpMessageDialog,
    },
    setup() {
      const cpMessageDialogRef = ref(null)
      const separateQuestionRef = ref(null)
      
      // Rest of setup logic will go here
      
      return {
        cpMessageDialogRef,
        separateQuestionRef
      }
    },
    computed: {
      ...mapState(['currSubject']),
    },
    mixins: [questionAttributeMixin],
    data() {
      return {
        activeStatus: 1,
        stageSubject: '',
        searchpopwidth: '1120px',
        currentIndex: 0,
        currentQues: null,
        questionList: [],
        mainPointCid: '',
        mainPointsTree: [],
        mainPointsVals: [],
        mainPointsList: [],
        difficultyList: [],
        difficultyValue: '',
        questionTypeMainId: '',
        questionTypeName: '',
        isPaper: '',
      }
    },
    mounted() {
      this.stageSubject = this.currSubject.subjectCode

      this.initAttribute()
    },
    methods: {
      selfQuesEditSave() {
        if (this.mainPointsVals.length <= 0) {
          this.$message.error('请选择知识点')
          return
        }
        if (!this.difficultyValue) {
          this.$message.error('请选择难易度')
          return
        }

        let result = verifyQuestion(this.currentQues, 1, {
          '100198': { master: 2 },
          '100186': 2,
        })
        if (result && result.code === 0) {
          this.$message({ type: 'error', showClose: true, message: result.msg })
          return false
        }
        if (this.$route.query.paper) {
          this.saveQuesAdapted()
        } else {
          this.saveMyQuestion()
        }
      },
      saveQuesAdapted() {
        let baseUrl = {
          urlPath:
            import.meta.env.VITE_PAPER_GENERATOR + '/testPaper/quesAdapted',
        }
        if (this.currentQues) {
          let params = {
            period: this.currSubject.periodCode,
            subject: this.currSubject.subjectCode,
            questionId: this.currentQues.question.questionId,
            editType: this.$route.query.et,
          }
          this.apiPost(baseUrl, params).then(res => {
            if (res.code === CTS.constant.SUCCESS_CODE) {
              this.$message({
                type: 'success',
                showClose: true,
                message: '保存成功',
              })
              this.gobackPrevious()
            } else {
              this.$message({
                type: 'error',
                showClose: true,
                message: res.msg,
              })
            }
          })
        }
      },
      saveMyQuestion() {
        let baseUrl = {
          urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/selfQues/edit/save',
        }
        if (this.currentQues) {
          let params = {
            questionId: this.currentQues.question.questionId,
            editType: this.$route.query.et,
          }
          this.apiPost(baseUrl, params).then(res => {
            if (res.code === CTS.constant.SUCCESS_CODE) {
              this.$message({
                type: 'success',
                showClose: true,
                message: '保存成功',
              })
              this.gobackPrevious()
            } else {
              this.$message({
                type: 'error',
                showClose: true,
                message: res.msg,
              })
            }
          })
        }
      },
      gobackPrevious() {
        this.$router.go(-1)
      },
      getCurrentQuestion() {
        this.getpaperQues()
      },
      openEditQuestion() {
        this.currentQues.editType = this.$route.query.et
        this.$refs['separateQuestionRef'].openEditQuestion(this.currentQues, 1)
      },
      async initAttribute() {
        let mCid = await this.getRelationCategoryId(
          CTS.cfgDict.CID_KNOWLEDGE_PERIOD_SUBJECT,
          this.stageSubject,
        )
        if (mCid) {
          let list = await this.getCategoryFirstLevel(mCid)
          if (list) {
            this.mainPointCid = mCid
            this.mainPointsTree = list
          }
        }

        this.getDifficultyDict()
        this.getpaperQues()
      },
      async renderAttributes(v) {
        this.mainPointsVals = v
        if (v.length > 0) {
          let list = [{ categoryId: this.mainPointCid, codes: v.join(',') }]
          let res = await this.getNameByCidCodes(list)
          if (res) {
            let result = []
            if (res.data[0] && res.data[0].dictData) {
              result = res.data[0].dictData
            }
            this.mainPointsList = result
          }
        } else {
          this.mainPointsList = []
        }
      },
      changeAttributes(v) {
        this.mainPointsVals = v
        this.demarcateAttr()
        this.renderAttributes(v)
      },
      removeMainPoint(v) {
        // 删除 主知识点
        let index = -1
        let len = this.mainPointsVals.length
        let list = []
        for (let i = 0; i < len; i++) {
          let sub = this.mainPointsVals[i]
          // eslint-disable-next-line eqeqeq
          if (sub == v) {
            index = i
          } else {
            list.push(sub)
          }
        }
        if (index !== -1) {
          this.mainPointsVals = list
          this.demarcateAttr()
          this.renderAttributes(list)
        }
      },
      openMessage(params) {
        cpMessageDialogRef.value.show(params)
      },
      getpaperQues() {
        let baseUrl = {
          urlPath: import.meta.env.VITE_PAPER_GENERATOR + '/selfQues/edit',
        }

        let queryparam = this.$route.query
        let params = {
          subjectCode: this.currSubject.subjectCode,
          source: queryparam.source,
          questionId: queryparam.qid,
          editType: queryparam.et,
          questionSource: queryparam.qs,
          grade: queryparam.gr,
          year: queryparam.year,
        }
        this.apiPost(baseUrl, params, { showLoading: true }).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.currentQues = res.data
            this.onRenderAttribute()
          } else {
            this.$message({
              type: 'error',
              showClose: true,
              message: res.msg,
            })
          }
        })
      },
      selectQuestionTap(index) {
        let item = this.questionList[index]
        this.currentIndex = index
        if (item) {
          this.quesDetails(item)
        }
      },
      // 获取 预估难度
      async getDifficultyDict() {
        let list = await this.getCategoryFirstLevel(
          CTS.cfgDict.CID_QUESTION_DIFF,
        )
        this.difficultyList = list
      },
      // ---------------------- 获取 试题信息
      quesDetails(row) {
        let baseUrl = {
          urlPath:
            import.meta.env.VITE_PAPER_GENERATOR + '/school/paper/quesDetails',
        }
        let params = { id: row.id }
        this.apiGet(baseUrl, params, { showLoading: true }).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.currentQues = res.data
            this.onRenderAttribute()
          } else {
            this.$message({
              type: 'error',
              showClose: true,
              message: res.msg,
            })
          }
        })
      },
      onRenderAttribute() {
        let explain = this.getExplain(this.currentQues)

        if (explain && explain.attrs) {
          let attrs = explain.attrs

          if (attrs['100186'] == '') {
            this.difficultyValue = ''
          } else {
            this.difficultyValue = attrs['100186'] + ''
          }
          if (attrs['100198'] && attrs['100198'].master) {
            this.mainPointsVals = attrs['100198'].master
          } else {
            this.mainPointsVals = []
          }

          this.renderAttributes(this.mainPointsVals)
        } else {
          this.mainPointsVals = []
          this.difficultyValue = ''
          this.renderAttributes(this.mainPointsVals)
        }

        // 显示 试题类型
        this.onRenderQuestionType()
      },
      onRenderQuestionType() {
        if (!this.questionTypeMainId) {
          let parms = {
            categoryId: CTS.cfgDict.CID_QUESTION_PERIOD_SUBJECT_TYPE,
            code: this.currSubject.subjectCode,
            level: '2',
          }
          this.wayGet(API.GET_CHILD_DICT, parms).then(res => {
            if (res.code === CTS.constant.SUCCESS_CODE) {
              if (res.data && res.data.length) {
                this.questionTypeMainId = res.data[1].relationCategoryId
                this.getQuestionTypeName()
              }
            }
          })
        } else {
          this.getQuestionTypeName()
        }
      },
      getQuestionTypeName() {
        let parms = {
          categoryId: this.questionTypeMainId,
          code: this.currentQues.question.questionType.substring(2),
        }
        console.log(parms)
        this.wayGet(API.GET_CHILD_DICT, parms).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            if (res.data && res.data.length) {
              this.questionTypeName = res.data[0].name
            }
          }
        })
      },
      getExplain(ques) {
        if (ques && ques.explain && ques.explain[0]) {
          return ques.explain[0]
        } else {
          return null
        }
      },
      // 修改试题属性
      demarcateAttr() {
        let baseUrl = {
          urlPath:
            import.meta.env.VITE_PAPER_GENERATOR +
            '/selfQues/edit/demarcateAttr',
        }
        let explain = this.getExplain(this.currentQues)
        if (!explain.attrs) {
          explain.attrs = {}
        }
        if (explain && explain.attrId) {
          let pm = { '100198': { master: this.mainPointsVals } }
          explain.attrs[100198] = { master: this.mainPointsVals }

          if (this.difficultyValue != '') {
            pm['100186'] = parseInt(this.difficultyValue)
            explain['100186'] = parseInt(this.difficultyValue)
          }

          let params = {
            attrId: explain.attrId,
            editType: this.$route.query.et,
            attrs: JSON.stringify(pm),
          }
          this.apiPost(baseUrl, params).then(res => {
            if (res.code === CTS.constant.SUCCESS_CODE) {
            } else {
              this.$message({
                type: 'error',
                showClose: true,
                message: res.msg,
              })
            }
          })
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  
  .edit-question-box {
    margin: 20px auto 70px auto;
    width: 1200px;
    background-color: #ffffff;
    min-height: 500px;
    padding: 20px;
    box-sizing: border-box;
  }

  .edit-word-content {
    background-color: #ffffff;
    padding-top: 50px;
    margin-bottom: 70px;
  }

  .execute-ques-box {
    .execute-ques-title {
      height: 50px;
      line-height: 50px;
      background: #f6f6f6;
      border: 1px solid #e2e2e2;
      border-radius: 6px 6px 0px 0px;
      span {
        font-size: 16px;
        display: inline-block;
        padding: 0 20px;
      }
      .r {
        font-weight: bold;
      }
    }
    .execute-ques-attribute.knowledge {
      min-height: 100px;
    }
    .execute-ques-attribute {
      border: 1px solid #e2e2e2;
      border-top-width: 0;
      padding: 20px;
      border-radius: 0px 0px 6px 6px;
      overflow-y: auto;
    }
    .execute-ques-content {
      border: 1px solid #e2e2e2;
      border-top-width: 0;
      min-height: 20px;
      padding: 20px;
      border-radius: 0px 0px 6px 6px;
      max-height: 390px;
      min-height: 180px;
      overflow-y: auto;
    }
  }
  .execute-ques-line-info {
    margin-bottom: 15px;
  }

  .execute-ques-list {
    padding: 20px 0 30px 0;
    margin-right: -15px;
  }
  .save-ques-box {
    width: 100%;
    text-align: center;
  }
  .execute-save-ques {
    width: 130px;
    height: 40px;
    background: $color-button-d;
    border-radius: 20px;
    font-size: $font-size-medium;
    &:hover {
      background: $color-button-d-hover;
      border: 1px solid $color-button-d-hover;
    }
  }

  .execute-ques-box.box-top {
    margin-top: 16px;
  }
  .execute-ques-box.box-around {
    margin-top: 16px;
    margin-bottom: 37px;
  }
  .btn.execute-save-ques-next {
    padding: 8px 8px;
  }
  .box-bottom {
    padding-bottom: 50px;
  }
  .c-edit-box {
    width: 100%;
    text-align: right;
    .c-edit-btn {
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: $color-button-d;
      cursor: pointer;
      &:hover {
        color: $color-button-d-hover;
      }
    }
  }
  i.iconfont {
    margin-right: 6px;
  }
  .attr-list {
    width: 100%;
    padding: 10px 0;

    & > span {
      position: relative;
      background-color: #f3f6fd;
      border: 1px solid #e2e6ec;
      color: #333333;
      border-radius: 17px;
      padding: 5px 10px;
      line-height: 20px;
      margin: 0 10px 10px 0;
      float: left;
      .attrs-close {
        margin-left: 10px;
        font-size: 15px;
        color: #c0c4cc;
        cursor: pointer;
        &:hover {
          color: #f77f5b;
        }
      }
    }
  }
  :deep(.cp-select-input) {
    width: 100%;
  }
  :deep(.cp-select-component .pop-search-select) {
    width: 1120px;
  }

  .save-question-btn {
    float: right;
    cursor: pointer;
    width: 105px;
    height: 32px;
    background-color: $color-button-d;
    border-radius: 16px;
    text-align: center;
    color: #ffffff;
    line-height: 32px;
    margin-top: 9px;
    margin-right: 19px;
    font-size: 14px;
    &:hover {
      background-color: $color-button-d-hover;
    }
  }
</style>

