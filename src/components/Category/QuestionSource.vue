<template>
  <div
    v-if="typesList.length"
    class="category-content"
  >
    <label class="category-label">{{ categoryLabel }}</label>
    <div class="category-list">
      <div
        v-for="item in typesList"
        :key="item.code"
        class="category-item"
        :class="item.code === currTypeCode ? 'active' : ''"
        @click="selectType(item, 'currTypeCode')"
      >
        {{ item.name }}
      </div>
      <div class="sub-category-list">
        <span
          v-for="subitem in currSubType"
          :key="subitem.code"
          class="sub-category-item"
          :class="subitem.code === currSubTypeCode ? 'active' : ''"
          @click="selectType(subitem, 'currSubTypeCode')"
        >
          {{ subitem.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import CTS from '@/common/js/constant'
  import { API } from '@/api/config'
  import { mapState } from 'vuex'
  import { questionSourceConfig } from '@/common/config/tikuCfg.js'
  import { getListByPeriod } from '@/common/js/util.js'
  export default {
  name: 'QuestionSource',
    props: {
      categoryLabel: {
        type: String,
        default: '来源',
      },
      // 是否显示全部
      isShowAll: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        currTypeCode: 0,
        currSubTypeCode: 0,
        typesList: [],
      }
    },
    computed: {
      ...mapState(['currSubject']),
      currSubType() {
        let children = []
        this.typesList.forEach((item) => {
          if (item.code === this.currTypeCode) {
            children = item.children
          }
        })
        return children
      },
    },
    watch: {
      currSubject() {
        this.getRelationCategoryId()
      },
    },
    created() {
      this.getRelationCategoryId()
    },
    methods: {
      // 获取当前学段试卷类型关联id
      getRelationCategoryId() {
        let list = getListByPeriod(
          questionSourceConfig,
          this.currSubject.subjectCode,
        )
        console.log(list)
        if (list.length) {
          if (this.isShowAll) {
            list.unshift({
              code: 0,
              name: '全部',
            })
          }
          this.typesList = list
          return
        }

        let parms = {
          categoryId: CTS.cfgDict.CID_QUESTION_PERIOD_SUBJECT_SOURCE,
          code: this.currSubject.periodCode,
          level: '1',
        }
        this.wayGet(API.GET_CHILD_DICT, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.currTypeCode = 0
            this.currSubTypeCode = 0
            if (res.data[1]) {
              this.getTypesList(res.data[1].relationCategoryId)
            } else {
              this.typesList = []
            }
          }
        })
      },
      // 获取当前学段试卷类型
      getTypesList(relationCategoryId) {
        if (!relationCategoryId) {
          return
        }
        let parms = {
          categoryId: relationCategoryId,
          level: '1,2',
          isFilterDeprecated: 1,
        }
        this.wayGet(API.GET_DICT_BY_LEVEL, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            let arrData = res.data
            if (this.isShowAll) {
              arrData.unshift({
                code: 0,
                name: '全部',
              })
            }
            this.typesList = arrData
          }
        })
      },
      selectType(item, params) {
        this[params] = item.code
        this.$emit('selectSource', item)
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
      width: 48px;
      line-height: 24px;
      align-self: flex-start;
      color: $color-text-d;
      font-weight: 700;
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
        border-radius: 16px;
        cursor: pointer;
        transition: 0.2s;
        color: $color-text;
        &:hover,
        &.active {
          color: $color-theme;
        }
        &.active {
          background: $color-theme;
          color: $color-white;
        }
      }
    }
  }
</style>
