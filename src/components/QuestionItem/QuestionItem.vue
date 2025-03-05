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
        <i
          v-if="questionItem.questionInfo.level"
          class="level"
          :style="{ background: levels[questionItem.questionInfo.level].color }"
        >{{
          levels[questionItem.questionInfo.level].name }}</i>
      </div>
    </div>
  </li>
</template>
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
            <template #reference>
              <span class="icon iconquestion-fill"></span>
            </template>
          </el-popover>
          推荐好题
        </span> -->
        <div
          v-if="itemObj"
          class="item-time item"
        >
          <span class="item">推荐时间：<em class="">{{ itemObj.creteTime }}</em></span>
        </div>
        <!-- <span class="share-item" v-if="showShareQuestion && questionItem.source == 1">
          <ShareQuestionPopover :reloadImgUrl="reloadShareImgUrl" :subjectCode="currSubject.subjectCode"
            :questionId="questionItem.questionInfo.questionId" @createShareId="createShareId"></ShareQuestionPopover>
        </span> -->
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
          :ques-struct-pm="questionItem.questionInfo.quesStruct &&
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
            String(questionItem.questionInfo.updateTime || questionItem.questionInfo.createTime ||
              '1724049029096').slice(0, 10) | datetime('YYYY/MM/DD')
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
              class="icon"
              :class="questionItem.isLike ? 'iconheart-3-fill' : 'iconheart-3-line'
              "
            />{{ questionItem.likeCount }}
          </span>
          <span
            v-if="hasEditQuesiton"
            class="operate-btn check-btn"
            @click.stop="checkEditQuesiton"
          >
            <i class="icon iconbianji" />{{ questionItem.questionInfo.editType == 1 ? '改编' : '编辑' }}
          </span>
          <span
            v-if="showSimilar"
            class="operate-btn check-btn"
            @click.stop="checkSimilarQuesiton"
          >
            <i class="icon el-icon-search" />相似题
          </span>
          <!-- <span v-if="isShowCancelShare" class="operate-btn check-btn" @click.stop="clickCancelShare">
            <i class="icon iconshiliangzhinengduixiang2-01"></i></template>取消分享
          </span> -->
          <span
            v-if="showView === 0"
            class="operate-btn check-btn"
            @click="checkQuestionDetail"
          >
            <i class="icon el-icon-tickets" />详情
            <!-- <a href="javascript:void(0)" onclick="window.open('http://www.baidu.com')">详情</a> -->
          </span>
          <span
            v-if="showError && questionItem.questionInfo.source != 2"
            class="operate-btn report-btn"
            @click.stop="showReportDialog"
          >
            <i class="icon el-icon-edit" />报错
          </span>
          <!-- <span class="operate-btn report-btn" v-if="showDelete" @click.stop="showDeleteDialog">
            <i class="icon el-icon-delete"></i></template>删除
          </span> -->
          <span
            v-if="
              !questionItem.hideCollect
            "
            class="operate-btn collected-btn gl"
            @click.stop="collectQuestion"
          >
            <span>
              <i
                class="icon"
                :class="{
                  'el-icon-star-on': questionItem.isCollect === 1,
                  'el-icon-star-off': questionItem.isCollect === 2,
                }"
              />{{ questionItem.isCollect === 1 ? '取消收藏' : '收藏' }}
            </span>
          </span>
          <span
            v-if="!questionItem.questionInfo.canCollect"
            class="hide-collect-black"
          >&nbsp;</span>

          <!-- <span @click="collectQuestion" class="operate-btn collected-btn">
              <i class="icon " :class="{'iconshoucang':!(questionItem.isCollected===1),'iconquxiaoshoucang':(questionItem.isCollected===1)}"></i></template>
              {{(questionItem.isCollected===1)?'取消收藏':'收藏'}}
            </span> -->
          <template v-if="showQuestionColumn">
            <span
              v-if="showChangeQues"
              class="operate-btn add-btn"
              @click="changeQuestionBox"
            >
              选用此题
            </span>
            <span
              v-if="!showChangeQues && questionItem.isQuestionBox"
              class="operate-btn remove-btn"
              @click="deleteQuestionBox"
            >
              <i class="icon iconremove">-</i></template>试题篮
            </span>
            <span
              v-if="!showChangeQues && !questionItem.isQuestionBox"
              class="operate-btn add-btn"
              @click="addQuestionBox($event)"
            >
              <i class="icon iconadd">+</i></template>试题篮
            </span>
          </template>
        </div>
      </div>
      <!-- </slot> -->
    </div>
    <!-- </transition-group> -->
  </li>
