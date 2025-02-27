<template>
  <div class="edit-word-content">
    <CpSteps :active-status="activeStatus" />
    <div class="cp-halving-line" />

    <div class="word-edit-panel">
      <div
        v-if="clientHeight"
        class="word-edit-ckeditor"
        :style="{ height: lineHeight }"
      >
        <div class="edit-word-title-tips">
          Word解析
        </div>
        <word-sign-ckeditor
          :ref="wordSignEdit"
          :editid="wordSignEdit"
          :content="wordData.data"
          :showborder="false"
          :client-height="clientHeight"
          @updata-ck-editor-data="updataCkEditorData"
        />
      </div>
      <div class="word-show-paper">
        <div class="edit-word-title-tips">
          预览
        </div>
        <div class="edit-word-questions">
          <div class="question-list-title">
            题型数量：
            <span v-if="selectNum">选择题<span class="r">{{ selectNum }}</span>个
            </span>
            <span v-if="jiedaNum">解答题<span class="r">{{ jiedaNum }}</span>个
            </span>
            <span v-if="jiandaNum">简答题<span class="r">{{ jiandaNum }}</span>个
            </span>
            <span v-if="multiNum">综合题<span class="r">{{ multiNum }}</span>个
            </span>
          </div>
          <div class="question-list-content">
            <render-paper
              :paper-data="splitWordQuesList"
              :stage-subject="stageSubject"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="edit-word-bottom">
      <el-button
        type="primary"
        class="btn edit-btn-next"
        @click="backToPapers"
      >
        返回
      </el-button>
      <el-button
        type="primary"
        class="btn edit-btn-next"
        @click="saveWordPapers"
      >
        保存
      </el-button>
      <el-button
        type="primary"
        class="btn edit-btn-reback"
        @click="clickNextPapers"
      >
        下一步
      </el-button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import wordSignCkeditor from '@/components/CkeditorText/word-sign-ckeditor.vue'
