<template>
  <div
    ref="question"
    class="question"
    :class="{ replace: type > 1 }"
  >
    <div
      v-if="info && info.context"
      class="question_info"
      @click="toggleDetail"
    >
      <div class="stem">
        <!-- • -->
        {{ index }}.
        <span
          v-if="info.tagPaper"
          class="year"
        >({{ info.tagPaper.year }}·{{ info.tagPaper.area
        }}{{ info.tagPaper.paperName }})</span>
        <span v-html="info.context.stem" />
        <p
          v-for="(v, i) in children.stem"
          :key="i"
          v-html="v"
        />
      </div>

      <div
        v-if="info.context.options"
        v-autos
        class="answer"
      >
        <span
          v-for="(v, i) in info.context.options"
          :key="i"
        >
          <span v-html="['A', 'B', 'C', 'D', 'E', 'F'][i] + '. ' + v" />
        </span>
      </div>
      <div
        v-show="detailVisible"
        class="detail"
      >
        <div class="knowledge">
          <span class="type">【考点】</span>
          <p v-if="!info.knowledge">
            暂无考点
          </p>
          <em
            v-for="(v, i) in info.knowledge"
            :key="i"
            v-html="v.name"
          />
        </div>
        <div>
          <span class="type">【答案】</span>
          <span
            v-for="(v, i) in info.explain[0].answers.flat(Infinity)"
            :key="i"
            v-html="v"
          />
        </div>
        <div class="analysis">
          <span class="type">【解析】</span>
          <span v-html="info.explain[0].analysis" />
        </div>
      </div>
    </div>
    <!--<div class="question_operation" v-if="type == 1">
          <el-button type="text" @click="change">换题</el-button>
          <el-button type="text">报错</el-button>
           <template v-if="sort">
              <el-button type="text"><i class="el-icon-top"></i></template></template></el-button>
              <el-button type="text"><i class="el-icon-bottom"></i></template></template></el-button>
          </template>
          <i class="icon el-icon-delete" @click="del"></i></template></template>
      </div>-->
    <div
      v-if="[2, 3].includes(+type)"
      id="footer"
    >
      <span>预估难度：{{ info.difficulty.name }}</span>
      <div>
        <el-button type="text">
          <i class="iconfont icon-zan1" />999
        </el-button>
        <el-button type="text">
          报错
        </el-button>
        <el-button
          type="primary"
          round
          size="mini"
          @click="change"
        >
          {{
            type == 2 ? '更换' : '+ 添加'
          }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: () => ({
        tagPaper: {},
        difficulty: {},
        context: {
          options: [],
        },
        knowledge: [],
        explain: [
          {
            answers: [],
            analysis: '',
          },
        ],
      }),
    },
    index: {
      default: 1,
    },
    type: {
      default: 1,
    },
    sort: {
      default: true,
    },
  },
  data() {
    return {
      detailVisible: false,
      children: {
        stem: [],
        analysis: [],
        answers: [],
      },
    }
  },
  watch: {
    detailVisible(v) {
      v && this.onRenderJaxPage('question')
    },
    info: {
      handler(info) {
        if (!info) return
        const obj = {
          stem: [],
          analysis: [],
          answers: [],
        }
        const getQuestionSuffixNO = this.getQuestionSuffixNO
        function loop(arr, level = 2) {
          arr.forEach((v, i) => {
            obj.stem.push(getQuestionSuffixNO(level, i + 1) + v.context.stem)
            obj.analysis.push(v.explain[0].analysis)
            obj.answers.push(
              v.explain[0].answers && v.explain[0].answers.flat(Infinity),
            )
            v.children && v.children.length && loop(v.children, level + 1)
          })
        }
        info.children && info.children.length && loop(info.children)
        this.children = obj
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    // this.onRenderJaxPage('question')
  },
  methods: {
    toggleDetail() {
      this.detailVisible = !this.detailVisible
    },
    del() {
      this.$emit('change', 'del')
    },
    change() {
      this.$emit('change', 'change')
    },
  },
}
</script>

<style lang="scss" scoped>
.question {
  border: 1px solid transparent;
  min-height: 100px;
  border-radius: 6px;
  position: relative;
  margin-bottom: 12px;
  cursor: pointer;
  &.replace {
    border-color: #e2e2e2;
    .question_info {
    }
  }
  &:hover {
    border-color: #487fff;
    .question_operation {
      display: flex;
    }
  }
  .question_info {
    padding: 20px;
    .stem {
      line-height: 24px;
      margin-bottom: 20px;
      overflow: hidden;
      .year {
        color: #487fff;
        margin-right: 4px;
      }
    }
    .answer {
      padding-bottom: 10px;
      span {
        line-height: 34px;
      }
    }
    .detail {
      border-top: 1px solid #e8e8e8;
      .knowledge {
        align-items: center;
        em {
          background: #ebf2fb;
          border-radius: 14px;
          line-height: 28px;
          padding: 0 10px;
          margin-right: 9px;
        }
      }
      .analysis {
      }
      > div {
        padding: 10px 0;
        display: flex;
        &:not(:last-child) {
          border-bottom: 1px dashed #e8e8e8;
        }
        .type {
          color: #487fff;
          margin-right: 4px;
          word-break: keep-all;
          line-height: 24px;
          & + span {
            line-height: 24px;
          }
        }
      }
    }
  }
  #footer {
    background: #f6f6f6;
    border-radius: 0px 0px 6px 6px;
    padding: 0 20px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    border-top: 1px solid #e2e2e2;
    .el-button--mini.is-round {
      padding: 4px 15px;
    }
    > div {
      display: flex;
      align-items: center;
    }
    :deep(.el-button) {
      margin-left: 12px;
      display: flex;
      align-items: center;
      padding: 0;
      > span {
        display: flex;
        align-items: center;
        i {
          font-size: 16px;
          margin-right: 3px;
        }
      }
    }
  }
  .question_operation {
    position: absolute;
    right: 0;
    bottom: 0;
    border-top: 1px solid #487fff;
    border-left: 1px solid #487fff;
    display: none;
    height: 28px;
    align-items: center;
    z-index: 1;
    button {
      padding: 0 10px;
    }
    .icon {
      padding: 0 10px;
      cursor: pointer;
      color: #ff4b36;
    }
  }
}
</style>
