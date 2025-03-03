<template>
  <div class="question-wrapper">
    <div
      class="question-container"
      :class="isEditBox ? '' : 'question-hide'"
    >
      <div class="question-content">
        <!--{{questionItem.questionId}}-->
        <!--是否 有音频 -->
        <!-- <AudioPlay v-if="quesitonAudio" :audiourl="quesitonAudio"></AudioPlay> -->
        <!-- 试题展示区 -->
        <question-cell
          v-if="questionItem"
          :show-attr="showAttr"
          :show-region="showRegion"
          :show-knowledge="questionItem.showKnowledge"
          :show-question-num="questionItem.showQuestionNum"
          :question-num="questionItem.questionNum"
          :level="1"
          :ques-struct-pm="
            questionItem.questionInfo.quesStruct &&
              questionItem.questionInfo.quesStruct.code
              ? questionItem.questionInfo.quesStruct.code
              : '-1'
          "
          :ques="questionItem.questionInfo"
          :show-explain="questionItem.showExplain"
          :question-width="questionWidth"
        />
      </div>
      <!-- 试题操作区 -->
      <div
        v-if="isEditBox"
        class="question-operate"
      >
        <div class="question-attr-left">
          预估难度：<span>{{
            questionItem.questionInfo.difficulty.name || '-'
          }}</span>
          题型：<span>{{
            questionItem.questionInfo.difficulty.name || '-'
          }}</span>
        </div>
        <div class="question-operation-right">
          <div class="operate-item">
            <!-- <cp-number-input
              class="operate-cp-number-input"
              ref="scoreInput"
              v-model="questionItem.score"
              @blur="setItemScore($event, questionItem)"
            ></cp-number-input>
            <span class="operate-text color-9 font-12">分</span> -->
            <span class="operate-btn check-btn">智能换题</span>
          </div>
          <div
            class="operate-item"
            @click="manualCheckQuestion"
          >
            <span class="operate-btn check-btn">手动换题</span>
          </div>

          <div
            class="operate-item"
            @click="checkQuestionDetail"
          >
            <span class="operate-btn check-btn">详情</span>
          </div>
          <div
            v-if="questionItem.source == 1"
            class="operate-item"
            @click="checkQuestionWrong"
          >
            <span class="operate-btn check-btn">纠错</span>
          </div>
          <div
            v-if="questionItem.questionInfo.editType"
            class="operate-item"
            @click="checkEditQuestion"
          >
            <span class="operate-btn check-btn">删除 </span>
            <!-- 1改编，2编辑，0不改编也不编辑 -->
            <!-- <span class="operate-btn check-btn">{{
              questionItem.questionInfo.editType == 1 ? '改编11' : '编辑'
            }}</span> -->
          </div>
          <!-- <div class="operate-item" @click.stop="checkChangeQuestion">
            <span class="operate-btn check-btn">换一题</span>
          </div> -->
          <div
            v-if="qindex > 0"
            class="operate-item"
            @click="checkQuestionUp"
          >
            <span class="operate-btn check-btn">上移</span>
          </div>
          <div
            v-if="qindex < childrenlen - 1 && childrenlen > 1"
            class="operate-item"
            @click="checkQuestionDown"
          >
            <span class="operate-btn check-btn">下移</span>
          </div>
          <!-- <div class="operate-item" @click.stop="showDeleteDialog">
            <span class="operate-btn delete-btn">删除</span>
          </div> -->
        </div>
      </div>
      <i
        class="delete-item iconfont iconshanchu1"
        @click.stop="showDeleteDialog()"
      />
    </div>
    <CheckQuestionDia ref="checkQuesDia" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import QuestionCell from './QuestionCell.vue'
