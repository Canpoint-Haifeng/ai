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
        class="question-type-difficulty"
        @click="toggleExplain(questionIndex)"
      >
        <span class="item">题型：<em class="">{{
          questionItem.questionInfo.quesType | isEmptyObject('name')
        }}</em></span>
        <span class="item">预估难度：<em class="">{{
          questionItem.questionInfo.difficulty | isEmptyObject('name')
        }}</em></span>
        <div class="comment-item item">
          <!-- <span class="item-content">
            <span style="color: #ff7e3d; padding-right: 5px">{{
              questionItem.commentCount
            }}</span
            >评论</span
          > -->
        </div>
        <!-- <span class="item">推荐时间：<em class="">{{ questionItem.creteTime }}</em></span>
          <ShareQuestionPopover :subjectCode="currSubject.subjectCode" :questionId="questionItem.questionInfo.questionId">
          </ShareQuestionPopover> -->
      </div>
      <div class="select-good-question">
        <div
          v-if="questionItem.recommendedType == 2"
          class="recommended-user-info"
        >
          <img
            class="user-avatar"
            :src="questionItem.img"
            alt=""
          >
          <div class="use-name">
            {{ questionItem.nickName }}
          </div>
        </div>
        <span
          class="good-question-content"
          v-html="questionItem.reason"
        />
      </div>
      <div
        ref="renderQuestionRef"
        class="question-content"
        @click="toggleExplain(questionIndex)"
      >
        <!--是否 有音频 -->
        <!-- <AudioPlay v-if="quesitonAudio" :audiourl="quesitonAudio"></AudioPlay> -->

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
          :knowledges-data="questionItem.questionInfo.knowledge||[]"
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
      <!-- <div class="question-id color-9 clearfix" v-if="!questionItem.hideQuestionId">ID: {{questionItem.questionInfo.questionId}}</div> -->
      <!-- 试题操作区 -->
      <!-- <slot name="questoinOperate"> -->
      <div class="question-bottom">
        <div class="question-info color-9 font-12">
          <span class="item">更新：<em class="">{{
            questionItem.creteTime
          }}</em></span>
          <span class="item">组卷：<em class="">{{
            questionItem.questionInfo.useCount
              ? questionItem.questionInfo.useCount
              : 0
          }}</em></span>
        </div>
        <div
          v-if="showView === 1"
          class="question-rate color-9 font-12"
        >
          <!-- <span class="text">评分：</span>
            <el-rate
              class="rate-wrapper"
              :colors="['#F57B5F']"
              void-color="#F57B5F"
              disabled-void-color="#F57B5F"
              v-model="questionItem.rateScore"
              @change="changeRateScore">
            </el-rate> -->
        </div>
        <div class="question-operate">
          <span
            class="operate-btn check-btn"
            @click="checkQuestionLike"
          >
            <i
              class="iconfont"
              :class="
                questionItem.isLike ? 'iconheart-3-fill' : 'iconheart-3-line'
              "
            />{{ questionItem.likeCount }}
          </span>

          <span
            v-if="
              !questionItem.hideCollect && questionItem.questionInfo.canCollect
            "
            class="operate-btn collected-btn gl"
            @click.stop="collectQuestion"
          >
            <span>
              <i
                class="iconfont"
                :class="{
                  iconquxiaoshoucang: questionItem.isCollected,
                  iconshoucang: !questionItem.isCollected,
                }"
              />{{ questionItem.isCollected ? '取消收藏' : '收藏试题' }}
            </span>
          </span>
          <span
            v-if="showView === 0"
            class="operate-btn check-btn"
            @click="checkQuestionDetail"
          >
            <i class="iconfont icondetail" />详情
          </span>
          <span
            v-if="!questionItem.questionInfo.canCollect"
            class="hide-collect-black"
          >&nbsp;</span>
          <!-- <span @click="collectQuestion" class="operate-btn collected-btn">
              <i class="iconfont " :class="{'iconshoucang':!(questionItem.isCollected===1),'iconquxiaoshoucang':(questionItem.isCollected===1)}"></i>
              {{(questionItem.isCollected===1)?'取消收藏':'收藏'}}
            </span> -->
          <span
            v-if="showChangeQues"
            class="operate-btn add-btn"
            @click="changeQuestionBox"
          >
            选用此题
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
  </li>
</template>

