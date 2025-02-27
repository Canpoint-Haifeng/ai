<!--
试题内容渲染 根据 不同的类型 显示不同的内容
eg:
 import renderQuestion from '@/components/question-template/render-question-cell.vue'
 <render-question-cell :ques="ques"></render-question-cell>
 题目试题 渲染器
  听力原文是否显示
  题干是否显示
  选项是否显示
  是否显示children
  答案是否显示 [多选 备选]
  解析是否显示
  属性是否显示
 -->
<template>
  <div
    v-renderjax
    class="ques-origin"
  >
    <!-- 听力题干展示区 -->
    <!-- <div class="ques-topic" v-if="level === 1 && rule.h">
      <div>{{ questionNum || '' }}.</div>
      <div class="ques-title ques-type">【听力原文】</div>
      <span v-html="getHearing(ques)"></span>
    </div> -->

    <!-- 常规题干展示区 -->
    <div v-if="level === 1 || quesStructPm != '23'">
      <div v-if="rule.s && checkStem">
        <div class="ques-topic clearfix">
          <span
            class="ques-type"
            v-html="getStem(ques)"
          />
        </div>
      </div>
      <div
        v-if="rule.o && checkStem && getOptions(ques)"
        v-autos
        class="ques-option"
      >
        <span
          v-for="(suboption, index) in getOptions(ques)"
          :key="index"
        >
          <span
            class="ques-content"
            v-html="combinedOption(suboption, index)"
          />
        </span>
        <!-- <span v-if="fillchoice" class="ques-content">
          <longfill>&nbsp;</longfill>
        </span> -->
      </div>
    </div>
    <div v-else>
      <div class="nostem-ques-topic">
        <div class="nostem-no">
          <span
            class="ques-type"
            v-html="getStem()"
          />
        </div>
        <div
          v-if="rule.o && getOptions(ques)"
          v-autos
          class="nostem-ques-option"
        >
          <span
            v-for="(suboption, index) in getOptions(ques)"
            :key="index"
          >
            <span
              class="ques-content"
              v-html="combinedOption(suboption, index)"
            />
          </span>
          <span
            v-if="fillchoice"
            class="ques-content"
          >
            <longfill>&nbsp;</longfill>
          </span>
        </div>
      </div>
    </div>

    <!-- 选项题干展示区 -->
    <!-- <ul class="ques-option" v-if="rule.o && getOptions(ques)" v-autos>
      <li
        v-for="(suboption, index) in getOptions(ques)"
        :key="index">
        {{index | optionTag }}.
        <span v-html="suboption"></span>
      </li>
      <li v-if="fillchoice">
        <div class="longfill">&nbsp;</div>
      </li>
    </ul> -->

    <!-- 有子集题干展示区 -->
    <div v-if="rule.c && ques.children && ques.children.length > 0">
      <!-- <slot name="child" :list="ques.children"></slot> -->
      <ti-question-cell
        v-for="(child, index) in ques.children"
        :key="index"
        :child-index="index"
        :show-explain="showExplain"
        :show-attr="showAttr"
        :level="level + 1"
        :ques-struct-pm="quesStructPm"
        :ques="child"
      />
    </div>
    <!-- 答案解析展示区 -->
    <!-- <div v-if="ques.explain && showExplain">
      <answer-analysis
        :explain="ques.explain"
        :a="rule.a"
        :ay="rule.ay"
        :showIndex="String(quesTypePm) === '41'"
        :childIndex="childIndex"
        :ant="ant">
      </answer-analysis>
    </div> -->
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
  import CTS from '@/common/js/constant'
  // import answerAnalysis from './AnswerAnalysis'
  import { defineComponent, ref, reactive, computed, onMounted, watch } from "vue"

