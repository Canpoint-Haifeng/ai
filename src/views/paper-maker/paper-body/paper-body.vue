<template>
  <div class="paper-body f-usn">
    <!-- 试卷大题部分 -->
    <div
      v-for="(part, partIndex) in oldData"
      :key="part.ordinal + '_' + partIndex"
      class="paper-part"
    >
      <div
        v-if="paperOptions[7].isSet"
        class="paper-title"
      >
        <div class="title color-3 font-16">
          <span
            v-show="!part.groupName.isShowInput"
            class="edit-text"
            @click="showEditInput(part.groupName)"
          >
            {{ part.groupName.text }}
          </span>
          <input
            v-show="part.groupName.isShowInput"
            ref="groupNameInput"
            v-model="part.groupName.text"
            type="text"
            class="edit-input"
            maxlength="20"
            @blur="blurEditInput(part.groupName)"
          >
        </div>
        <p class="paper-rule font-12">
          <span
            v-show="!part.groupDesc.isShowInput"
            class="edit-text"
            @click="showEditInput(part.groupDesc)"
          >
            {{ part.groupDesc.text }}
          </span>
          <input
            v-show="part.groupDesc.isShowInput"
            ref="groupDescInput"
            v-model="part.groupDesc.text"
            type="text"
            class="edit-input"
            maxlength="20"
            @blur="blurEditInput(part.groupDesc)"
          >
        </p>
      </div>
      <div
        v-for="(item, index) in part.list"
        :key="item.typeIndex"
        class="paper-section"
      >
        <div v-if="item.list && item.list.length">
          <div class="question-type">
            <table
              v-if="paperOptions[9].isSet"
              cellspacing="0"
              cellpadding="0"
              class="score-table"
            >
              <tbody>
                <tr>
                  <th>评卷人</th>
                  <th>得分</th>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              </tbody>
            </table>
            <h4
              v-if="paperOptions[10].isSet"
              class="type-title color-3"
            >
              <span class="order">{{ $filters.simplifiedChinese(item.typeIndex) }}.</span>
              <span
                v-show="!item.typesInfo.isShowInput"
                class="edit-text"
                @click="showEditInput(item.typesInfo)"
              >
                {{ item.typesInfo.text }}
              </span>
              <input
                v-show="item.typesInfo.isShowInput"
                ref="questionTypeInput"
                v-model="item.typesInfo.text"
                type="text"
                class="edit-input"
                maxlength="10"
                @blur="blurEditInput(item.typesInfo)"
              >
              <!-- 本题共10小题，每小题2分，共20分 -->
              <span>（共 <strong class="num"> {{ item.count }}</strong> 小题
                <span v-if="item.showTypeScore">
                  {{
                    item.perQuesScore
                      ? '，每小题' +
                        item.perQuesScore +
                        '分，满分' +
                        item.score +
                        '分'
                      : '，满分' + item.score + '分'
                  }}
                </span>
                ）
              </span>
            </h4>
          </div>

          <Draggable
            group="cp_drag_tree"
            :animation="200"
            :distance="10"
            drag-class="dragClass"
            @update="e => updateDrag(e, part.ordinal, item.questionType)"
            @add="e => addDrag(e, part.ordinal, item.questionType)"
          >
            <div
              v-for="(subItem, qindex) in item.list"
              :key="subItem.questionId"
              class="dragClass question-item-block"
              :data-qid="subItem.questionId"
              :data-type="item.questionType"
            >
              <question-item
                :ref="'questionItem' + subItem.questionId"
                :question-item="subItem"
                :childrenlen="item.list.length"
                :qindex="qindex"
                v-bind="$attrs"
                @set-item-score="
                  (event, questionItem) => {
                    onSetItemScore(
                      event,
                      qindex,
                      index,
                      questionItem,
                      part.ordinal,
                    )
                  }
                "
                @check-question-detail="onCheckQuestionDetail"
                @check-question-up="
                  event => {
                    onCheckQuestionUp(event, item)
                  }
                "
                @check-question-down="
                  event => {
                    onCheckQuestionDown(event, item)
                  }
                "
                @check-edit-question="onCheckEditQuestion"
                @check-change-question="
                  event => {
                    onCheckChangeQuestion(event, item.questionType)
                  }
                "
                v-on="$listeners"
              />
            </div>
          </Draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
