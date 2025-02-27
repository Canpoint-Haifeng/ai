<template>
  <div class="edit-word-content">
    <CpSteps :active-status="activeStatus" />

    <div class="cp-halving-line" />

    <div class="execute-ques-panel">
      <div class="execute-ques-left">
        <div class="execute-ques-box">
          <div class="execute-ques-title">
            <span>试卷题号：<i class="r">{{ currentIndex + 1 }}</i></span>
          </div>
          <div class="execute-ques-content">
            <div class="c-edit-box">
              <span
                class="c-edit-btn"
                @click="openEditQuestion"
              ><i class="icon iconfont icon-bianji" />编辑</span>
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
            <cpTreePopover
              :main-points-tree="mainPointsTree"
              @change-attributes="changeAttributes"
            />
            <!-- <cp-cascader-search v-if="mainPointCid" :mainPointsTree="mainPointsTree" :mainPointCid="mainPointCid"
              :attrVals="mainPointsVals" @changeAttributes="changeAttributes">
            </cp-cascader-search> -->
            <div class="attr-list clearfix">
              <span
                v-for="(sub, subindex) in mainPointsList"
                :key="'attrcell' + subindex"
              >
                <span>{{ sub.name }}</span>
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
      </div>
      <div class="execute-ques-right">
        <div class="execute-ques-box">
          <div class="execute-ques-title">
            <span>题号卡</span>
          </div>
          <div class="execute-ques-content">
            <div class="execute-ques-line-info">
              <span class="ques-flag-state s" />
              需要补充信息
            </div>
            <div class="execute-ques-line-info">
              <span class="ques-flag-state f" />
              已完成标记
            </div>
            <div class="execute-ques-list">
              <span
                v-for="(sub, index) in questionList"
                :key="sub.id"
                :class="{ s: !sub.isLabel, f: sub.isLabel }"
                class="ques-flag-state line"
                @click="selectQuestionTap(index)"
              >{{ index + 1 }}</span>
            </div>

            <div class="save-ques-box">
              <el-button
                type="primary"
                class="btn execute-save-ques"
                @click="savePaper"
              >
                保存试卷
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="save-ques-box box-bottom">
      <el-button
        v-if="currentIndex < questionList.length - 1"
        type="primary"
        class="btn execute-save-ques-next"
        @click="saveAndNext"
      >
        保存，下一题
      </el-button>
      <el-button
        v-else
        type="primary"
        class="btn execute-save-ques-next"
        @click="saveAndNext"
      >
        保存
      </el-button>
    </div>

    <popup-separate-question
      ref="separateQuestionRef"
      @change-q-structure="getCurrentQuestion"
    />

    <cp-message-dialog ref="cpMessageDialog" />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'

