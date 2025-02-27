<template>
  <div class="paper-header">
    <!-- 保密标记 -->
    <div class="marktag-box">
      <div
        v-if="paperOptions[8].isSet"
        class="test-marktag font-b"
      >
        <span
          v-show="!secretSign.isShowInput"
          class="edit-text"
          @click="showEditInput(secretSign)"
        >
          {{ secretSign.text }}
        </span>
        <input
          v-show="secretSign.isShowInput"
          ref="secretSignInput"
          v-model="secretSign.text"
          type="text"
          class="edit-input"
          maxlength="20"
          @blur="blurEditInput(secretSign)"
        >
      </div>
    </div>
    <!-- 主标题 -->
    <div class="test-title">
      <h1
        v-if="paperOptions[0].isSet"
        class="head-title color-3 font-20 font-b"
      >
        <span
          v-show="!paperHeadline.isShowInput"
          class="edit-text"
          @click="showEditInput(paperHeadline)"
        >
          {{ paperHeadline.text }}
        </span>
        <input
          v-show="paperHeadline.isShowInput"
          ref="paperHeadlineInput"
          v-model="paperHeadline.text"
          type="text"
          class="edit-input"
          maxlength="50"
          @blur="blurEditInput(paperHeadline)"
        >
      </h1>
      <h2
        v-if="paperOptions[1].isSet"
        class="sub-title color-3 font-16 font-b"
      >
        <span
          v-show="!paperSubtitle.isShowInput"
          class="edit-text"
          @click="showEditInput(paperSubtitle)"
        >
          {{ paperSubtitle.text }}
        </span>
        <input
          v-show="paperSubtitle.isShowInput"
          ref="paperSubtitleInput"
          v-model="paperSubtitle.text"
          type="text"
          class="edit-input"
          maxlength="50"
          @blur="blurEditInput(paperSubtitle)"
        >
      </h2>
    </div>
    <!-- 试卷信息 -->
    <div
      v-if="paperOptions[2].isSet"
      class="test-time color-9 font-12"
    >
      <span class="item">
        考试范围：
        <em
          v-show="!testRang.isShowInput"
          class="edit-text"
          @click="showEditInput(testRang)"
        >
          {{ testRang.text }}
        </em>
        <input
          v-show="testRang.isShowInput"
          ref="testRangInput"
          v-model="testRang.text"
          type="text"
          class="edit-input"
          maxlength="10"
          @blur="blurEditInput(testRang)"
        >
      </span>
      <span class="item">
        考试时间：
        <em
          v-show="!testTime.isShowInput"
          class="edit-text"
          @click="showEditInput(testTime)"
        >
          {{ testTime.text }}
        </em>
        <input
          v-show="testTime.isShowInput"
          ref="testTimeInput"
          v-model="testTime.text"
          type="text"
          class="edit-input"
          maxlength="10"
          @blur="blurEditInput(testTime)"
        >
      </span>
      <span class="item">
        命题人：
        <em
          v-show="!testCreater.isShowInput"
          class="edit-text"
          @click="showEditInput(testCreater)"
        >
          {{ testCreater.text }}
        </em>
        <input
          v-show="testCreater.isShowInput"
          ref="testCreaterInput"
          v-model="testCreater.text"
          type="text"
          class="edit-input"
          maxlength="10"
          @blur="blurEditInput(testCreater)"
        >
      </span>
    </div>
    <!-- 考生输入栏 -->
    <div
      v-if="paperOptions[3].isSet"
      class="test-input color-6"
    >
      <!-- <div class="item">
        <span class="text">学校：</span>
        <em class="line"></em>
      </div>
      <div class="item">
        <span class="text">姓名：</span>
        <em class="line"></em>
      </div>
      <div class="item">
        <span class="text">班级：</span>
        <em class="line"></em>
      </div>
      <div class="item">
        <span class="text">考号：</span>
        <em class="line"></em>
      </div> -->
      {{ paperData.studentInput }}
    </div>
    <!-- 誊分栏 -->
    <div
      v-if="paperOptions[4].isSet"
      class="test-score"
    >
      <table
        cellspacing="0"
        cellpadding="0"
        class="score-table"
      >
        <tbody>
          <tr>
            <th>题号</th>
            <th
              v-for="(item, index) in questionTypes"
              :key="item.index"
            >
              {{ $filters.simplifiedChinese((index + 1)) }}
            </th>
            <th>总分</th>
          </tr>
          <tr>
            <td>得分</td>
            <td
              v-for="item in questionTypes"
              :key="item.index"
            >