import { CpNumberInput } from '@/components/CpFan/index'
import AudioPlay from '@/components/AudioPlay/index'
import CheckQuestionDia from './CheckQuestionDia'
import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
  components: {
    QuestionCell,
    CpNumberInput,
    CheckQuestionDia,
    AudioPlay,
  }
})

    return {
  props: {
    questionItem: {
      type: Object,
      default() {
        const state = reactive({}
      }

    return {
    }

    return {
    questionIndex: {
      type: Number,
      default: 0,
    }

    return {
    showView: {
      // 试题显示地方 0-普通列表 1-试题详情特殊处理
      type: Number,
      default: 0,
    }

    return {
    showAttr: {
      type: Boolean,
      default: false,
    }

    return {
    showRegion: {
      type: Boolean,
      default: false,
    }

    return {
    isEditBox: {
      type: Boolean,
      default: true,
    }

    return {
    childrenlen: {
      type: Number,
      default: 0,
    }

    return {
    qindex: {
      type: Number,
      default: 0,
    }

    return {
  }
})

    return {
  setup() {
    const state = reactive({
      questionWidth: 800
    })
    
    const checkQuesDia = ref(null)
    
    const manualCheckQuestion = () => {
      checkQuesDia.value.show()
    }

    return {
      ...state,
      checkQuesDia,
      manualCheckQuestion
    }
  }
})
  computed: {
    ...mapState(['currSubject']),
    quesitonAudio() {
      if (
        this.questionItem &&
        this.questionItem.questionInfo &&
        this.questionItem.questionInfo.context &&
        this.questionItem.questionInfo.context.audio
      ) {
        console.log(
          'quesitonAudio',
          this.questionItem.questionInfo.context.audio,
        )
        return this.questionItem.questionInfo.context.audio
      } else {
        return ''
      }
    }

    return {
  }
})

    return {
  methods: {
    // 派发每道题分值设置事件
    setItemScore(event, questionItem) {
      // let score = questionItem.score
      console.log(event, questionItem)
      this.$emit('setItemScore', event, questionItem)
    }

    return {
    // 纠错
    checkQuestionWrong() {
      this.$emit('showReportDialog', this.questionItem)
    }

    return {
    // 派发删除提示框事件
    showDeleteDialog() {
      this.$emit(
        'showDeleteDialog',
        this.questionItem.questionId,
        this.questionItem.source,
      )
    }

    return {
    // 派发查看试题详情
    checkQuestionDetail() {
      this.$emit('checkQuestionDetail', this.questionItem)
    }

    return {
    // Moved to setup()

    return {
    checkQuestionUp() {
      this.$emit('checkQuestionUp', this.questionItem)
    }

    return {
    checkQuestionDown() {
      this.$emit('checkQuestionDown', this.questionItem)
    }

    return {
    checkEditQuestion() {
      this.$emit('checkEditQuestion', this.questionItem)
    }

    return {
    checkChangeQuestion() {
      this.$emit('checkChangeQuestion', this.questionItem)
    }

    return {
  }
})

    return {
}
</script>

<style lang="scss" scoped>
  
// .question-wrapper {
//   // margin-bottom: 20px;
// }
.question-item-drag {
  .question-container {
    z-index: 1000;
    border: 1px dashed $color-theme;
    background: $color-table-bg;
  }
})
}
.question-container {
  position: relative;
  border: 1px solid transparent;
  cursor: move;
  background: $color-white;
  border-radius: 6px;
  //   border: 1px solid $color-theme;
  //   .delete-item {
  //     display: inline-block;
  //   }
  //   .question-operate {
  //     width: 100%;
  //     display: flex;
  //     align-items: center;
  //     justify-content: space-between;
  //   }
  .delete-item {
    position: absolute;
    top: -10px;
    right: -10px;
    color: #ff6e5d;
    font-size: 20px;
    display: none;
    cursor: pointer;
  }
})
  &:hover {
    border: 1px solid $color-theme;
    .delete-item {
      display: inline-block;
    }
    .question-operate {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
})
  > .question-content {
    padding: 18px 9px 28px 20px;
  }
})
  &.question-hide {
    cursor: default;
    &:hover {
      border: 1px solid $color-white;
    }
  }
})
}
.question-active {
  .question-container {
    border: 1px solid $color-theme;
  }
})
}
.question-title {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  align-items: flex-start;
  padding-bottom: 20px;
  color: $color-text-d;
  line-height: 24px;
  .question-title-number {
    margin-right: 5px;
  }
})
  .question-title-text {
    word-wrap: break-word;
  }
})
}
.question-options {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  flex-wrap: wrap;
  .option-item {
    width: 25%;
    color: $color-text-d;
    padding-bottom: 20px;
    .option-nut {
      margin-right: 8px;
    }
  }
})
}
.question-operate {
  position: absolute;
  bottom: 0;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
  overflow: hidden;
  display: none;
  height: 28px;
  left: 0;
  background: #f6f6f6;
  .question-attr-left {
    color: #999;
    font-size: 12px;
    padding-left: 20px;
    span {
      color: #666;
    }
  }
})
  .question-operation-right {
    .operate-item {
      display: inline-block;
      width: 80px;
      height: 28px;
      line-height: 28px;
      border-top: 1px solid $color-theme;
      border-left: 1px solid $color-theme;
      box-sizing: border-box;
      text-align: center;
      transition: 0.2s;
      cursor: pointer;
      .operate-btn {
        color: $color-theme;
        font-size: $font-size-small;
      }
      &:hover {
        background: $color-theme;
        .operate-btn {
          color: $color-white;
        }
      }
    }
    .operate-item-set {
      background: $color-background-l;
      border-top-left-radius: 6px;
      .set-input {
        float: left;
        width: 50px;
        height: 18px;
        line-height: 18px;
        margin: 4px 0 4px 6px;
        background: $color-white;
        text-align: center;
        color: $color-text-d;
        font-size: $font-size-small;
      }
      &:hover {
        background: $color-background-l;
      }
    }
  }
})
}

.operate-cp-number-input {
  width: 55px;
}
.operate-cp-number-input :deep(.el-input__inner) {
    line-height: 20px;
    height: 20px;
    font-size: 12px;
    width: 45px;
    height: 20px;
    line-height: 20px;
    padding: 0 10px;
  }
})
}
</style>
