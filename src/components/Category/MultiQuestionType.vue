<template>
  <div v-if="typesList.length">
    <div class="multi-category-content">
      <label class="category-label">{{ categoryLabel }}</label>
      <div class="category-list">
        <div v-if="isMulti === 0">
          <div
            class="category-item"
            :class="currTypeCode === '' ? 'active' : ''"
            @click="selectType({ code: '', name: '全部' }, 'currTypeCode')"
          >
            全部
          </div>
          <div
            v-for="item in typesList"
            :key="item.code"
            class="category-item"
            :class="item.code === currTypeCode ? 'active' : ''"
            @click="selectType(item, 'currTypeCode')"
          >
            {{ item.name }}
          </div>
          <MultipleChoiceRadio
            :is-multi="isMulti"
            @change="changeMulti"
          />
        </div>
        <div v-else>
          <div
            class="category-item"
            :class="currTypeCode === '' ? 'active' : ''"
            @click="selectType({ code: '', name: '全部' }, 'currTypeCode')"
          >
            全部
          </div>
          <el-checkbox
            v-for="item in typesList"
            :key="item.code"
            class="category-item-ckeck el-cyy-rewrite"
            :label="item.code"
            :value="values.indexOf(item) != -1"
            @change="selectTypes(item)"
          >
            {{ item.name }}
          </el-checkbox>
          <MultipleChoiceRadio
            :is-multi="isMulti"
            @change="changeMulti"
          />
        </div>

        <div
          v-if="isMulti === 0"
          class="sub-category-list"
        >
          <div
            v-if="currSubType.length > 1"
            class="sub-category-segment"
          >
            <span
              v-for="subitem in currSubType"
              :key="subitem.code"
              class="sub-category-item"
              :class="subitem.code === currSubTypeCode ? 'active' : ''"
              @click="selectSubType(subitem)"
            >
              {{ subitem.name }}
            </span>
          </div>
        </div>
        <div
          v-else
          class="sub-category-list"
        >
          <div
            v-if="childrenType.length > 0"
            class="sub-category-segment"
          >
            <TypeChoiceRadioList
              v-for="(node, index) in childrenType"
              :key="node.code"
              :node="node"
              :subindex="index"
              @change="changeTypeChoice"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CTS from '@/common/js/constant'
  import { API } from '@/api/config'
  import { mapState } from 'vuex'
  import MultipleChoiceRadio from './MultipleChoiceRadio'
  import TypeChoiceRadioList from '@/components/CpFan/Category/TypeChoiceRadioList'
  export default {
    name: 'MultiQuestionType',
    components: { MultipleChoiceRadio, TypeChoiceRadioList },
    props: {
      categoryLabel: {
        type: String,
        default: '题　　型',
      },
      // 是否显示全部
      isShowAll: {
        type: Boolean,
        default: true,
      },
      defaultTypeCode: {
        type: String,
        default: '',
      },
    },

    data() {
      return {
        isMulti: 0,
        currTypeCode: '',
        currSubTypeCode: '',
        typesList: [],
        values: [],
        childrenType: [],
        childrenDict: {},
        currTypeValue: '',
      }
    },
    computed: {
      ...mapState(['currSubject']),
      currSubType() {
        let children = []
        let child = []
        this.typesList.forEach((item, index) => {
          if (item.code === this.currTypeCode) {
            let codes = [item.code]
            if (item.children) {
              child = [...item.children]
              child.forEach((items) => {
                codes.push(items.code)
              })
              child.unshift({ code: codes.join(','), name: '全部' + item.name })
            }
            children = child
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
      this.reanderTypeCode()
    },
    methods: {
      selectTypes(s) {
        let index = this.values.indexOf(s)
        if (index !== -1) {
          // 去掉 s
          this.values.splice(index, 1)
        } else {
          this.values.push(s)
        }
        this.renderMultiType()
        this.changeEvent()
      },
      changeTypeChoice(data) {
        this.childrenDict[data.code] = data.value
        this.changeEvent()
      },
      changeEvent() {
        let list = []
        for (let item of this.values) {
          if (item.children && item.children.length) {
            let node = this.childrenDict[item.code]
            if (node) {
              list.push(node)
            } else {
              list.push(this.getAllChildrenCodes(item.children))
            }
          } else {
            list.push(item.code)
          }
        }
        this.currTypeCode = list.join(',')
        this.currTypeValue = this.currTypeCode
        this.$emit('selectType', this.currTypeCode)
      },
      renderMultiType() {
        let list = []
        for (let item of this.values) {
          if (item.children && item.children.length) {
            list.push(item)
          }
        }
        this.childrenType = list
      },
      clearChoiceData(isMulti) {
        this.currTypeCode = ''
        this.currSubTypeCode = ''
        this.values = []
        this.childrenType = []
        this.isMulti = isMulti
        this.childrenDict = {}
      },
      getAllChildrenCodes(children) {
        if (children && children.length) {
          let list = children.map((item) => item.code)
          return list.join(',')
        } else {
          return ''
        }
      },
      selectType(item, params) {
        this.currTypeCode = item.code
        if (this.currTypeCode === '') {
          this.clearChoiceData(0)
        }
        if (item.children && item.children.length) {
          this.currSubTypeCode = this.currSubType[0].code
          this.currTypeValue = this.currSubTypeCode
          this.$emit('selectType', this.currSubTypeCode)
        } else {
          this.currTypeValue = item.code
          this.$emit('selectType', item.code)
        }
      },
      selectSubType(item) {
        this.currSubTypeCode = item.code
        this.currTypeValue = this.currSubTypeCode
        this.$emit('selectType', item.code)
      },
      changeMulti() {
        let isMulti = this.isMulti == 0 ? 1 : 0

        if (this.currTypeValue) {
          this.currTypeValue = ''
          this.$emit('selectType', this.currTypeValue)
        }
        this.clearChoiceData(isMulti)
      },
      reanderTypeCode() {
        console.log('this.defaultTypeCode', this.defaultTypeCode)
        if (this.defaultTypeCode) {
          if (this.defaultTypeCode.length >= 4) {
            this.currTypeCode = this.defaultTypeCode.substring(0, 2)
            this.currSubTypeCode = this.defaultTypeCode
          } else {
            this.currTypeCode = this.defaultTypeCode.substring(0, 2)
            this.currSubTypeCode = 0
          }
        }
      },
      // 获取当前学段试卷类型关联id
      getRelationCategoryId() {
        let parms = {
          categoryId: CTS.cfgDict.CID_QUESTION_PERIOD_SUBJECT_TYPE,
          code: this.currSubject.subjectCode,
          level: '2',
        }
        this.wayGet(API.GET_CHILD_DICT, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            if (res.data.length) {
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
        }
        this.wayGet(API.GET_DICT_BY_LEVEL, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            let arrData = this.filterDeprecated(res.data)
            this.typesList = arrData
          }
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
  .multi-category-content {
    @include flex();
    .category-label {
      line-height: 24px;
      width: 75px;
      align-self: flex-start;
      color: $color-text-d;
      font-weight: 700;
    }
    .category-list {
      width: 825px;
      .category-item {
        display: inline-block;
        padding: 5px 16px;
        margin: 0 4px 12px 4px;
        border-radius: 16px;
        line-height: 16px;
        cursor: pointer;
        &:hover {
          color: $color-theme;
        }
        &.active {
          background: $color-theme;
          color: $color-white;
        }
      }
      .category-item-ckeck {
        display: inline-block;
        padding: 5px 7px;
        margin: 0 4px 12px 4px;
        border-radius: 16px;
        line-height: 16px;
        height: 16px;
        cursor: pointer;
      }
      .sub-category-list {
        background: #f6f6f6;
        box-sizing: border-box;
        margin-left: -95px;
        padding-left: 95px;
      }

      .sub-category-item {
        display: inline-block;
        padding: 4px 16px;
        margin: 9px 4px 9px 4px;
        border-radius: 16px;
        cursor: pointer;
        color: $color-text;
        border: 1px solid transparent;
        margin-right: 10px;
        &:hover,
        &.active {
          color: $color-theme;
        }
        &.active {
          color: $color-theme;
          border: 1px solid #487FFF;
          border-radius: 16px;
        }
      }
    }
  }
  .multi-category-content :deep(.el-checkbox__label) {
    line-height: 14px;
    padding-left: 4px;
  }
  .sub-category-segment {
    margin-bottom: 18px;
  }
</style>