import {
  CpSteps,
  RenderQuestion,
  cpCascaderSearch,
  CpMessageDialog,
  cpTreePopover,
} from '@/components/CpFan/index.js'
import { mapState } from 'vuex'
import questionAttributeMixin from '@/common/mixins/questionAttributeMixin.js'
import popupSeparateQuestion from '@/components/Dialog/popup-separate-question'
import { verifyQuestion } from '@/common/js/question-verify.js'
export default {
  computed: {
    ...mapState(['currSubject']),
  },
  components: {
    CpSteps,
    RenderQuestion,
    cpCascaderSearch,
    popupSeparateQuestion,
    CpMessageDialog,
    cpTreePopover
  },
  mixins: [questionAttributeMixin],
  data() {
    return {
      activeStatus: 2,
      stageSubject: '',
      currentIndex: 0,
      currentQues: null,
      questionList: [],
      mainPointCid: '',
      mainPointsTree: [],
      mainPointsVals: [],
      mainPointsList: [],
      difficultyList: [],
      difficultyValue: '',
    }
  },
  mounted() {
    this.stageSubject = this.currSubject.periodCode + '' + (this.currSubject.subjectCode + '').slice(2, 4)

    this.getpaperQues()
    this.initAttribute()
    this.getDifficultyDict()
  },
  methods: {
    getCurrentQuestion() {
      this.getpaperQues()
    },
    openEditQuestion() {
      this.$refs['separateQuestionRef'].openEditQuestion(this.currentQues)
    },
    async initAttribute() {
      this.mainPointCid = Number(this.$route.query.id)
      let parms = {
        catalogueType: 11,
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      const url = '/lesson-app/config/getCatalogueTree'
      this.apiGet({ urlPath: url }, parms).then(res => {
        if (res) {
          console.log(this.returnTreeData(res.data));
          this.mainPointsTree = this.returnTreeData(res.data)
        }
      })
    },
    returnTreeData(data) {
      return data.map(v => {
        if (v.children) {
          return {
            ...v,
            id: v.uuid,
            code: v.uuid,
            label: v.name,
            children: this.returnTreeData(v.children)
          }
        } else {
          return {
            ...v,
            id: v.uuid,
            code: v.uuid,
            label: v.name,
          }
        }
      })
    },
    async renderAttributes(v) {
      this.mainPointsVals = v
      if (!v.length) {
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
    getPointsVals(data) {
      console.log(data, this.mainPointsVals);
      let flag = false
      if (this.mainPointsVals.length) {
        this.mainPointsVals.forEach(v => {
          if (v.id === data.id) {
            flag = true
          }
        })
        if (!flag) {
          this.mainPointsVals.push(data)
        }
      } else {
        this.mainPointsVals = [data]
      }
    },
    changeAttributes(v) {
      this.getPointsVals(v)
      // this.mainPointsVals = v
      this.mainPointsList = this.mainPointsVals
      console.log(this.mainPointsList);
      this.demarcateAttr()
      // this.renderAttributes(v)
    },
    removeMainPoint(v) {
      this.mainPointsVals = this.mainPointsVals.filter(item => item.code !== v)
      this.mainPointsList = this.mainPointsVals

      // 删除 主知识点
      // let index = -1
      // let len = this.mainPointsVals.length
      // let list = []
      // for (let i = 0; i < len; i++) {
      //   let sub = this.mainPointsVals[i]
      //   // eslint-disable-next-line eqeqeq
      //   if (sub == v) {
      //     index = i
      //   } else {
      //     list.push(sub)
      //   }
      // }
      // if (index !== -1) {
      //   this.mainPointsVals = list
      this.demarcateAttr()
      //   this.renderAttributes(list)
      // }
    },
    openMessage(params) {
      this.$refs.cpMessageDialog.show(params)
    },
    getpaperQues() {
      let baseUrl = {
        urlPath: '/paper-builder/personal/paperQues',
      }
      let params = { paperId: this.$route.query.paperId }
      this.apiGet(baseUrl, params, { showLoading: true }).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          if (res.data && res.data.length > 0) {
            this.questionList = res.data
            this.selectQuestionTap(this.currentIndex)
          } else {
            this.questionList = []
          }
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
      // let list = await this.getCategoryFirstLevel(
      //   CTS.cfgDict.CID_QUESTION_DIFF,
      // )
      this.difficultyList = [
        {
          code: '1',
          name: '易'
        },
        {
          code: '2',
          name: '较易'
        },
        {
          code: '3',
          name: '中等'
        },
        {
          code: '4',
          name: '难'
        },
        {
          code: '5',
          name: '较难'
        },
      ]
    },
    // ---------------------- 获取 试题信息
    quesDetails(row) {
      let baseUrl = {
        urlPath: '/paper-builder/personal/quesDetails',
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
        urlPath: '/paper-builder/personal/demarcateAttr',
      }
      let explain = this.getExplain(this.currentQues)
      if (explain && explain.attrId) {
        let pm = { '100198': { master: this.mainPointsVals.map((item) => item.uuid) } }
        if (this.difficultyValue != '') {
          pm['100186'] = parseInt(this.difficultyValue)
        }
        let params = {
          attrId: explain.attrId,
          paperId: this.$route.query.id,
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
    saveAndNext() {
      let result = verifyQuestion(this.currentQues, 1, null)
      if (result && result.code === 0) {
        this.$message({ type: 'error', showClose: true, message: result.msg })
        // this.openMessage({ content: result.msg})
        return false
      }
      // 保存下一题
      let baseUrl = {
        urlPath: '/paper-builder/personal/saveAndNext',
      }
      let params = {
        paperId: this.$route.query.paperId,
        sourceId: this.currentQues.id,
      }

      // 判断 当前试题是否有答案

      this.apiPost(baseUrl, params, { showLoading: true }).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$message({
            type: 'success',
            message: '保存成功!',
          })
          let item = this.questionList[this.currentIndex]
          if (item) {
            item.isLabel = 1
          }
          if (this.currentIndex < this.questionList.length - 1) {
            this.selectQuestionTap(this.currentIndex + 1)
          }
        } else {
          this.openMessage({
            content:
              '题目知识点、客观题答案不能为空，<br />请补充完整后保存！',
          })
        }
      })
    },
    savePaper() {
      let baseUrl = {
        urlPath: '/paper-builder/personal/savePaper',
      }
      let params = {
        schoolPaperId: this.$route.query.paperId,
      }
      this.apiPost(baseUrl, params, { showLoading: true }).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$router.push({ path: './papers' })
        } else {
          this.$message({
            type: 'error',
            showClose: true,
            message: res.msg,
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.edit-word-content {
  background-color: #ffffff;
  padding-top: 50px;
  margin-bottom: 70px;
}

.execute-ques-panel {
  padding-top: 10px;
  width: 1200px;
  display: flex;
  justify-content: space-around;

  .execute-ques-left {
    width: 874px;
  }

  .execute-ques-right {
    width: 270px;
  }
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
    height: 390px;
    overflow-y: auto;
  }
}

.execute-ques-line-info {
  margin-bottom: 15px;
}

.ques-flag-state {
  display: inline-block;
  vertical-align: middle;
  margin-right: 15px;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  line-height: 28px;
  text-align: center;
  cursor: pointer;

  &.s {
    border: 1px solid #ff6e5d;
    color: #ff6e5d;
  }

  &.f {
    background: #f6f6f6;
    border: 1px solid #eeeeee;
  }

  &.line {
    margin-bottom: 20px;
  }
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

.execute-save-ques-next {
  width: 130px;
  height: 40px;
  background: #ffffff;
  border-radius: 20px;
  font-size: $font-size-medium;
  color: $color-button-d;

  &:hover {
    color: $color-button-d-hover;
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
  margin-right: 10px;
}

.attr-list {
  width: 100%;
  padding: 10px 0;

  &>span {
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
</style>
