<template>
  <div
    v-if="diffsData.length"
    class="category-content"
  >
    <label class="category-label">{{ categoryLabel }}</label>
    <cp-question-mulit-filtrate
      :types-list="diffsData"
      @select-type="selectDiff"
    />
  </div>
</template>

<script>
  import CTS from '@/common/js/constant'
  import { API } from '@/api/config'
  import CpQuestionMulitFiltrate from '@/components/CpFan/Category/cp-question-mulit-filtrate'
  export default {
    name: 'MultiQuestionDiff',
    components: { CpQuestionMulitFiltrate },
    props: {
      categoryLabel: {
        type: String,
        default: '难　　度',
      },
      // 是否显示全部
      isShowAll: {
        type: Boolean,
        default: true,
      },
      defaultQuesDiff: {
        type: String,
      },
    },
    data() {
      return {
        currQuestonId: 0,
        diffsData: [],
      }
    },
    watch: {
      defaultQuesDiff(v) {
        this.currQuestonId = v || 0
      },
    },
    created() {
      this.getQuestionDiffList()
      this.currQuestonId = this.defaultQuesDiff || 0
    },
    methods: {
      // 获取年份
      getQuestionDiffList() {
        let parms = {
          categoryId: CTS.cfgDict.CID_QUESTION_DIFF,
          level: 1,
        }
        this.wayGet(API.GET_DICT_BY_LEVEL, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            let arrData = res.data
            this.diffsData = arrData
          }
        })
      },
      selectDiff(code) {
        this.currQuestonId = code
        this.$emit('selectDiff', code)
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  .category-content {
    @include flex();
    .category-label {
      word-break: keep-all;
      line-height: 24px;
      align-self: flex-start;
      color: $color-text-d;
      font-weight: 700;
      width: 75px;
    }
    .category-list {
      width: 855px;
      .category-item {
        display: inline-block;
        padding: 5px 16px;
        margin: 0 4px 12px 4px;
        border-radius: 16px;
        cursor: pointer;
        transition: 0.2s;
        &:hover {
          color: $color-theme;
        }
        &.active {
          background: $color-theme;
          color: $color-white;
        }
      }
      .sub-category-list {
        width: 100%;
      }
      .sub-category-item {
        display: inline-block;
        padding: 4px 16px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: 0.2s;
        color: $color-text;
        &:hover,
        &.active {
          color: $color-theme;
        }
      }
    }
  }
</style>
