<template>
  <div class="multidimensional-question">
    <div class="paper-type">
      <div
        v-for="typeItem in selectConfigTypes"
        :key="typeItem.code"
        class="paper-left-item"
        :class="{ active: typeItem.code == currentCode }"
        @click="selectConfigType(typeItem)"
      >
        <div class="item-name">
          {{ typeItem.name }}
        </div>
      </div>
    </div>
    <div class="config-type-content">
      <div
        v-loading="showLoading"
        class="config-type-list"
      >
        <div
          v-for="item in treeDataList"
          :key="item.code"
          class="config-type-item"
          @click="selectTypeItem(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
  import { mapState, mapActions } from 'vuex'
  import { API } from '@/api/config'
  import { cpflattenFinal } from '@/common/js/util'
  export default {
    computed: {
      ...mapState(['currSubject']),
    },
    data() {
      return {
        selectConfigTypes: [],
        currentCode: '',
        treeDataList: [],
        //     SOLVING_METHOD(1,"解题方法","解题方法"),
        // CORE_ABILITY(2,"核心素养","高中-核心素养"),
        // THINKING_METHOD(3,"思维方法","思维方法"),
        // QUESTION_CATAGORY(4,"试题类型","试题类型"),
        // SUBJECT_ABILITY(5,"学科能力","小学初中-学科能力"),
        // CORE_ATTAINMENTS(6,"核心素养","小学初中-核心素养");
        configTypeDict: {
          1: '100194',
          2: '100190',
          3: '100192',
          4: '100188',
          5: '100190',
        },
        showLoading: false,
      }
    },
    mounted() {
      this.getQuestConfigType()
    },
    methods: {
      ...mapActions(['quesAttrByStageSubject']),
      getQuestConfigType() {
        let params = {
          period: this.currSubject.periodCode,
          subjectCode: this.currSubject.subjectCode,
        }
        this.apiGet(API.QUESIOTN_SELECT_CONFIGTYPE, params).then((res) => {
          if (this.checkoutRes(res)) {
            this.selectConfigTypes = res.data.configTypeList
            this.selectConfigType(this.selectConfigTypes[0])
          }
        })
      },
      selectConfigType(item) {
        if (item) {
          this.currentCode = item.code
          this.getCurrentTypeList()
        }
      },
      //  获取 维度的 数据
      async getCurrentTypeList() {
        let item = this.configTypeDict[this.currentCode]
        if (item) {
          this.treeDataList = []
          this.showLoading = true
          let res = await this.getQuesAttrStageSubject(this.currentCode)
          this.showLoading = false
          if (this.checkoutRes(res)) {
            if (
              this.currSubject.subjectCode == '1211' &&
              this.currentCode == 4
            ) {
              this.treeDataList = cpflattenFinal(res.data)
            } else {
              this.treeDataList = res.data
            }
          }
        } else {
          this.treeDataList = []
        }
      },
      getQuesAttrStageSubject(configType) {
        let strParams = {
          periodCode: this.currSubject.periodCode,
          subjectCode: this.currSubject.subjectCode,
          configType: configType,
        }
        return this.getInvokeData(7, JSON.stringify(strParams))
      },
      async selectTypeItem(item) {
        let queryStr = '?cc=' + this.currentCode + '&ct=' + item.code
        this.openSystemPathLink('paper/knowledge/selection' + queryStr)
      },
    },
  }
</script>

<style scoped lang="scss">
  @use "@/assets/css/variables" as *;
  .multidimensional-question {
    display: flex;
    .paper-type {
      position: relative;
      width: 120px;
      height: 310px;
      padding-left: 20px;
      padding-top: 10px;
      box-sizing: border-box;
      background: #ecf2fe;
      border-radius: 0px 0px 0px 6px;
      &::before {
        content: ' ';
        position: absolute;
        top: 0;
        left: 0;
        width: 120px;
        height: 310px;
        background-image: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/4f8efdd9-ee80-43a7-8a6f-03634066d01c.png);
        background-size: 120px 310px;
      }
      .paper-left-item {
        position: relative;
        width: 100px;
        height: 41px;
        // padding-right: 20px;
        box-sizing: border-box;
        line-height: 40px;
        cursor: pointer;
        text-align: center;
        user-select: none;
        .item-name {
          line-height: 40px;
          margin-top: 8px;
          font-size: 14px;
          color: #333333;
        }

        &.active {
          &::before {
            content: '';
            background-image: url('../../../assets/images/index/index-paper-circle.png');
            background-size: 8px 8px;
            width: 8px;
            height: 8px;
            display: block;
            position: absolute;
            top: -8px;
            right: 0;
            transform: rotate(180deg);
          }
          &::after {
            content: '';
            background-image: url('../../../assets/images/index/index-paper-circle.png');
            background-size: 8px 8px;
            width: 8px;
            height: 8px;
            display: block;
            position: absolute;
            top: 40px;
            right: 0;
            transform: rotate(90deg);
          }
          .item-name {
            background: #ffffff;
            border-radius: 23px 0px 0px 23px;
            color: $color-theme;
            font-weight: bold;
          }
        }
      }
    }
  }
  .config-type-content {
    padding: 20px 0px 20px 20px;
    height: 309px;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    .config-type-list {
      position: relative;
      .config-type-item {
        position: relative;
        display: inline-block;
        margin-right: 20px;
        margin-bottom: 17px;
        width: 203px;
        height: 38px;
        background: #f2f6ff;
        border-radius: 6px;
        line-height: 38px;
        word-spacing: normal;
        box-sizing: border-box;
        text-align: center;
        font-size: 14px;
        color: #5f7085;
        cursor: pointer;
        user-select: none;

        &::before {
          content: ' ';
          position: absolute;
          top: 6px;
          right: 12px;
          width: 37.5px;
          height: 31.5px;
          background-image: url(//cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/2e736bf3-23d0-4e1b-a4ba-97cd8fd2ea90.png);
          background-size: 37.5px 31.5px;
        }

        &:hover {
          // color: $color-theme;
          background: #e3eaf8;
        }
      }
    }
  }
</style>
