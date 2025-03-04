<template>
  <div>
    <el-dialog
      :visible="dialog.visible"
      @update:visible="dialog.visible = $event"
      class="dialog"
      :title="dialogTitle"
      :modal-append-to-body="false"
      :lock-scroll="false"
      :width="dialog.width"
      :close-on-click-modal="false"
    >
      <div class="CheckQuestionDia">
        <div
          v-if="quesData.list.length > 0"
          class="recommend-content"
        >
          <ul
            ref="questionsDatasDetailRef"
            class="question-content"
          >
            <QuestionItem
              v-for="(item, index) in quesData.list"
              :key="index"
              :question-item="item"
              :question-index="index"
              v-on="$listeners"
            />
          </ul>
        </div>
        <noresult-common
          v-else
          class="noresult-wrapper"
          text="非常抱歉，暂时没有合适的试题哦！"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button
            class="btn btn-gray"
            @click="dialog.visible = false"
          >
            关闭
          </el-button>
        <!-- 本期不开发 -->
        <!-- <el-button class="btn btn-shadow" @click="refreshHttp"
          >换一批</el-button
        > -->
        </div>
      </template>
    </el-dialog>
    <!-- 纠错提示框 -->
    <report-dialog
      ref="reportDialog"
      @report-error="onReportError"
    />
  </div>
</template>

<script>
import CTS from '@/common/js/constant'
import { mapState } from 'vuex'
import { API } from '@/api/config'
import QuestionItem from './SmartQuestionItem'
import questionItemMixin from '@/common/mixins/questionItemMixin'
import { decrypt } from '@/common/js/util.js'
export default {
  components: { QuestionItem },
  mixins: [questionItemMixin],
  inject: ['context'],
  props: {
    dialogTitle: {
      type: String,
      default: '',
    },
    questionItem: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      dialog: {
        visible: false,
        width: '914px',
      },
      quesData: {
        pageSize: 10,
        currPage: 1,
        totalCount: 0,
        list: [],
      },
    }
  },

  watch: {},
  computed: {
    ...mapState(['currSubject']),
  },
  created() { },
  mounted() { },
  methods: {
    show() {
      this.getData()
      this.dialog.visible = true
    },
    async getData() {
      let params = {
        pageNum: 1,
        pageSize: 5,
        catalogueTreeId: this.$parent.knowledgeCode,
        catalogueType: 11,
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      // let url = '/paper-generator/smartPaper/question/manualSearch'
      let url = API.QUESTION_RELATION.urlPath
      if(this.context.changeType === 1) {
        url = '/paper-builder/question/getQuestions'
      } else {
        params = {
          questionId: this.questionItem.questionId,
          pageNum: 1,
          pageSize: 5,
        }
      }
      // const params = {
      //   // type: this.context.changeType,
      //   // smartPaperDetailsId: this.context.id,
      //   // originalQid: this.questionItem.questionId,
      //   // currPage: this.quesData.currPage,
      //   // pageSize: this.quesData.pageSize
      //   questionId: this.questionItem.questionId,
      //   pageNum: 5,
      //   pageSize: 1,
      // }
      if (params.type === 1) {
        params.knowledgeModeCode = this.$parent.knowledgeCode
      }
      const res = await this.apiGet({urlPath: url}, params, params)
      if (res.code === CTS.constant.SUCCESS_CODE) {
        // let data = decrypt(res.data)
        let data = res.data
        if (data) {
          // data = JSON.parse(data)
          let num = ((data.currPage - 1) * data.pageSize) + 1
          const arr = data.records
          arr.forEach(item => {
            item.showQuestionNum = true
            item.questionNum = num++
          })
          this.quesData.list = arr
          this.quesData.totalCount = data.count
        }
      }
    },
    closed() {
      this.dialog.visible = false
    },
    //   换一批
    refreshHttp() {
      this.$emit('refreshList')
    },
    //
    // changeQuestionBox() {
    //   console.log('选用此题')
    // },
  },
}
</script>

<style lang="scss" scoped>
.dialog {
  .recommend-content {
    // padding: 10px 20px;
    min-height: 300px;
  }

  .question-content {
    overflow: hidden;
    padding: 20px 20px 0 20px;
  }
  :deep(.el-dialog__body) {
    height: 500px;
    overflow-y: scroll;
  }
  :deep(.el-dialog__footer) {
    height: 60px;
    padding: 15px 0px;
    text-align: center;
  }
}
</style>
