<template>
  <li
    :id="questionItem.questionInfo.questionId + idExtends"
    ref="questionDom"
    class="question-wrapper-faber"
  >
    <div class="question-container">
      <!--试题整体-->
      <div
        v-if="showTypePart"
        class="question-type-difficulty clearfix"
      >
        <span class="item">题型：<em class="">{{
          questionItem.questionInfo.quesType | isEmptyObject('name')
        }}</em></span>
        <span class="item">预估难度：<em class="">{{
          questionItem.questionInfo.difficulty | isEmptyObject('name')
        }}</em></span>

        <span class="share-item">
          <ShareQuestionPopover
            :subject-code="currSubject.subjectCode"
            :question-id="questionItem.questionInfo.questionId"
          />
        </span>
      </div>
      <slot name="reason" />
      <div
        ref="renderQuestionRef"
        class="question-content"
        @click="toggleExplain(questionIndex)"
      >
        <!--是否 有音频 -->
        <AudioPlay
          v-if="quesitonAudio"
          :audiourl="quesitonAudio"
        />

        <!-- 试题展示区 -->
        <question-cell
          v-if="questionItem && renderflag"
          :show-attr="showAttr"
          :show-region="showRegion"
          :level="1"
          :ques-struct-pm="
            questionItem.questionInfo.quesStruct &&
              questionItem.questionInfo.quesStruct.code
              ? questionItem.questionInfo.quesStruct.code
              : '-1'
          "
          :ques="questionItem.questionInfo"
          :show-question-num="questionItem.showQuestionNum"
          :question-num="questionItem.questionNum"
          :show-explain="questionItem.showExplain"
        />
      </div>
      <!--试题考点区-->
      <div
        v-if="questionItem.showExplain || questionItem.showKnowledge"
        class="ques-explain-part"
      >
        <question-knowledge
          :show-knowledge="questionItem.showKnowledge"
          :show-explain-code="questionItem.questionInfo.showExplainCode"
          :show-login="questionItem.showLogin"
          :knowledges-data="questionItem.questionInfo.knowledge"
        />

        <div
          v-if="questionItem.questionInfo.showExplainCode"
          class="explain-code-info"
        >
          很抱歉，您每日最多可查看30题的答案解析，<br>
          如需查看更多请<span
            class="active-serve"
            @click="openVip"
          >开通会员服务</span>或<span
            class="active-serve"
            @click="openSchool"
          >开通校园服务</span>享受解析畅享服务
        </div>
        <!-- analysisQuesConfig 可能 又分析的 题目结构 -->
        <!-- 试题解析答案 -->
        <answer-analysis
          v-if="
            questionItem.showExplain &&
              !questionItem.questionInfo.showExplainCode
          "
          :ques="questionItem.questionInfo"
        />
      </div>

      <!-- 试题试卷来源区 -->
      <div
        v-if="
          questionItem.questionSourceList &&
            questionItem.questionSourceList.length > 0 &&
            questionItem.questionSourceList != null
        "
        class="question-source color-9 font-12"
      >
        来源：
        <span
          class="color-3"
          @click="handleCommand(questionItem.questionSourceList[0])"
        >
          {{
            questionItem.questionSourceList[0].paperName
              ? questionItem.questionSourceList[0].paperName
              : '未获取到试卷名称'
          }}
        </span>
        <el-dropdown
          v-if="questionItem.questionSourceList.length > 1"
          placement="bottom"
          class="custom-dropdown"
          @command="handleCommand"
          @visible-change="visibleChange"
        >
          <el-button
            type="text"
            class="dropdown-text"
          >
            <span class="text">更多<i class="el-icon-arrow-down el-icon--right" /></span>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu class="custom-dropdown-menu">
              <el-dropdown-item
                v-for="item in questionItem.questionSourceList"
                :key="item.paperId"
                class="dropdown-menu-item"
                :command="item"
              >
                {{ item.paperName ? item.paperName : '未获取到试卷名称' }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <div class="question-bottom">
        <div class="question-info color-9 font-12">
          <span class="item">分享：<em class="">{{
            questionItem.createTime | datetime('YYYY/MM/DD')
          }}</em></span>

          <span class="item">喜欢：<em class="">{{ questionItem.likeCount || 0 }}</em></span>
          <span class="item">收藏：<em class="">{{ questionItem.collectCount || 0 }}</em></span>
          <span class="item">已获得：<em class="">{{ questionItem.rewardCount || 0 }}</em><span class="iconfont iconquan" /></span>
        </div>
        <div
          v-if="showView === 1"
          class="question-rate color-9 font-12"
        />
        <div class="question-operate">
          <span
            class="operate-btn check-btn"
            @click.stop="clickCancelShare"
          >
            <i class="iconfont iconshiliangzhinengduixiang2-01" />取消分享
          </span>
          <span
            v-if="showView === 0"
            class="operate-btn check-btn"
            @click="checkQuestionDetail"
          >
            <i class="iconfont icondetail" />详情
          </span>

          <span
            v-if="!showChangeQues && questionItem.isAddedToBox"
            class="operate-btn remove-btn"
            @click="deleteQuestionBox"
          >
            <i class="iconfont iconremove">-</i>试题篮
          </span>
          <span
            v-if="!showChangeQues && !questionItem.isAddedToBox"
            class="operate-btn add-btn"
            @click="addQuestionBox($event)"
          >
            <i class="iconfont iconadd">+</i>试题篮
          </span>
        </div>
      </div>
      <!-- </slot> -->
    </div>
    <!-- </transition-group> -->
  </li>
</template>

<script>
  import QuestionCell from '@/components/QuestionItem/QuestionCell.vue'
  import QuestionKnowledge from '@/components/QuestionItem/QuestionKnowledge'
  import AnswerAnalysis from '@/components/QuestionItem/AnswerAnalysis'
  import { mapState } from 'vuex'
  import AudioPlay from '@/components/AudioPlay/index'
  import ShareQuestionPopover from '@/components/QuestionItem/ShareQuestionPopover'

  export default {
    components: {
      QuestionCell,
      QuestionKnowledge,
      AnswerAnalysis,
      AudioPlay,
      ShareQuestionPopover,
    },
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
      showTypePart: {
        type: Boolean,
        default: true,
      },
      showError: {
        type: Boolean,
        default: true,
      },
      showDelete: {
        type: Boolean,
        default: false,
      },
      showRegion: {
        type: Boolean,
        default: false,
      },
      showExplain: {
        // 是否显示答案和解析
        type: Boolean,
        default: false,
      },
      autoRender: {
        // 是否自动渲染
        type: Boolean,
        default: true,
      },
      showSimilar: {
        // 显示 相似题
        type: Boolean,
        default: false,
      },
      idExtends: {
        type: String,
        default: '',
      },
      showEdit: {
        // 显示 编
        type: Boolean,
        default: false,
      },
      showChangeQues: {
        // 显示 选用此题
        type: Boolean,
        default: false,
      },
    },
    watch: {
      questionItem() {
        this.renderflag = false
        this.$nextTick(() => {
          this.renderflag = true
          this.onRenderJax()
        })
      },
      'questionItem.showExplain'() {
        if (this.renderflag && this.questionItem.showExplain) {
          this.$nextTick(() => {
            this.onRenderJax()
          })
        }
      },
    },
    computed: {
      ...mapState(['currSubject']),
      hasEditQuesiton() {
        if (
          this.showEdit &&
          this.questionItem &&
          this.questionItem.questionInfo
        ) {
          let editType = this.questionItem.questionInfo.editType
          // let canAdapted = this.questionItem.questionInfo.canAdapted
          if (editType == 1 || editType == 2) {
            return true
          } else {
            return false
          }
        } else {
          return false
        }
      },
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
    data() {
      return {
        renderflag: true,
        showInmation: false,
        elLeft: 0, // 当前点击购物车按钮在网页中的绝对top值
        elTop: 0, // 当前点击购物车按钮在网页中的绝对left值
      }
    },
    methods: {
      clickCancelShare() {
        this.$emit('clickCancelShare', this.questionItem)
      },
      checkEditQuesiton() {
        this.$emit('checkEditQuesiton', this.questionItem)
      },
      checkSimilarQuesiton() {
        this.$emit('checkSimilarQuesiton', this.questionItem)
        // period: 12
        // subjectCode: 1212
        // knowledge: 11103187
        // excludeQids: bd710dae-9d92-43c6-b27a-42d489b967f5
        // currPage: 1
        // pageSize: 5
        // nowData: 2021-05-31T07:15:22.258Z
      },
      openVip() {
        // CpBuyVip.install({})
      },
      openSchool() {
        this.$router.push({
          path: '/open/campus/service',
        })
      },
      // 试题评分
      changeRateScore(rateScore) {
        this.$emit(
          'changeRateScore',
          rateScore,
          this.questionItem.questionInfo.questionId,
        )
      },
      // 查看试题详情
      checkQuestionDetail() {
        this.$emit('checkQuestionDetail', this.questionItem)
      },
      // 试题收藏
      collectQuestion() {
        this.$emit('collectQuestion', this.questionItem)
      },
      showDeleteDialog() {
        this.$emit('showDeleteDialog', this.questionItem)
      },
      // 显示纠错提示框
      showReportDialog() {
        this.$emit('showReportDialog', this.questionItem)
      },
      // 移除试题从试题篮
      deleteQuestionBox() {
        this.$emit('deleteQuestionBox', this.questionItem, this.showView)
      },
      changeQuestionBox() {
        this.$emit('changeQuestionBox', this.questionItem)
      },
      // 添加试题到试题篮
      addQuestionBox($event) {
        this.$emit('addQuestionBox', this.questionItem, $event)
      },
      // 显示答案
      toggleExplain(questionIndex) {
        if (this.showView) {
          this.$emit('toggleExplainDetail', this.questionItem)
        } else {
          this.$emit('toggleExplain', this.questionItem, questionIndex)
        }
      },
      // 切换试卷来源
      handleCommand(command) {
        let source = command.source || 2
        let queryStr =
          '?paperIdEnc=' +
          command.paperIdEnc +
          '&source=' +
          source +
          '&viewCount=-1'
        queryStr += '&subject=' + this.currSubject.subjectCode
        window.open(this.$router.resolve('/paper/detail').href+queryStr)
        // this.$router.push({
        //   name: 'paperDetail',
        //   query: {
        //     paperIdEnc: command.paperIdEnc,
        //     source: command.source || 2
        //   }
        // })
      },
      visibleChange(visible) {
        // console.log(visible)
      },
      onRenderJax() {
        this.onRenderJaxPage('renderQuestionRef')
      },
    },
  }
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
  .question-wrapper-faber {
    .question-container {
      border-radius: 6px;
    }
    .question-bottom {
      border-radius: 0 0 6px 6px;
      .question-operate {
        .operate-btn .iconfont {
          color: #fea600;
        }
        .operate-btn.remove-btn .iconremove,
        .operate-btn.add-btn .iconadd {
          color: #ffffff;
        }
        .operate-btn:hover {
          color: #487FFF;
          .iconfont {
            color: #fea600;
          }
          &.remove-btn,
          &.add-btn {
            color: #ffffff;
            .iconremove,
            .iconadd {
              color: #ffffff;
            }
          }
        }
      }
      .operate-btn.collected-btn.gl,
      .operate-btn.collect-btn.gl {
        width: 72px;
        display: inline-block;
      }
    }
  }
  .ques-cell {
    width: 100%;
  }

  .question-type-difficulty {
    padding: 0 20px;
    line-height: 42px;
    border-bottom: 1px solid #eeeeee;
    & > .item {
      color: #999999;
      padding-right: 18px;
      & > em {
        color: #666666;
      }
    }
    & > .share-item {
      float: right;
      color: #666666;
    }
  }
  .question-wrapper-faber .question-source {
    padding: 10px 36px;
  }

  .ques-explain-part {
    padding: 10px 28px;
    border-top: 1px solid #eeeeee;
  }

  .explain-code-info {
    padding: 29px 0;
    text-align: center;
    background: #f4f4f4;
    color: #999999;
    margin: 10px 0;
    line-height: 20px;
    .active-serve {
      color: $color-theme;
      text-decoration: underline;
    }
  }
  .hide-collect-black {
    display: inline-block;
    height: 14px;
    width: 25px;
  }
  .question-info {
    .item {
      .iconfont {
        color: #999999;
        display: inline-block;
        padding-left: 5px;
        font-size: 12px;
      }
    }
  }
</style>
