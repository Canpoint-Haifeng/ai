<template>
  <div
    v-if="areasList.length"
    class="category-content"
  >
    <label class="category-label">{{ categoryLabel }}</label>
    <div class="category-list">
      <div
        v-for="item in areasList"
        :key="item.code"
        class="category-item"
        :class="item.code === currAreaCode ? 'active' : ''"
        @click="selectArea(item)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import CTS from '@/common/js/constant'
import { API } from '@/api/config'
export default {
  name: 'Areas',
  props: {
    categoryLabel: {
      type: String,
      default: '等级',
    },
    // 是否显示全部
    isShowAll: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currAreaCode: 0,
      areasList: [],
    }
  },
  created() {
    this.getareasList()
  },
  methods: {
    // 获取地区
    getareasList() {
      let parms = {
        categoryId: CTS.cfgDict.CID_USER_AREA,
        level: 1,
      }
      this.wayGet(API.GET_DICT_BY_LEVEL, parms).then(res => {
        if (res.code === CTS.constant.SUCCESS_CODE) {
          let arrData = res.data
          // if (this.isShowAll) {
          //   arrData.unshift({
          //     code: 0,
          //     name: '全部',
          //   })
          // }
          // this.areasList = arrData
          this.areasList = [
            { code: 0, name: '全部' },
            { code: 1, name: '网络级' },
            { code: 2, name: '精品级' },
            { code: 3, name: '出版级' },
          ]
        }
      })
    },
    selectArea(item) {
      this.currAreaCode = item.code
      this.$emit('selectArea', item)
    },
  },
}
</script>

<style lang="scss" scoped>
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
