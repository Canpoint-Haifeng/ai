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
          :is-show-source="isShowSource"
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
        </div>
        <div class="question-operation-right">
          <div class="operate-item operate-item-set">
            <cp-number-input
              ref="scoreInput"
              v-model="questionItem.score"
              class="operate-cp-number-input"
              @blur="setItemScore($event, questionItem)"
            />
            <span class="operate-text color-9 font-12">分</span>
          </div>
          <div class="operate-item">
            <span
              class="operate-btn check-btn"
              @click="questionChang"
            >智能换题</span>
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
          <!-- <div
            v-if="questionItem.questionInfo.editType"
            class="operate-item"
            @click="checkEditQuestion"
          >
            <span class="operate-btn check-btn">删除 </span>
          </div> -->
          <!-- <div class="operate-item" @click.stop="checkChangeQuestion">
            <span class="operate-btn check-btn">换一题</span>
          </div> -->
          <!-- <div class="operate-item" v-if="qindex > 0" @click="checkQuestionUp">
            <span class="operate-btn check-btn">上移</span>
          </div>
          <div
            class="operate-item"
            v-if="qindex < childrenlen - 1 && childrenlen > 1"
            @click="checkQuestionDown"
          >
            <span class="operate-btn check-btn">下移</span>
          </div> -->
          <div
            class="operate-item"
            @click.stop="showDeleteDialog"
          >
            <span class="operate-btn delete-btn">删除</span>
          </div>
        </div>
      </div>
      <i
        class="delete-item iconfont iconshanchu1"
        @click.stop="showDeleteDialog()"
      />
    </div>
    <CheckQuestionDia
      ref="checkQuesDia"
      :dialog-title="dialogTitle"
      :question-item="questionItem"
      @refresh-list="refreshListHttp"
      @change-question-box="changeQuestionBox"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
import QuestionCell from './QuestionCell.vue'
import { CpNumberInput } from '@/components/CpFan/index'
import AudioPlay from '@/components/AudioPlay/index'
import CheckQuestionDia from './CheckQuestionDia'
import { throttle } from '@/common/helper/throttle-debounce'
import questionItemMixin from '@/common/mixins/questionItemMixin'
export default {
  components: {
    QuestionCell,
    CpNumberInput,
    CheckQuestionDia,
    AudioPlay,
  },
  mixins: [questionItemMixin],
  props: {
    questionItem: {
      type: Object,
      default() {
        return {}
      },
    },
    questionIndex: {
      type: Number,
      default: 0,
    },
    showView: {
      // 试题显示地方 0-普通列表 1-试题详情特殊处理
      type: Number,
      default: 0,
    },
    showAttr: {
      type: Boolean,
      default: false,
    },
    showRegion: {
      type: Boolean,
      default: false,
    },
    isEditBox: {
      type: Boolean,
      default: true,
    },
    childrenlen: {
      type: Number,
      default: 0,
    },
    qindex: {
      type: Number,
      default: 0,
    },
	isShowSource: {
		type: Boolean,
    	default: true,
	}
  },
  data() {
    return {
      questionWidth: 800,
      questionsData: {
        pageSize: 10,
        currPage: 1,
        totalCount: 0,
        list: [],
      },
      source: 0,
      dialogTitle: '手动换题',
      wrapperThrottle: null,
    }
  },
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
    },
  },
  mounted() {
  },
  methods: {
    questionChang() {
      if (!this.wrapperThrottle) {
        this.wrapperThrottle = throttle(2000, () => this.$emit('checkChangeQuestion', this.questionItem))
      }
      this.wrapperThrottle()
    },
    refreshListHttp() {
      console.log('触发刷新列表接口')
    },
    // 手动换题
    changeQuestionBox(ques) {
      this.$emit('manualChange', ques)
    },
    // 派发每道题分值设置事件
    setItemScore(event, questionItem) {
      // let score = questionItem.score
      this.$emit('setItemScore', event, questionItem)
    },
    // 派发删除提示框事件
    showDeleteDialog() {
      this.$emit('showDeleteDialog', this.questionItem)
    },
    // 派发查看试题详情
    checkQuestionDetail() {
      this.$emit('checkQuestionDetail', this.questionItem)
    },
    //手动切换试题
    manualCheckQuestion() {
      this.$refs.checkQuesDia?.show()
    },
    checkQuestionUp() {
      this.$emit('checkQuestionUp', this.questionItem)
    },
    checkQuestionDown() {
      this.$emit('checkQuestionDown', this.questionItem)
    },
    checkEditQuestion() {
      this.$emit('checkEditQuestion', this.questionItem)
    },
    checkChangeQuestion() {
      this.$emit('checkChangeQuestion', this.questionItem)
    },
  },
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
}
.question-container {
  position: relative;
  border: 1px solid transparent;
  // cursor: move;
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
  > .question-content {
    padding: 18px 9px 28px 9px;
  }
  &.question-hide {
    cursor: default;
    &:hover {
      border: 1px solid $color-white;
    }
  }
}
.question-active {
  .question-container {
    border: 1px solid $color-theme;
  }
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
  .question-title-text {
    word-wrap: break-word;
  }
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
}
</style>