import { splitWordQuestion } from '@/common/js/analysisUtil.js'
import { is } from '@/common/js/util'
import { RenderPaper, CpSteps } from '@/components/CpFan/index.js'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['currSubject']),
  },
  components: {
    wordSignCkeditor,
    RenderPaper,
    CpSteps,
  },
  data() {
    return {
      wordData: {
        data: '',
      },
      wordSignEdit: 'wordSignEdit',
      clientHeight: 800,
      lineHeight: '700px',
      splitWordQuesList: [],
      activeStatus: 1,
      stageSubject: '',
      selectNum: 0,
      multiNum: 0,
      jiandaNum: 0,
      jiedaNum: 0,
    }
  },
  mounted() {
    this.stageSubject = this.currSubject.subjectCode + ''
    this.getWordData()
  },
  methods: {
    saveWordPapers() {
      let baseUrl = {
        urlPath:
          '/paper-builder/personal/saveWordData',
      }
      let wordData = this.getTextMcontent(this.wordSignEdit)
      if (!wordData) {
        this.$message({
          type: 'error',
          showClose: true,
          message: '无数据保存',
        })
      } else {
        let params = {
          id: this.$route.query.id,
          wordData: wordData,
        }
        this.apiPost(baseUrl, params, { showLoading: true }).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.$message.success('保存成功')
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
    backToPapers() {
      this.$router.push({
        path: './papers',
        query: { tabActiveName: 'myUploadPaper' },
      })
    },
    clickNextPapers() {
      if (
        !(
          this.splitWordQuesList &&
          this.splitWordQuesList.length > 0 &&
          this.splitWordQuesList[0].ques &&
          this.splitWordQuesList[0].ques.length
        )
      ) {
        this.$message({
          type: 'error',
          showClose: true,
          message: '请标记试题',
        })
        return
      }
      // 保存试题
      let baseUrl = {
        urlPath:
          '/paper-builder/personal/ques2Paper',
      }
      let wordData = this.getTextMcontent(this.wordSignEdit)
      let quesData = JSON.stringify(this.splitWordQuesList)
      console.log(quesData)
      let params = {
        id: this.$route.query.id,
        wordData: wordData,
        quesData: quesData,
      }
      this.apiPost(baseUrl, params, { showLoading: true }).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$router.push({
            path: './cuteques',
            query: { id: params.id, paperId: res.data },
          })
        } else {
          this.$message({ type: 'error', showClose: true, message: res.msg })
        }
      })
    },

    getWordData() {
      this.apiGet(
        { urlPath: '/paper-builder/personal/getWordData' },
        { id: this.$route.query.id },
        { showLoading: true },
      ).then(
        res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            if (res.data && res.data.data && res.data.id) {
              console.log(res)
              this.wordData = res.data
            }
          } else {
            this.$message({
              type: 'error',
              showClose: true,
              message: res.msg,
            })
          }
        },
        err => {
          console.log(err)
          this.$message({
            type: 'error',
            showClose: true,
            message: '网络错误',
          })
        },
      )
    },
    getTextMcontent(editid) {
      if (is(Array, this.$refs[editid])) {
        return this.$refs[editid][0].resultCkEditorData()
      } else {
        return this.$refs[editid].resultCkEditorData()
      }
    },
    updataCkEditorData() {
      let wordContect = this.getTextMcontent(this.wordSignEdit)
      this.onRenderWordQuestion(wordContect)
    },
    onRenderQuesNum() {
      let selectQues = 0
      let multiQues = 0
      let jieda = 0
      let jianda = 0 // 简答题
      for (let sub of this.splitWordQuesList) {
        if (sub && sub.ques) {
          for (let ques of sub.ques) {
            if (ques.question.questionStructure == '11') {
              selectQues++
            } else if (ques.question.questionStructure == '16') {
              multiQues++
            } else if (ques.question.questionStructure == '15') {
              jianda++
            } else if (ques.question.questionStructure == '18') {
              jieda++
            }
          }
        }
      }
      this.selectNum = selectQues
      this.multiNum = multiQues
      this.jiandaNum = jianda
      this.jiedaNum = jieda
    },
    onRenderWordQuestion(wordContect) {
      if (wordContect) {
        this.splitWordQuesList = splitWordQuestion(
          wordContect,
          this.currSubject.subjectCode,
        )
        // 选择题 综合题 和解答题格式
        this.onRenderQuesNum()
      } else {
        this.splitWordQuesList = []
      }

      // console.log(JSON.stringify(this.splitWordQuesList[0].ques[0]))
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

.word-edit-panel {
  display: flex;
  background-color: #fff;

  .word-edit-ckeditor {
    width: 560px;
    padding: 0 20px;
  }

  .word-show-paper {
    width: 560px;
    padding: 0 20px;
  }
}

.edit-word-title-tips {
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: bold;
  color: #666666;
  line-height: 50px;
}

.edit-word-questions {
  .question-list-title {
    padding: 0 20px;
    border-radius: 6px 6px 0px 0px;
    line-height: 40px;
    border: 1px solid #e2e2e2;
    background: #f6f6f6;
    font-size: 16px;
    font-family: Microsoft YaHei;

    .r {
      color: #ff6e5d;
    }
  }

  .question-list-content {
    overflow-y: auto;
    height: 556px;
    border: 1px solid #e2e2e2;
    border-top-width: 0;
    border-radius: 0px 0px 6px 6px;
  }
}

.edit-word-bottom {
  width: 525px;
  margin: 0 auto;
  padding: 30px 20px 40px 20px;

  .edit-btn-reback {
    width: 130px;
    height: 40px;
    background: $color-button-d;
    border-radius: 20px;
    font-size: $font-size-medium;
    margin-right: 55px;

    &:hover {
      background: $color-button-d-hover;
      border: 1px solid $color-button-d-hover;
    }
  }

  .edit-btn-next {
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
}
</style>
