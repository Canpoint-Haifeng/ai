<template>
  <div class="paper-set">
    <h3 class="set-title color-3 font-16">
      参数设置
    </h3>
    <div class="set-items">
      <el-radio-group
        v-model="defPaperModel"
        @change="setPaperModel"
      >
        <el-radio
          v-for="item in paperModel"
          :key="item.label"
          :label="item.label"
        >
          {{ item.name }}
        </el-radio>
      </el-radio-group>
    </div>
    <div class="set-options">
      <el-checkbox-group
        v-model="currPaperOptions"
        @change="setPaperOptions"
      >
        <el-checkbox
          v-for="item in paperOptions"
          :key="item.label"
          :label="item.label"
        >
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
import { mapState } from 'vuex'
import { paperOptions } from '@/common/config/paperOptions'
export default {
  props: {
    paperData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      paperOptions,
      defPaperModel: 0,
      currPaperOptions: [],
      paperModel: [
        {
          label: 0,
          name: '作业',
          defPaperOptions: [1, 4, 11],
        },
        {
          label: 1,
          name: '测试',
          defPaperOptions: [1, 3, 4, 10, 11],
        },
        {
          label: 2,
          name: '考试',
          defPaperOptions: [1, 2, 3, 4, 5, 6, 7, 9, 10, 11],
        },
      ],
    }
  },
  computed: {
    ...mapState(['currSubject']),
  },
  watch: {
    // paperData: {
    //   handler() {
    //     this.handlPaperData()
    //   },
    //   deep: true
    // }
  },
  mounted() {
    this.handlPaperData()
  },
  methods: {
    // 设置试卷选中配置
    // setCurrPaperOptions() {
    //   this.currPaperOptions = this.paperModel[this.defPaperModel].defPaperOptions
    // },
    // 切换试卷模式
    setPaperModel(model) {
      this.defPaperModel = model
      this.currPaperOptions = this.paperModel[model].defPaperOptions
      this.setPaperOptions()
    },
    // 切换试卷配置信息
    setPaperOptions() {
      let options = {}
      paperOptions.forEach(item => {
        if (this.currPaperOptions.includes(item.label)) {
          options[item.key] = 1
        } else {
          options[item.key] = 0
        }
      })
      let parms = {
        stage: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
        style: this.defPaperModel,
        ...options,
      }
      this.newPost(API.TEMP_PAPER_UPDATE_STYLE, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.Bus.$emit('setOptions', this.currPaperOptions)
        }
      })
    },
    // 获取试题篮列表
    getBasketList() {
      let parms = {
        period: this.currSubject.periodCode,
        subject: this.currSubject.subjectCode,
      }
      this.apiPost(API.BASKET_LIST, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          this.basketData = res.data
          this.setBasketData(res.data)
        }
      })
    },
    // 试卷信息数据处理
    handlPaperData() {
      let paperData = this.paperData
      console.log(paperData, 'paperData')
      let currPaperOptions = []
      this.defPaperModel = paperData.style
      paperOptions.forEach(item => {
        if (paperData[item.key]) {
          currPaperOptions.push(item.label)
        }
      })
      this.currPaperOptions = currPaperOptions
      this.Bus.$emit('setOptions', this.currPaperOptions)
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.paper-set {
  // height: 226px;
  background: $color-white;
  margin-bottom: 16px;
  .set-title {
    padding: 16px 14px;
  }
  :deep(.set-items) {
    height: 36px;
    background: #f6f6f6;
    padding: 0 14px;
    line-height: 36px;
    .el-radio {
      margin-right: 45px;
      color: $color-text-d;
      &:last-child {
        margin-right: 0;
      }
    }
    .el-radio__label {
      padding-left: 4px;
    }
  }
  :deep(.set-options) {
    padding: 16px 14px;
    .el-checkbox-group {
      @include flex();
      justify-content: space-between;
      flex-wrap: wrap;
    }
    .el-checkbox {
      margin-right: 0;
      width: 50%;
      margin-bottom: 10px;
      color: $color-text;
    }
    .el-checkbox__label {
      font-size: $font-size-small;
      padding-left: 6px;
    }
  }
}
</style>

