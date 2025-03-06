<template>
  <div class="content-container">
    <div class="user-content">
      <div class="user-content-left">
        <div class="papers-right-title">
          我的图书
        </div>
        <ul class="my-resources-list">
          <li
            :class="{ active: activeName == 'myQuesCollect' }"
            @click="activeName = 'myQuesCollect'"
          >
            <span class="icon iconfont icon-a-wodejuanku-shoucangsvg" /> 我的收藏
          </li>
        </ul>
      </div>
      <div class="user-content-right">
        <my-ques-collect />
      </div>
    </div>
  </div>
</template>

<script>
import CTS from '@/common/js/constant'
import { delCatalogueTypeByTree } from '@/common/js/util'
import { isLogin } from '@/common/js/util'
import { API } from '@/api/config'
import { mapState } from 'vuex'
import myQuesCollect from './books/my-ques-collect.vue'
export default {
  components: {
    myQuesCollect,
  },
  data() {
    return {
    }
  },
  computed: {
    tabActiveName() {
      return this.$route.query.tabActiveName
        ? this.$route.query.tabActiveName
        : 'myQuesCollect'
    },
  },
  watch: {
  },
  mounted() {
  },
  created() {
    this.activeName = this.tabActiveName
  },
  methods: {
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/mixins.scss";
@import "@/assets/css/variables.scss";
@import "@/assets/css/variables.scss";
.user-content {
  width: 1200px;
  min-height: 473px;
  margin-bottom: 20px;
  display: flex;

  .user-content-left {
    width: 270px;
    margin-right: 16px;
    background-color: $color-white;
    // .user-content-left-route {
    //   background-color: $color-white;
    //   min-height: 470px;

    .papers-right-title {
      height: 49px;
      padding: 20px;
      font-weight: bold;
      font-size: 14px;
      color: #333333;
      text-align: left;
      font-style: normal;
      text-transform: none;
      border-bottom: 2px solid #eeeeee;
    }

    .header {
      height: 48px;
      line-height: 48px;
      padding: 0 14px;
      color: $color-text-d;
      font-size: $font-size-medium;
      font-weight: bold;
      border-bottom: 1px solid $color-background-l;
      position: relative;
      box-sizing: border-box;

      .title {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 200px;
      }

      i {
        position: absolute;
        right: 14px;
        cursor: pointer;
        color: $color-theme;
      }
    }

    .content {
      padding: 17px 14px 17px 0;
    }

    // }
  }

  .user-content-right {
    width: 914px;
    background-color: $color-white;


    :deep(.el-tabs .el-tabs__header) {
      padding: 0 20px;
    }

    :deep(.el-tabs .el-tabs__header .el-tabs__nav .el-tabs__active-bar) {
      background-color: $color-theme;
    }

    :deep(.el-tabs .el-tabs__header .el-tabs__nav .is-active) {
      color: $color-theme;
    }
  }
}

// .school-question-tabs{
//   background-color: #FFFFFF;
//   margin-bottom: 10px;
//   &>span
//   {
//     display: inline-block;
//     width: 50%;
//     line-height: 40px;
//     text-align: center;
//     cursor: pointer;
//     &.active{
//       background-color: #487FFF;
//       color: #FFFFFF;
//     }
//   }
// }
.my-resources-list {
  margin-top: 20px;

  li {
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    padding: 0 16px;

    i {
      font-size: 16px;
      margin-right: 6px;
    }

    border-left: 3px solid #ffffff;
  }

  li.active {
    color: #487FFF;
    border-left: 3px solid #487FFF;
    background-color: #f3f7fb;
  }

  li:hover {
    color: #487FFF;
  }
}

// .school-question-tabs {
//   width: 100%;

//   // border-bottom: 1px solid #F4F4F5;
//   ul {
//     width: 100%;
//     height: 58px;
//     display: flex;
//     background: #f7f7f7;
//     text-align: center;

//     // box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.06);
//     li:nth-child(1) {
//       img:nth-child(2) {
//         left: 0;
//         width: 172px;
//       }
//     }

//     li:nth-child(2) {
//       img:nth-child(2) {
//         right: 0;
//         width: 172px;
//       }
//     }

//     img {
//       pointer-events: none;
//     }

//     .tab-bar {
//       width: 172px;
//       height: 100%;
//       text-align: center;
//       line-height: 58px;
//       font-size: 16px;
//       background-repeat: no-repeat;
//       background-size: 100% 100%;
//       position: relative;
//       cursor: pointer;
//       box-shadow: 0px 2px 2px -2px rgba(0, 0, 0, 0.1);

//       img {
//         position: absolute;
//         top: 0;
//         height: 100%;
//         z-index: 5;
//       }

//       span {
//         position: absolute;
//         z-index: 10;
//         left: 50px;
//       }
//     }

//     .activeTab {
//       span {
//         color: #487FFF;
//         font-weight: bold;
//       }
//     }
//   }
</style>