import { dealDecimal } from '@/common/js/util'
import QuestionItem from '@/components/QuestionItem/QuestionItemMaker'
import setPaperOptionsMixin from '@/common/mixins/setPaperOptionsMixin'
import scrollIntoView from 'scroll-into-view'
import { addClass, removeClass } from '@/common/js/dom'
import Draggable from 'vuedraggable'
import CpWarningDialog from '@/components/AuthorityVip/CpWarningDialog'
export default {
  components: {
    QuestionItem,
    Draggable,
  },
  mixins: [setPaperOptionsMixin],
  props: {
    questionsData: {
      type: Array,
      default: () => [],
    },
    questionTypes: {
      type: Array,
      default: () => [],
    },
    paperData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      paperTreeProps: {
        children: 'list',
      },
      simpleQuestionList: [],
      dragOptions: {
        animation: 0,
        delay: 10,
        direction: 'vertical',
        ghostClass: 'ghost-item',
        chosenClass: 'chosen-item', // 选中项的类名
        dragClass: 'drag-item', // 拖动项的类名
        // emptyInsertThreshold: 20, // 鼠标距离目标元素位置
        scroll: true,
        forceFallback: false,
      },
      oldData: [],
    }
  },
  watch: {
    questionsData: {
      handler(nv, ov) {
        // this.oldData = []
        this.$nextTick(() => {
          this.oldData = JSON.parse(JSON.stringify(nv))
        })
      },
      deep: true,
    },
  },
  computed: {
    ...mapState(['currSubject']),
  },
  mounted() {
    // 监听点击试题定位
    this.Bus.$on('scrollToElement', this.onScrollToElement)
    this.oldData = JSON.parse(JSON.stringify(this.questionsData))
  },

  unmounted() {
    this.Bus.$off('scrollToElement')
  },
  methods: {
    renderDom(dom) {
      let arr = []
      for (let i = 0; i < dom.length; i++) {
        arr.push({
          questionId: dom[i].getAttribute('data-qid'),
          ordinal: i + 1,
        })
      }
      return arr
    },
    renderItemDom(dom) {
      return {
        questionId: dom.getAttribute('data-qid'),
        type: dom.getAttribute('data-type'),
      }
    },
    addDrag(e, ordinal, type) {
      let list = this.renderDom(e.target.childNodes)
      let item = this.renderItemDom(e.item)
      let params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        type: item.type,
        paramsJson: JSON.stringify(list),
        sectionId: ordinal,
        isCross: 1,
        crossType: type,
        questionId: item.questionId,
      }
      this.updateQuestionOrderHttp(params)
    },
    updateDrag(e, ordinal, type) {
      let list = this.renderDom(e.target.childNodes)
      let item = this.renderItemDom(e.item)
      let params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        type: item.type,
        paramsJson: JSON.stringify(list),
        sectionId: ordinal,
        isCross: 0,
        crossType: type,
        questionId: item.questionId,
      }
      this.updateQuestionOrderHttp(params)
    },
    updateQuestionOrderHttp(params) {
      this.newPost(API.QUESTION_UPDATE_ORDER, params).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$emit('refreshPaperData', params)
        } else {
          this.$emit('refreshPaper', params)
        }
      })
    },
    onCheckQuestionUp(questionItem, questionType) {
      let queslist = [...questionType.list]
      // questionType.list 重新排序
      let index = queslist.findIndex(
        item => item.questionId == questionItem.questionId,
      )
      //  如果是没查询到 index 为0  或者 长度 只有一个 处理不了
      if (index == -1 || index == 0 || queslist.length <= 1) return

      let tempItem = queslist[index]
      queslist[index] = queslist[index - 1]
      queslist[index - 1] = tempItem
      console
      let list = []
      queslist.forEach((item, i) => {
        list.push({
          questionId: item.questionId,
          ordinal: i + 1,
        })
      })
      //
      let params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        type: questionType.questionType,
        paramsJson: JSON.stringify(list),
        sectionId: questionType.pordinal,
        isCross: 0,
        crossType: questionType.questionType,
        questionId: questionItem.questionId,
      }
      this.updateQuestionOrderHttp(params)
    },
    onCheckQuestionDown(questionItem, questionType) {
      let queslist = [...questionType.list]
      // questionType.list 重新排序
      let index = queslist.findIndex(
        item => item.questionId == questionItem.questionId,
      )
      //  如果是没查询到 index 为0  或者 长度 只有一个 处理不了
      if (index == -1 || index >= queslist.length - 1 || queslist.length <= 1) {
        return
      }

      let tempItem = queslist[index]
      queslist[index] = queslist[index + 1]
      queslist[index + 1] = tempItem
      let list = []
      queslist.forEach((item, i) => {
        list.push({
          questionId: item.questionId,
          ordinal: i + 1,
        })
      })
      let params = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        type: questionType.questionType,
        paramsJson: JSON.stringify(list),
        sectionId: questionType.pordinal,
        isCross: 0,
        crossType: questionType.questionType,
        questionId: questionItem.questionId,
      }
      this.updateQuestionOrderHttp(params)
    },
    // 监听拖拽更新小题排序
    endQuestionOrder(dragObj, orderItem) {
      console.log(dragObj)
      console.log(orderItem)
      if (dragObj.newIndex !== dragObj.oldIndex) {
      }
      /* let temp = {} // 临时试题
        let tempNum = 0 // 临时题号
        // let newOrderItem = orderItem.slice(0)
        let questionListOrder = []
        temp = orderItem[dragObj.oldIndex]
        orderItem[dragObj.oldIndex] = orderItem[dragObj.newIndex]
        orderItem[dragObj.newIndex] = temp
        tempNum = orderItem[dragObj.newIndex].questionNum
        orderItem[dragObj.newIndex].questionNum = orderItem[dragObj.oldIndex].questionNum
        orderItem[dragObj.oldIndex].questionNum = tempNum
        orderItem.forEach(subItem => {
          questionListOrder.push({
            questionId: subItem.questionId,
            ordinal: subItem.questionNum
          })
        })
        let parms = {
          period: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
          type: orderItem[0].questionType,
          paramsJson: JSON.stringify(questionListOrder)
        }
        this.apiPost(API.QUESTION_UPDATE_ORDER, parms).then(res => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            // this.$emit('refreshPaper')
          } else {
            this.$message.error(res.msg)
          }
        }) */
    },
    // 更新小题排序
    updateQuestionOrder(orderItem, partIndex, index) {
      console.log(orderItem, this.questionsData, this.oldData)
      // [partIndex][index]

      let questionListOrder = []
      let oldQuestionListOrder = []
      let oldItem = this.oldData[partIndex].list[index]
      const newOrderItem = orderItem.slice(0).sort((order1, order2) => {
        return order1.questionNum - order2.questionNum
      })
      const minQuestionNum = newOrderItem[0].questionNum
      orderItem.forEach((item, index) => {
        questionListOrder.push({
          questionId: item.questionId,
          ordinal: minQuestionNum + index,
        })
      })
      oldQuestionListOrder = oldItem.list.map((sub, index) => {
        return {
          questionId: sub.questionId,
          ordinal: minQuestionNum + index,
        }
      })
      if (
        JSON.stringify(questionListOrder) ===
        JSON.stringify(oldQuestionListOrder)
      ) {
        return
      }
      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        type: orderItem[0].questionType,
        paramsJson: JSON.stringify(questionListOrder),
      }
      this.apiPost(API.QUESTION_UPDATE_ORDER, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$emit('refreshPaper')
        }
      })
    },
    // 每道题分值设置
    onSetItemScore(event, subIndex, index, questionItem, ordinal) {
      const currScrore = event.target.value.trim()
      for (let item of this.questionsData) {
        let listItem = item.list
        for (let it of listItem) {
          it.numPaper = item.ordinal
        }
      }
      let simpleQuestionList = [
        ...this.questionsData[0].list,
        ...this.questionsData[1].list,
      ]
      console.log(questionItem.oldscore, 1111111)
      let oldScrore = questionItem.oldscore
      let typeTotalScore = 0
      if (!currScrore && oldScrore === 0) {
        return
      }
      // if (!CTS.constant.scoreReg.test(currScrore)) {
      //   this.$message.error('请输入正确分数值！')
      //   return
      // }
      if (Number(currScrore) === oldScrore) {
        return
      }
      if (currScrore > 100) {
        this.$message.error('分数值不能大于100！')
        return
      }
      this.paperData.totalScore = 0
      // simpleQuestionList[index].list[subIndex].score = currScrore
      if (ordinal === 1) {
        simpleQuestionList[index].list[subIndex].score = currScrore
        simpleQuestionList[index].list.forEach(item => {
          typeTotalScore += parseFloat(item.score)
        })
        simpleQuestionList[index].score = typeTotalScore

        simpleQuestionList.forEach(item => {
          this.paperData.totalScore += item.score
        })
      } else {
        let newArr = simpleQuestionList.slice(
          this.questionsData[0].list.length,
          simpleQuestionList.length,
        )
        newArr[index].list[subIndex].score = currScrore
        newArr[index].list.forEach(item => {
          typeTotalScore += parseFloat(item.score)
        })
        newArr[index].score = typeTotalScore
        simpleQuestionList.forEach(item => {
          this.paperData.totalScore += item.score
        })
      }

      this.paperData.totalScore = dealDecimal(this.paperData.totalScore, 1)

      this.simpleQuestionList = simpleQuestionList
      this.commitScore()
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
          score: parseFloat(item.score),
          ordinal: item.numPaper,
        })
        item.list.forEach(subItem => {
          scoreList.questionScoreDtoList.push({
            questionId: subItem.questionId,
            score: parseFloat(subItem.score),
            ordinal: item.numPaper,
          })
        })
      })
      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        paramsJson: JSON.stringify(scoreList),
      }
      this.newPost(API.QUESTION_SETTING_SCORE, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.$emit('refreshPaper')
        }
      })
    },
    // 监听点击试题定位
    onScrollToElement(questionId) {
      if (
        !(
          this.$refs['questionItem' + questionId] &&
          this.$refs['questionItem' + questionId].length > 0
        )
      ) {
        return
      }
      this.$nextTick(() => {
        const element = this.$refs['questionItem' + questionId][0].$el
        scrollIntoView(
          element,
          {
            time: 500,
          },
          () => {
            // arrow_box_animation question-active
            addClass(element, 'arrow_box_animation')
            setTimeout(() => {
              removeClass(element, 'arrow_box_animation')
            }, 2400)
          },
        )
      })
    },
    // 监听查看试题详情
    onCheckQuestionDetail(questionItem) {
      let queryStr =
        '?questionId=' +
        questionItem.questionInfo.questionId +
        '&source=' +
        questionItem.source
      this.openWindowLink(
        this.$router.resolve('/question/detail').href + queryStr,
      )
    },
    onCheckChangeQuestion(questionItem, type) {
      console.log(questionItem, type)
      this.$emit('onCheckChangeQuestion', { questionItem, type })
    },
    async onCheckEditQuestion(questionItem) {
      // 判断是否 还有编辑的次数
      if (questionItem.questionInfo.editType == 1) {
        let code = await this.apiGet(
          API.RESOURCE_EDIT_CANADAPTED,
          {},
          { authCode: 1 },
        ).then(
          res => {
            if (res.code === CTS.constant.SUCCESS_CODE) {
              return 1
            } else {
              return res.code
            }
          },
          err => {
            console.log(err)
            return '1011'
          },
        )

        if (code == '1010' || code == '1011') {
          CpWarningDialog.install({
            code: code + '',
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
        paper: 1,
      }
      this.$router.push({ path: '/question/edit', query: queryparam })
    },
  },
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.paper-part {
  .paper-section {
    &.active {
      background: #fbfbfb;
    }
  }
  .paper-title {
    position: relative;
    margin: 24px 0;
    .title {
      height: 42px;
      line-height: 42px;
      margin-bottom: 5px;
      background: #f6f6f6;
      text-align: center;
      .edit-input {
        padding: 11px 0;
        font-size: $font-size-medium-x;
      }
    }
    .paper-rule {
      height: 28px;
      line-height: 28px;
      .edit-input {
        text-align: left;
      }
    }
  }
  .question-type {
    position: relative;
    max-height: 88px;
    margin-bottom: 4px;
    display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
    align-items: center;
    .score-table {
      display: inline-block;
      vertical-align: middle;
      margin: 8px;
      margin-right: 22px;
      tr,
      td {
        height: 35px;
      }
      th,
      td {
        width: 70px;
        border: 1px solid $color-border;
        font-size: $font-size-small;
        text-align: center;
        font-weight: 400;
      }
    }
    .type-title {
      line-height: 30px;
      margin-left: 8px;
      .edit-input {
        width: 80px;
        margin-left: 5px;
        padding: 3px;
      }
    }
  }
  .edit-text {
    cursor: pointer;
    border: 1px solid transparent;
    transition: 0.2s;
    &:hover {
      background: $color-menu-l-hover;
      border: 1px solid $color-border;
    }
  }
  .edit-input {
    width: 100%;
    background: $color-menu-l-hover;
    border: 1px solid $color-border;
    padding: 6px;
    text-align: center;
    box-sizing: border-box;
  }
}

.paper-body :deep({
  .el-tree-node__content > .el-tree-node__expand-icon {
    display: none;
  }
  .el-tree-node__content {
    height: auto;
    cursor: default;
  }
  .el-tree-node__content:hover {
    background-color: #ffffff;
  }
}
.question-item-block {
  padding-bottom: 10px;
}
</style>
