<template>
  <div class="basket-question-item-box">
    <div class="basket-question-item">
      <question-cell
        :level="1"
        :quesStructPm="
          questionItem.questionInfo.quesStruct &&
          questionItem.questionInfo.quesStruct.code
            ? questionItem.questionInfo.quesStruct.code
            : '-1'
        "
        :ques="questionItem.questionInfo"
        :showQuestionNum="questionItem.showQuestionNum"
        :questionNum="questionItem.questionNum"
      >
      </question-cell>
    </div>
    <div
      class="basket-delete-quesiton el-icon-error"
      @click="deleteQuestion"
    ></div>
  </div>
</template>

<script>
  import QuestionCell from './QuestionCell.vue'
  export default {
    components: { QuestionCell },
    props: {
      questionItem: Object,
    },
    data() {
      return {}
    },
    methods: {
      deleteQuestion() {
        this.$emit('deleteQuestion', this.questionItem)
      },
    },
  }
</script>

<style scoped lang="scss">
  .basket-question-item {
    position: relative;
    width: 382px;
    height: 142px;
    border: 1px solid #e2e2e2;
    border-radius: 6px;
    overflow: hidden;
    box-sizing: border-box;
    padding: 10px;
    margin-bottom: 20px;
  }

  .basket-delete-quesiton {
    top: -8px;
    right: -8px;
    position: absolute;
    display: none;
    color: rgb(255, 110, 93);
    font-size: 20px;
    cursor: pointer;
    user-select: none;
    &:hover {
      color: #ff4b36;
    }
  }

  .basket-question-item-box {
    position: relative;
    &:hover {
      .basket-delete-quesiton {
        display: inline-block;
      }
    }
  }
</style>