<script>
  import QuestionCell from './QuestionCell.vue'
  import QuestionKnowledge from './QuestionKnowledge'
  import AnswerAnalysis from './AnswerAnalysis'
  import { mapState } from 'vuex'
  import AudioPlay from '@/components/AudioPlay/index'
  import ShareQuestionPopover from './ShareQuestionPopover'
  import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
    components: {
      QuestionCell,
      QuestionKnowledge,
      AnswerAnalysis,
      AudioPlay,
      ShareQuestionPopover,
    }

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
      showTypePart: {
        type: Boolean,
        default: true,
      }

    return {
      showError: {
        type: Boolean,
        default: true,
      }

    return {
      showDelete: {
        type: Boolean,
        default: false,
      }

    return {
      showRegion: {
        type: Boolean,
        default: false,
      }

    return {
      showExplain: {
        // 是否显示答案和解析
        type: Boolean,
        default: false,
      }

    return {
      autoRender: {
        // 是否自动渲染
        type: Boolean,
        default: true,
      }

    return {
      showSimilar: {
        // 显示 相似题
        type: Boolean,
        default: false,
      }

    return {
      idExtends: {
        type: String,
        default: '',
      }

    return {
      showEdit: {
        // 显示 编
        type: Boolean,
        default: false,
      }

    return {
      showChangeQues: {
        // 显示 选用此题
        type: Boolean,
        default: false,
      }

    return {
    }

    return {
    watch: {
      questionItem() {
        this.renderflag = false
        this.$nextTick(() => {
          this.renderflag = true
          this.onRenderJax()
        }
      }

    return {
      'questionItem.showExplain'() {
        if (this.renderflag && this.questionItem.showExplain) {
          this.$nextTick(() => {
            this.onRenderJax()
          }
        }
      }

    return {
    }

    return {
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
      }

    return {
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

    return {
    setup() {
      const state = reactive({
        renderflag: true,
        showInmation: false,
        elLeft: 0, // 当前点击购物车按钮在网页中的绝对top值
        elTop: 0, // 当前点击购物车按钮在网页中的绝对left值
      }
    }

    return {
    methods: {
      checkEditQuesiton() {
        this.$emit('checkEditQuesiton', this.questionItem)
      }

    return {
      checkSimilarQuesiton() {
        this.$emit('checkSimilarQuesiton', this.questionItem)
        // period: 12
        // subjectCode: 1212
        // knowledge: 11103187
        // excludeQids: bd710dae-9d92-43c6-b27a-42d489b967f5
        // currPage: 1
        // pageSize: 5
        // nowData: 2021-05-31T07:15:22.258Z
      }

    return {
      openVip() {
        // CpBuyVip.install({})
      }

    return {
      openSchool() {
        this.$router.push({
          path: '/open/campus/service',
        }
      }

    return {
      // 试题评分
      changeRateScore(rateScore) {
        this.$emit(
          'changeRateScore',
          rateScore,
          this.questionItem.questionInfo.questionId,
        )
      }

    return {
      // 查看试题详情
      checkQuestionDetail() {
        this.$emit('checkQuestionDetail', this.questionItem)
      }

    return {
      checkQuestionLike() {
        if (this.hasRepeatClick('checkQuestionLike')) return
        this.$emit('checkQuestionLike', this.questionItem)
      }

    return {
      // 试题收藏
      collectQuestion() {
        if (this.hasRepeatClick('collectQuestion')) return
        this.$emit('collectQuestion', this.questionItem)
      }

    return {
      showDeleteDialog() {
        this.$emit('showDeleteDialog', this.questionItem)
      }

    return {
      // 显示纠错提示框
      showReportDialog() {
        this.$emit('showReportDialog', this.questionItem)
      }

    return {
      // 移除试题从试题篮
      deleteQuestionBox() {
        this.$emit('deleteQuestionBox', this.questionItem, this.showView)
      }

    return {
      changeQuestionBox() {
        this.$emit('changeQuestionBox', this.questionItem)
      }

    return {
      // 添加试题到试题篮
      addQuestionBox($event) {
        this.$emit('addQuestionBox', this.questionItem, $event)
      }

    return {
      // 显示答案
      toggleExplain(questionIndex) {
        if (this.showView) {
          this.$emit('toggleExplainDetail', this.questionItem)
        } else {
          this.$emit('toggleExplain', this.questionItem, questionIndex)
        }
      }

    return {
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
      }

    return {
      visibleChange(visible) {
        // console.log(visible)
      }

    return {
      onRenderJax() {
        this.onRenderJaxPage('renderQuestionRef')
      }

    return {
    }

    return {
  }
})
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
})

  .ques-cell {
    width: 100%;
  }
})

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

    .share-item {
      position: absolute;
      right: 30px;
      top: 0px;

      .item {
        padding-right: 20px;
      }
    }
  }
})

  .question-wrapper-faber .question-source {
    padding: 10px 36px;
  }
})

  .ques-explain-part {
    padding: 10px 28px;
    border-top: 1px solid #eeeeee;
  }
})

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
})

  .hide-collect-black {
    display: inline-block;
    height: 14px;
    width: 25px;
  }
})

  .select-good-question {
    margin: 20px 20px 0px 20px;
    padding: 15px 20px 15px 20px;
    background-color: #fff8f1;
    border-radius: 6px;

    .good-question-title {
      font-weight: bold;
      color: #666666;
    }

    .good-question-content {
      color: #666666;
      line-height: 24px;
      letter-spacing: 1px;
      word-break: break-all;
    }
  }
})

  .recommended-user-info {
    padding-bottom: 8px;
    .user-avatar {
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      vertical-align: bottom;
    }
    .use-name {
      display: inline-block;
      line-height: 30px;
      font-size: 14px;
      font-weight: bold;
      color: #222222;
      padding-left: 8px;
    }
  }
})

  .comment-item.item {
    position: absolute;
    top: 0;
    right: 0;
    .item-content {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
    }
  }
})
</style>
