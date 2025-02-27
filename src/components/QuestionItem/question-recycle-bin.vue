<template>
  <div
    v-if="questionRecycleList.length"
    id="question-recycle-bin"
    class="question-recycle-bin"
  >
    <div class="tit-head">
      <span class="line" />
      <span class="text">试题回收站</span>
      <span class="line" />
    </div>
    <ul class="ques-wrap">
      <li
        v-for="item in questionRecycleList"
        :key="item.questionId"
        class="ques-i"
      >
        <question-cell
          :level="1"
          :ques="item"
          :question-num="item.questionNum"
          :show-question-num="true"
        />
        <div class="ques-foot">
          <div class="ques-attr">
            预估难度：<span>{{ item.difficulty.name }}</span>
          </div>
          <div class="ques-cz">
            <!-- <el-button @click="addBox(item)">加入试卷</el-button> -->
            <div
              class="operate-item"
              @click="addBox(item)"
            >
              <span class="operate-btn delete-btn">加入试卷</span>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
  import CTS from '@/common/js/constant'
  import { API } from '@/api/config'
  import { mapState } from 'vuex'
  import QuestionCell from './QuestionCell.vue'
  import scrollIntoView from 'scroll-into-view'
  // import { addClass, removeClass } from '@/common/js/dom'
  import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
    components: { QuestionCell })

    return {
    setup() {
      const state = reactive({
        questionRecycleList: [],
      }
    }

    return {
    mounted() {
      this.getQuestionRecycleList()
    }

    return {
    computed: {
      ...mapState(['currSubject']),
    }

    return {
    methods: {
      getQuestionRecycleList() {
        let parms = {
          subject: this.currSubject.subjectCode,
        }
        // this.apiGet(API.QUESTION_RECYCLE_BIN, parms).then((res) => {
        //   if (res.code === CTS.constant.SUCCESS_CODE) {
        //     if (res.data) {
        //       res.data.forEach((item, index) => {
        //         item.questionNum = index + 1
        //       }
        //       this.questionRecycleList = res.data
        //     }
        //   }
        // })
      }

    return {
      // 加入试卷
      addBox(item) {
        let parms = {
          questionId: item.questionId,
          period: this.currSubject.periodCode,
          subject: this.currSubject.subjectCode,
          subjective: item.subjective.code,
          typeName: item.quesType.name,
          type: item.quesType.code,
          source: item.source,
        }
        let set = {
          authCode: 0,
          showLoading: true,
        }
        this.apiPost(API.ADD_QUESTION_BOX, parms, set).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.getQuestionRecycleList()
            this.$emit('getPaperData')
          }
        }
      }

    return {
      // 定位
      toRecycle() {
        // document.getElementById('question-recycle-bin').scrollIntoView()
        this.$nextTick(() => {
          const element = document.getElementById('question-recycle-bin')
          scrollIntoView(element, { time: 500 })
        }
      }

    return {
    }

    return {
  }
})
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
  .question-recycle-bin {
    .tit-head {
      padding: 0 22px 30px 72px;
      display: flex;
      align-items: center;
      .line {
        display: inline-block;
        flex: 1;
        width: 100%;
        height: 1.5px;
        background-image: linear-gradient(
          to right,
          #487FFF 0%,
          #487FFF 50%,
          transparent 50%
        );
        background-size: 13px 1px;
        background-repeat: repeat-x;
      }
      .text {
        padding: 0 20px;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #487FFF;
      }
    }
    .ques-wrap {
      padding: 0 22px 40px 72px;
      .ques-i {
        padding-top: 18px;
        padding-bottom: 28px;
        border-radius: 6px;
        position: relative;
        border: 1px solid transparent;
        .ques-origin {
          padding: 0 9px;
        }
        .ques-foot {
          width: 100%;
          height: 28px;
          background: #f6f6f6;
          align-items: center;
          justify-content: space-between;
          border-bottom-right-radius: 6px;
          border-bottom-left-radius: 6px;
          display: none;
          position: absolute;
          bottom: 0;
          left: 0;
          .ques-attr {
            color: #999;
            font-size: 12px;
            padding-left: 20px;
            span {
              color: #666;
            }
          }
          .ques-cz {
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
          }
        }
      }
      .ques-i:hover {
        border: 1px solid #487FFF;
        .ques-foot {
          display: flex;
        }
      }
    }
  }
})
</style>