&nbsp;
            </td>
            <td>&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 注意事项 -->
    <div
      v-if="paperOptions[5].isSet"
      class="test-rule font-12"
    >
      <h3 class="rule-title">
        *注意事项：
      </h3>
      <div class="rule-text">
        <span
          v-show="!payAttention.isShowInput"
          class="edit-text contenteditable"
          @click="showEditInput(payAttention)"
        >
          {{ payAttention.text }}
        </span>
        <textarea
          v-show="payAttention.isShowInput"
          ref="payAttentionInput"
          v-model="payAttention.text"
          class="edit-input"
          maxlength="100"
          @blur="blurEditInput(payAttention)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import setPaperOptionsMixin from '@/common/mixins/setPaperOptionsMixin'
export default {
  mixins: [setPaperOptionsMixin],
  props: {
    paperData: {
      type: Object,
      default: () => { }
    },
    questionTypes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      secretSign: {
        text: '',
        isShowInput: false,
        index: 0,
        element: 'secretSignInput'
      },
      paperHeadline: {
        text: '',
        isShowInput: false,
        index: 0,
        element: 'paperHeadlineInput'
      },
      paperSubtitle: {
        text: '',
        isShowInput: false,
        index: 0,
        element: 'paperSubtitleInput'
      },
      testRang: {
        text: '',
        isShowInput: false,
        index: 0,
        element: 'testRangInput'
      },
      testTime: {
        text: '',
        isShowInput: false,
        index: 0,
        element: 'testTimeInput'
      },
      testCreater: {
        text: '',
        isShowInput: false,
        index: 0,
        element: 'testCreaterInput'
      },
      payAttention: {
        text: '',
        isShowInput: false,
        index: 0,
        element: 'payAttentionInput'
      }
    }
  },
  watch: {
    paperData() {
      this.handlPaperData()
    }
  },
  created() {
    this.handlPaperData()
  },
  methods: {
    // 试卷信息数据处理
    handlPaperData() {
      let paperData = this.paperData
      console.log(paperData, 'paperData')
      if (paperData.paperInfo) {
        let paperInfoArr = paperData.paperInfo.split(';')
        this.secretSign.text = paperData.secretSign
        this.paperHeadline.text = paperData.paperHeadline
        this.paperSubtitle.text = paperData.paperSubtitle
        this.testRang.text = paperInfoArr[0].split('：')[1]
        this.testTime.text = paperInfoArr[1].split('：')[1]
        this.testCreater.text = paperInfoArr[2].split('：')[1]
        this.payAttention.text = paperData.payAttention
      }
      // this.secretSign.oldText = paperData.secretSign
      // this.paperHeadline.oldText = paperData.paperHeadline
      // this.paperSubtitle.oldText = paperData.paperSubtitle
      // this.testRang.oldText = paperInfoArr[0].split('：')[1]
      // this.testTime.oldText = paperInfoArr[1].split('：')[1]
      // this.testCreater.oldText = paperInfoArr[2].split('：')[1]
      // this.payAttention.oldText = paperData.payAttention
    }
  }
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.paper-header {
  position: relative;
  margin-top: 10px;
  .marktag-box {
    height: 30px;
  }
  .test-marktag {
    line-height: 30px;
    color: $color-theme-l;
    .iconstar {
      margin: 0 2px;
    }
    .edit-input {
      text-align: left;
      text-indent: 6px;
    }
  }
  .test-title {
    margin: 3px 0;
    text-align: center;
    .head-title {
      // height: 42px;
      line-height: 42px;
      .edit-input {
        padding: 8px 0;
        font-size: $font-size-large-x;
        font-weight: 700;
      }
    }
    .sub-title {
      height: 32px;
      line-height: 32px;
      .edit-input {
        font-size: $font-size-medium-x;
        font-weight: 700;
      }
    }
  }
  .test-time {
    height: 26px;
    line-height: 26px;
    margin: 6px 0;
    text-align: center;
    .item {
      margin-right: 36px;
    }
    .edit-input {
      width: 60px;
    }
  }
  .test-input {
    margin: 3px 60px 22px 140px;
    .item {
      display: inline-block;
      margin-right: 30px;
      .line {
        display: inline-block;
        margin-left: 5px;
        width: 85px;
        height: 16px;
        border-bottom: 1px solid $color-text;
      }
    }
  }
  .test-score {
    margin-bottom: 30px;
    text-align: center;
    .score-table {
      display: inline-block;
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
  }
  .test-rule {
    margin-bottom: 36px;
    .rule-title {
      margin-bottom: 12px;
      font-weight: 700;
    }
    .rule-text {
      line-height: 20px;
    }
    .edit-input {
      width: 60%;
      height: 100px;
      text-align: left;
      padding: 6px;
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
</style>
