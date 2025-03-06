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
      <!--<div class="sub-category-list">-->
      <!--<span-->
      <!--class="sub-category-item"-->
      <!--v-for="subitem in currSubType"-->
      <!--:key="subitem.code"-->
      <!--@click="selectType(subitem, 'currSubTypeCode')"-->
      <!--:class="subitem.code === currSubTypeCode ? 'active' : ''">-->
      <!--{{subitem.name}}-->
      <!--</span>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  import CTS from '@/common/js/constant'
  import { API } from '@/api/config'
  import { mapState } from 'vuex'
  export default {
    name: 'PaperTypeAll',
    props: {
      categoryLabel: {
        type: String,
        default: '类型',
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
        let parms = {
          categoryId: CTS.cfgDict.CID_PAPER_PERIOD_TYPE,
          code: this.currSubject.periodCode,
        }
        this.wayGet(API.GET_CHILD_DICT, parms).then((res) => {
          if (res.code === CTS.constant.SUCCESS_CODE) {
            this.getTypesList(res.data[1].relationCategoryId)
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
        this.$emit('selectType', item)
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
      width: 35px;
      line-height: 24px;
      align-self: flex-start;
      margin-right: 13px;
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
        background: $color-background-l;
        width: 100%;
        margin-bottom: 5px;
      }
      .sub-category-item {
        display: inline-block;
        padding: 4px 16px;
        margin: 5px 0;
        border-radius: 16px;
        cursor: pointer;
        transition: 0.2s;
        color: $color-text;
        &:hover,
        &.active {
          color: $color-theme;
        }
        &.active {
          color: $color-theme;
        }
      }
    }
  }
</style>