export default defineComponent({
    name: 'TiQuestionCell',
    props: {
      ques: {
        type: Object,
      }

    return {
      level: {
        type: Number,
        default: 1,
      }

    return {
      childIndex: {
        type: Number,
        default: 0,
      }

    return {
      quesStructPm: {
        type: [String, Number],
        default: '-1',
      }

    return {
      questionNum: {
        type: Number,
        default: 1,
      }

    return {
      showQuestionNum: {
        // 是否显示题号
        type: Boolean,
        default: false,
      }

    return {
      showExplain: {
        type: Boolean,
        default: false,
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
      questionWidth: {
        type: Number,
        default: 832,
      }

    return {
    }

    return {
    setup() {
      const state = reactive({
        ourQuesType: '1',
        questionShowPart: CTS.cfgDict.questionShowPart,
        rule: {
          h: false, // 听力
          s: true, // 题干
          o: true, // 选项
          c: false, // 子集
          a: true, // 答案
          ay: true, // 解析
          at: true, // 属性
        }

    return {
        ant: 1,
        fillchoice: false,
        renderAS: false,
      }
    }

    return {
    computed: {
      // 校验是否有题干
      checkStem() {
        // 是否应该显示 小题号
        if (this.level === 1) return true
        if (this.quesStructPm) {
          if ('24,25'.indexOf(this.quesStructPm) != -1) {
            return false
          } else {
            return true
          }
        } else {
          return true
        }
      }

    return {
      /* loginStatus() {
      return isLogin
    } */
    }

    return {

    watch: {
      ques() {
        this.renderRule()
      }

    return {
    }

    return {
    created() {
      // console.log(this.showQuestionNum)
      // console.log(this.ques, this.quesTypePm)
    }

    return {
    mounted() {
      if (this.ques) {
        this.renderRule()
      }
    }

    return {
    methods: {
      combinedOption(suboption, index) {
        return this.$filter.optionTag(index) + '.&nbsp;' + suboption
      }

    return {
      // 渲染 显示规则 rule
      renderRule() {
        if (this.ques.quesStruct) {
          let qstruct = parseInt(this.ques.quesStruct.code)
          let item = this.questionShowPart[qstruct]
          this.fillchoice = qstruct == 27
          if (item) {
            this.rule.h = this.getRuleAttribute('h', item)
            this.rule.s = this.getRuleAttribute('s', item)
            this.rule.o = this.getRuleAttribute('o', item)
            this.rule.c = this.getRuleAttribute('c', item)
            this.rule.a = this.getRuleAttribute('a', item)
            this.rule.ay = this.getRuleAttribute('ay', item)
            this.rule.at = this.getRuleAttribute('at', item)
            if (item.ant) {
              this.ant = item.ant
              // console.log(this.ant, 'ant')
            }
            if (
              qstruct == 19 &&
              this.ques.quesType &&
              this.ques.quesType.code == 15
            ) {
              this.rule.c = 0
            }
          }
        }
        // { name: '单选题', h: 0, s: 1, o: 1, c: 0, a: 1, ay: 1, at: 1 }
      }

    return {
      getRuleAttribute(ckey, c) {
        let state = c[ckey]
        switch (state) {
          case 0:
            return false
          case 1:
            return true
          case 2:
            return this.level === 1
          case 3:
            return this.level !== 1
        }
        return false
      }

    return {
      // 获取听力题干
      getHearing(ques) {
        let original_text = ''
        if (ques && ques.context) {
          original_text = ques.context.original_text || ''
        } else {
          original_text = ''
        }
        return original_text
      }

    return {

      // 获取题干
      getStem(ques) {
        let stem = ''
        if (ques && ques.context) {
          stem = ques.context.stem || ''
        } else {
          stem = ''
        }

        if (this.level === 1) {
          // if (this.showQuestionNum && this.quesStructPm != '19') {
          if (this.showQuestionNum) {
            return `${this.questionNum}. ${stem}`
          } else {
            return stem
          }
        } else {
          return (
            this.getQuestionSuffixNO(this.level, this.childIndex + 1) +
            ' ' +
            stem
          )
        }
      }

    return {
      getSuffixNo() {
        return this.getQuestionSuffixNO(this.level, this.childIndex + 1) + ' '
      }

    return {
      // onRenderJax () {
      //   // console.log(this.$refs['renderQuestionRef'])
      //   var el = this.$refs['renderQuestionRef']
      //   if (el) {
      //     this.$nextTick(() => {
      //       window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, el])
      //     }
      //   }
      // })

    return {
      // 获取选项
      getOptions(ques) {
        if (ques && ques.context) {
          return ques.context.options
        } else {
          return null
        }
      }

    return {
      // 显示登录弹框
      showLogin() {
        this.Bus.$emit('showLogin')
      }

    return {
    }

    return {
  }
})
</script>

<style lang="scss">
  @use "@/assets/css/variables" as *;
  /*.underline {
    display: inline-block;
    text-decoration: underline;
  }
})
  .wave {
    display: inline-block;
    padding-bottom: 8px;
    background: url(./wave.png) repeat-x center bottom;
    word-break:break-word;
  }
})
  .point2,point2 {
    display: inline-block;
    padding-bottom: 4px;
    background: url(./point.png) repeat-x center bottom;
    word-break:break-word;
  }
})

  cloze,fill,longFill,.longfill{
    display:inline-block;
    min-width:2.5em;
    height:1em;
    text-align:center;
    line-height: 1em;
    padding:0 0.5em;
    border-bottom:1px solid #333;
    vertical-align: bottom;
  }
})
  longFill, .longfill {
    min-width:15em;
  }*/
})
  img {
    vertical-align: middle;
  }
})
  /*brack,.brack,tab {
    display:inline-block;
    min-width:2em;
    text-align:center;
  }*/
})
  .ques-type {
    .center {
      text-align: center;
    }
  }
})
  .MathJax img {
    transform: scale(0.85);
  }
})
  /*新加的*/
  blank,
  .blank {
    width: auto !important;
  }
})
  /*cloze,
  fill,
  longFill,
  .fill,
  .cloze,
  .longFill {
    display: inline-block;
    min-width: 2.5em;
    height: 1em;
    text-align: center;
    line-height: 1em;
    padding: 0 0.5em;
    margin: 0 4px;
    border-bottom: 1px solid #333;
    vertical-align: bottom;
  }
})

  longFill,
  .longFill {
    min-width: 15em;
  }
})
  fill,
  .fill {
    border: 1px solid #333;
    height: 1.5em;
    line-height: 1.5em;
    margin: 0 0.5em;
    vertical-align: middle;
  }
})
  brack,
  tab,
  .brack {
    display: inline-block;
    min-width: 2em;
    text-align: center;
  }
})

  .wave {
    padding-bottom: 8px;
    word-break: break-word;
  }
})
  .point2,
  point2 {
    padding-bottom: 4px;
    word-break: break-word;
  }*/
})
</style>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
  .ques-origin {
    overflow: hidden;
    .ques-option {
      span {
        line-height: 34px;
        color: $color-text-d;
        display: inline-block;
        font-size: $font-size-medium;
      }
      & > span {
        padding-right: 50px;
      }
    }
    // .ques-option {
    //   width: 100%;
    //   >li {
    //     display: inline-block;
    //     line-height: 34px;
    //     padding-right: 50px;
    //     color: $color-text-d;
    //     font-size: $font-size-medium;
    //     >span{
    //       padding-right: 50px;
    //     }
    //   }
    // }
    .ques-topic {
      /*width: 800px;*/
      padding-bottom: 5px;
      color: $color-text-d;
      line-height: 24px;
      .sub-index {
        padding-left: 20px;
      }
    }
    .ques-answer {
      line-height: 24px;
      padding: 6px 0;
      color: $color-text;
      font-size: $font-size-medium;
    }
    .ques-analysis {
      line-height: 24px;
      padding: 6px 0;
      color: $color-text;
      font-size: $font-size-medium;
    }
    .ques-type {
      margin-bottom: 10px;
      color: $color-text-d;
      font-size: $font-size-medium;
      /*font-weight: 700;*/
    }
    .q-l.ques-type {
      margin-left: 20px;
    }
  }
})
  .ques-title {
    margin-left: -8px;
  }
})
  //flex 布局
  .ques-crow {
    display: flex;
    .q-l {
      width: 70px;
    }
    .q-c {
      flex: 1;
    }
    .b-l {
      width: 120px;
    }
  }
})
  .small-topic {
    margin-left: 25px;
  }
})
  .nostem-ques-topic {
    display: flex;
    line-height: 34px;
    .nostem-no {
      width: 35px;
    }
    .nostem-ques-option {
      flex: 1;
    }
  }
})
</style>
