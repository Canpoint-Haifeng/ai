<template>
  <div class="paper-sort font-12">
    <div class="p-sort-list fl">
      <span
        v-for="item in sortList"
        v-show="showSortItem"
        :key="item.sort"
        class="sort-item"
        :class="currSort == item.sort ? 'active' : ''"
        @click="selectSort(item.sort)"
      >
        {{ item.text }}
        <i class="el-icon-sort-down" />
      </span>
    </div>
    <div class="p-sort-total-box fr">
      <span class="total-info">
        共计
        <span class="text">{{ paperCount || 0 }}</span>
        {{ suffix }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaperSort',
  props: {
    paperCount: {
      type: Number,
      default: 0,
    },
    suffix: {
      type: String,
      default: '份教案',
    },
    showSortItem: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currSort: 1, // 排序 1-按最新更新 2-按最多浏览 3-按最多下载
      sortList: [
        {
          sort: 1,
          text: '最新',
        },
        {
          sort: 2,
          text: '最热',
        },
      ],
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
    selectSort(sort) {
      this.currSort = sort
      this.$emit('selectSort', sort)
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.pd {
  padding: 0 20px;
}

.search-paper-name {
  margin-right: 30px;
}

.paper-search :deep() {
  display: inline-block;
  margin: 0 30px 0 110px;
  width: 174px;

  .iconsearch {
    font-size: $font-size-medium;
    cursor: pointer;
  }

  .el-input__suffix {
    right: 12px;
  }
}

// 图书搜索框样式
.book-search :deep() {
  margin: 0;
}

.paper-sort {
  height: 46px;
  line-height: 46px;
  border-bottom: 1px solid $color-background-l;
  margin-bottom: 20px;
  font-size: 16px;
  font-style: normal;

  .paper-total {
    margin-right: 25px;

    .num {
      padding: 0 2px;
      color: $color-text-d;
      font-size: $font-size-medium;
    }
  }

  .p-sort-list {
    .icondot {
      display: inline-block;
      vertical-align: middle;
      margin-right: 4px;
      width: 4px;
      height: 4px;
      background: $color-theme;
    }

    .sort-item {
      margin: 0 10px;
      cursor: pointer;
      line-height: 20px;
      display: inline-block;
      text-align: center;
      color: #333333;

      &.active {
        font-size: 16px;
      }

      &.active::after {
        content: '';
        width: 40%;
        height: 1px;
        display: block;
        padding-top: 2px;
        margin: 0 auto;
        border-bottom: 2px solid #487FFF;
      }

      &.active,
      &:hover {
        color: $color-theme;

        .el-icon-sort-down {
          color: $color-theme;
        }
      }
    }
  }
}

.p-sort-total-box {
  .total-info {
    margin-right: 20px;

    .text {
      font-size: 16px;
      // font-weight: Bold;
      padding: 5px;
      color: #FF6900;

    }
  }

  .page-info {
    color: #666666;
  }

  .page-big {
    font-size: 16px;
    color: #666666;
  }

  .page-control {
    padding: 0 5px;
    cursor: pointer;
  }

  .page-control-edit {
    color: #487FFF;
  }
}
</style>

