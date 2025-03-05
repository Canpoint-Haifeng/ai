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
        :class="item.code == currTypeCode ? 'active' : ''"
        @click="selectType(item, 'currTypeCode')"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
  import { paperTypeConfig } from '@/common/config/tikuCfg'
  import { mapState } from 'vuex'
  export default {
    name: 'PaperType',
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
      defaultTypeCode: [String, Number],
      volumeCurrentCode: String,
    },
    data() {
      return {
        currTypeCode: '',
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
      volumeCurrentCode() {
        this.getRelationCategoryId()
      },
    },
    created() {
      this.currTypeCode = this.defaultTypeCode || ''
      this.getRelationCategoryId()
    },
    methods: {
      // 获取当前学段试卷类型关联id
      getRelationCategoryId() {
        // 通过配置 获取 试卷类型
        let list = []
        let gradeVolume = ''
        if (this.volumeCurrentCode) {
          gradeVolume = String(this.volumeCurrentCode).substring(6, 9)
        }

        for (let sub of paperTypeConfig) {
          //  如果是小学 需要 处理小升初
          if (sub.period == this.currSubject.subjectCode && sub.type == 1) {
            let gradeVolumelist = sub.gradevolume + ''
            let period = (sub.period + '').substring(0, 2)
            if (period == '11' && gradeVolume && gradeVolumelist) {
              if (gradeVolumelist.indexOf(gradeVolume) != -1) {
                list.push({ code: sub.code, name: sub.name })
              }
            } else {
              list.push({ code: sub.code, name: sub.name })
            }
          }
        }
        let allPaperTypes = list.map((item) => item.code).join(',')

        this.typesList = [
          {
            code: allPaperTypes,
            name: '全部',
          },
          ...list,
        ]

        if (!this.currTypeCode) {
          this.currTypeCode = allPaperTypes
          this.$emit('selectType', this.typesList[0])
        }
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