</template>

<script>
import QuestionCell from './QuestionCell.vue'
import QuestionKnowledge from './QuestionKnowledge'
import AnswerAnalysis from './AnswerAnalysis'
import { mapState } from 'vuex'
import AudioPlay from '@/components/AudioPlay/index'
import ShareQuestionPopover from './ShareQuestionPopover'
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
    itemObj: {
      type: Object,
      default: () => { },
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
    showLikePart: {
      // 是否显示喜欢 按钮
      type: Boolean,
      default: false,
    },
    autoRender: {
      // 是否自动渲染
      type: Boolean,
      default: true,
    },
    showShareQuestion: {
      // 是否显示 分享按钮
      type: Boolean,
      default: false,
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
    isShowCancelShare: {
      // 是否显示取消分享的按钮
      type: Boolean,
      default: false,
    },
    reloadShareImgUrl: {
      // 是不是每次 都要获取 图片
      type: Boolean,
      default: false,
    },
    showRecommend: Boolean,
    showQuestionColumn: {
      // 试题栏 选用此题按钮
      type: Boolean,
      default: true,
    }
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
  mounted() {
    // console.log(this.questionItem, 'questionItem---')
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
      // levels: [{}, {color: '#999', name: '初始'}, {color: '#f4bd41', name: '基础'}, {color: '#ef8944', name: '网络'}, {color: '#f59b23', name: '精品'}, {color: '#ed7764', name: '出版'}]
      levels: [{}, { color: '#ef8944', name: '网络' }, { color: '#ef8944', name: '网络' }, { color: '#f59b23', name: '精品' }, { color: '#ed7764', name: '出版' }]
    }
  },
  methods: {
    createShareId() {
      this.eventStatistics([
        '_trackEvent',
        '试题详情',
        '点击试题分享',
        '次数',
      ])
      this.eventStatistics([
        '_trackEvent',
        '组卷预览',
        '点击组卷分享',
        '次数',
      ])

      this.$emit('createShareId', this.questionItem)
    },
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
    checkQuestionLike() {
      if (this.hasRepeatClick('checkQuestionLike')) return
      this.$emit('checkQuestionLike', this.questionItem)
    },
    // 查看试题详情
    checkQuestionDetail() {
      this.$emit('checkQuestionDetail', this.questionItem)
    },
    // 试题收藏
    collectQuestion() {
      if (this.hasRepeatClick('collectQuestion')) return
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
    onRecommendQuestion() {
      this.$emit('recommendQuestion', this.questionItem)
    },
    // 添加试题到试题篮
    addQuestionBox($event) {
      this.$emit('addQuestionBox', this.questionItem, $event)
    },
    // 显示答案
    toggleExplain(questionIndex) {
      // if (this.showView) {
      //   this.$emit('toggleExplainDetail', this.questionItem)
      // } else {
      this.$emit('toggleExplain', this.questionItem, questionIndex)
      // }
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
      window.open(this.$router.resolve('/paper/detail').href + queryStr)
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
    skipGoodPlaza() {
      this.openWindowLink('/paper/plaza/goodQuestion?tabs=2')
    },
    onRenderJax() {
      this.onRenderJaxPage('renderQuestionRef')
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.question-wrapper-faber {
  .question-container {
    border-radius: 6px;
  }

  .question-bottom {
    border-radius: 0 0 6px 6px;

    .question-operate {
      .operate-btn .icon {
        color: #fea600;
        margin-right: 6px;
        font-size: 14px;
      }

      .operate-btn.remove-btn .iconremove,
      .operate-btn.add-btn .iconadd {
        color: #ffffff;
      }

      .operate-btn:hover {
        color: #487FFF;

        .icon {
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
  position: relative;
  overflow: hidden;
  ;

  .level {
    position: absolute;
    right: -15px;
    top: 6px;
    width: 60px;
    line-height: 42px;
    text-align: center;
    color: #fff;
    font-size: 12px;
    line-height: 16px;
    transform: rotate(45deg);
  }

  &>.item {
    color: #999999;
    padding-right: 18px;

    &>em {
      color: #666666;
    }
  }

  &>.share-item {
    float: right;
    color: #666666;
  }

  .item-time {
    position: absolute;
    right: 50px;
    top: 0px;

    .item {
      padding-right: 20px;
    }
  }

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

    .icon {
      display: inline-block;
      font-size: 14px;
      color: #487FFF;
      padding-right: 5px;
      vertical-align: bottom;
    }
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

.link-good-plaza {
  color: $color-theme;
  user-select: none;
  cursor: pointer;
}
</style>
