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
        <!-- <span
          class="item-recommend"
          v-if="showRecommend"
          @click="onRecommendQuestion"
        >
          <el-popover placement="top-start" width="300" trigger="hover">
            <div>
              推荐好题功能：可将优质试题分享到好题广场，推荐给其他老师一起讨论使用。<br />
              规则：<br />
              1、选择好题进行推荐，编写符合规范的推题理由即可发布到<span
                class="link-good-plaza"
                @click="skipGoodPlaza"
                >好题广场</span
              >；<br />
              2、成功推荐可获得3个胖大海，每天最多可推荐1次；<br />
              3、推题理由需填写规范有效的内容，如内容无效官方有权下架推荐内容并收回奖励，发现3次取消推题资格<br />
            </div>
            <span v-slot:reference class="iconfont iconquestion-fill"></span>
          </el-popover>
          推荐好题
        </span> -->
        <div
          v-if="itemObj"
          class="item-time item"
        >
          <span class="item">推荐时间：<em class="">{{ itemObj.creteTime }}</em></span>
        </div>
        <span
          v-if="showShareQuestion && questionItem.source == 1"
          class="share-item"
        >
          <ShareQuestionPopover
            :reload-img-url="reloadShareImgUrl"
            :subject-code="currSubject.subjectCode"
            :question-id="questionItem.questionInfo.questionId"
            @create-share-id="createShareId"
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
          :knowledges-data="questionItem.questionInfo.knowledge || []"
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
        <!-- 来源：
        <span
          class="color-3"
          @click="handleCommand(questionItem.questionSourceList[0])"
        >
          {{
            questionItem.questionSourceList[0].paperName
              ? questionItem.questionSourceList[0].paperName
              : '未获取到试卷名称'
          }}
        </span> -->
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
            questionItem.questionInfo.updateTime | datetime('YYYY/MM/DD')
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
            v-if="showLikePart"
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
            v-if="hasEditQuesiton"
            class="operate-btn check-btn"
            @click.stop="checkEditQuesiton"
          >
            <i class="iconfont iconbianji" />{{ questionItem.questionInfo.editType == 1 ? '改编' : '编辑' }}
          </span>
          <span
            v-if="showSimilar"
            class="operate-btn check-btn"
            @click.stop="checkSimilarQuesiton"
          >
            <i class="iconfont iconsearch" />相似题
          </span>
          <span
            v-if="isShowCancelShare"
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
            <!-- <a href="javascript:void(0)" onclick="window.open('http://www.baidu.com')">详情</a> -->
          </span>
          <span
            v-if="showError && questionItem.questionInfo.source != 2"
            class="operate-btn report-btn"
            @click.stop="showReportDialog"
          >
            <i class="iconfont iconreport" />纠错
          </span>

          <span
            v-if="showDelete"
            class="operate-btn report-btn"
            @click.stop="showDeleteDialog"
          >
            <i class="iconfont iconshanchu" />删除
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
              />{{ questionItem.isCollected ? '取消收藏' : '收藏' }}
            </span>
          </span>

          <span
            v-if="!questionItem.questionInfo.canCollect"
            class="hide-collect-black"
          >&nbsp;</span>

          <!-- <span @click="collectQuestion" class="operate-btn collected-btn">
              <i class="iconfont " :class="{'iconshoucang':!(questionItem.isCollected===1),'iconquxiaoshoucang':(questionItem.isCollected===1)}"></i>
              {{(questionItem.isCollected===1)?'取消收藏':'收藏'}}
            </span> -->

          <!-- v-if="showChangeQues" 需要加上 -->
          <span
            class="operate-btn add-btn"
            @click="changeQuestionBox"
          >
            选用此题
          </span>
          <!-- <span
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
          </span> -->
        </div>
      </div>
      <!-- </slot> -->
    </div>
    <!-- </transition-group> -->
  </li>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
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
    itemObj: {
      type: Object,
      default: () => {})

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
    showLikePart: {
      // 是否显示喜欢 按钮
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
    showShareQuestion: {
      // 是否显示 分享按钮
      type: Boolean,
      default: false,
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
    isShowCancelShare: {
      // 是否显示取消分享的按钮
      type: Boolean,
      default: false,
    }

    return {
    reloadShareImgUrl: {
      // 是不是每次 都要获取 图片
      type: Boolean,
      default: false,
    }

    return {
    showRecommend: Boolean,
  }
})

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
})

    return {
  mounted() {
    // console.log(this.questionItem, 'questionItem---')
  }
})

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
})

    return {
  setup() {
    const state = reactive({
      renderflag: true,
      showInmation: false,
      elLeft: 0, // 当前点击购物车按钮在网页中的绝对top值
      elTop: 0, // 当前点击购物车按钮在网页中的绝对left值
    }
  }
})

    return {
  methods: {
    createShareId() {
      this.eventStatistics(['_trackEvent', '试题详情', '点击试题分享', '次数'])
      this.eventStatistics(['_trackEvent', '组卷预览', '点击组卷分享', '次数'])

      this.$emit('createShareId', this.questionItem)
    }

    return {
    clickCancelShare() {
      this.$emit('clickCancelShare', this.questionItem)
    }

    return {
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
    checkQuestionLike() {
      if (this.hasRepeatClick('checkQuestionLike')) return
      this.$emit('checkQuestionLike', this.questionItem)
    }

    return {
    // 查看试题详情
    checkQuestionDetail() {
      this.$emit('checkQuestionDetail', this.questionItem)
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
    onRecommendQuestion() {
      this.$emit('recommendQuestion', this.questionItem)
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
      // this.$router.push({
      //   name: 'paperDetail',
      //   query: {
      //     paperIdEnc: command.paperIdEnc,
      //     source: command.source || 2
      //   }
      // })
    }

    return {
    visibleChange(visible) {
      // console.log(visible)
    }

    return {
    skipGoodPlaza() {
      this.openWindowLink('/paper/plaza/goodQuestion?tabs=2')
    }

    return {
    onRenderJax() {
      this.onRenderJaxPage('renderQuestionRef')
    }

    return {
  }
})

    return {
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.question-wrapper-faber {
  .question-container {
    border-radius: 6px;
  }
})
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
})
}
.ques-cell {
  width: 100%;
}

.question-type-difficulty {
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #eeeeee;
  box-sizing: border-box;
  & > .item {
    color: #999999;
    padding-right: 18px;
    & > em {
      color: #666666;
    }
  }
})
  & > .share-item {
    float: right;
    color: #666666;
  }
})
  .item-time {
    position: absolute;
    right: 50px;
    top: 0px;
    .item {
      padding-right: 20px;
    }
  }
})
  .item-recommend {
    display: inline-block;
    width: 104px;
    line-height: 28px;
    border-radius: 15px;
    opacity: 1;
    border: 1px solid #487FFF;
    text-align: center;

    font-size: 14px;
    color: #487FFF;
    .iconfont {
      display: inline-block;
      font-size: 14px;
      color: #487FFF;
      padding-right: 5px;
      vertical-align: bottom;
    }
  }
})
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
})
}
.hide-collect-black {
  display: inline-block;
  height: 14px;
  width: 25px;
}
.link-good-plaza {
  color: $color-theme;
  user-select: none;
  cursor: pointer;
}
</style>
