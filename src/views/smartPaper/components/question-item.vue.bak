<template>
  <div class="question-wrapper">
    <div
      class="question-container"
      :class="isEditBox ? '' : 'question-hide'"
    >
      <div class="question-content">
        <!-- v-html="questionItem.questionText" -->
        <div class="question-title">
          <span class="question-title-number">{{ questionItem.questionIndex }}.{{
            questionItem.questionId
          }}</span>
          <div
            class="question-title-text"
            v-html="questionItem.info.context.stem"
          />
        </div>
        <div
          v-if="questionItem.info.context.options"
          class="question-options"
        >
          <span
            v-for="(option, opIndex) in questionItem.info.context.options"
            :key="opIndex"
            class="option-item"
          >
            <!--<span class="option-nut">A.</span>-->
            <!--<span class="option-meat">1</span>-->
            <span v-html="option" />
          </span>
        </div>
        <!-- <div class="question-options" v-if="questionItem.options">
          <span class="option-item"
            v-for="(options, key) in questionItem.options"
            :key="key">
            <span class="option-nut">{{key}}.</span>
            <span class="option-meat">{{options}}</span>
          </span>
        </div> -->
      </div>
      <div
        v-if="isEditBox"
        class="question-operate"
      >
        <div class="operate-item operate-item-set">
          <input
            ref="scoreInput"
            type="text"
            class="set-input"
            :value="questionItem.score ? questionItem.score : ''"
            @blur="setItemScore($event)"
          >
          <!-- <span
            class="set-input"
            contenteditable="true"
            @blur="setItemScore($event, questionItem)">
            {{}}
          </span> -->
          <span class="operate-text color-9 font-12">分</span>
        </div>
        <div
          class="operate-item"
          @click="checkQuestionDetail"
        >
          <span class="operate-btn check-btn">详情1</span>
        </div>
        <div
          class="operate-item"
          @click.stop="showDeleteDialog(questionItem.questionId)"
        >
          <span class="operate-btn delete-btn">删除</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import CTS from '@/common/js/constant'
// import { API } from '@/api/config'
import { mapState } from 'vuex'
// import BaseDialog from '@/components/BaseDialog/BaseDialog'
// import scrollIntoView from 'scroll-into-view'
export default {
  props: {
    questionItem: {
      type: Object,
      default() {
        return {}
      },
    },
    isEditBox: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      questionId: 0,
    }
  },
  computed: {
    ...mapState(['currSubject']),
  },
  methods: {
    // 派发每道题分值设置事件
    setItemScore(event) {
      this.$emit('setItemScore', event)
    },
    // 派发删除提示框事件
    showDeleteDialog(questionId) {
      this.questionId = questionId
      this.$emit('showDeleteDialog', questionId)
    },
    // 查看试题详情
    checkQuestionDetail() {
      this.$router.push({
        name: 'questionDetail',
      })
    },
  },
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
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
  cursor: move;
  background: $color-white;
  &:hover {
    border: 1px solid $color-theme;
    .question-operate {
      display: block;
    }
  }
  > .question-content {
    padding: 18px 9px 0;
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
  top: -28px;
  right: -1px;
  overflow: hidden;
  border-left: 1px solid $color-theme;
  display: none;
  height: 28px;
  .operate-item {
    display: inline-block;
    width: 80px;
    height: 28px;
    line-height: 28px;
    border-right: 1px solid $color-theme;
    border-top: 1px solid $color-theme;
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
    border-bottom: 1px solid $color-theme;
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
</style>
