<template>
  <div class="content-container">
    <div class="user-content">
      <div class="user-content-left">
        <div class="user-content-left-route">
          <div class="papers-right-title">
            我的收藏
          </div>
          <ul class="my-resources-list">
            <li
              :class="{active:activeName=='PaperCollect'}"
              @click="activeName='PaperCollect'"
            >
              <i class="iconfont iconximubiao" />试卷收藏
            </li>
            <li
              :class="{active:activeName=='QuesCollect'}"
              @click="activeName='QuesCollect'"
            >
              <i class="iconfont iconshiti" />试题收藏
            </li>
          </ul>
        </div>
      </div>
      <div class="user-content-right">
        <component
          :is="activeName"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PaperCollect from './my-collect/paper-collect.vue'
import QuesCollect from './my-collect/ques-collect.vue'
export default {
  data() {
    return {
      activeName: 'PaperCollect'
    }
  },
  computed: {
    ...mapState(['currSubject', 'bookCurrent', 'gradeCurrent', 'volumeCurrent']),
    tabActiveName() {
      return this.$route.query.tabActiveName ? this.$route.query.tabActiveName : 'PaperCollect'
    }
  },
  components: {
    PaperCollect,
    QuesCollect
  },
  created() {
    this.activeName = this.tabActiveName
  }

}
</script>

<style lang="scss" scoped>

.user-content {
  width: 1200px;
  min-height: 673px;
  margin-bottom: 20px;
  display: flex;
  .user-content-left {
    width: 270px;
    margin-right: 16px;
    .user-content-left-route {
      background-color: $color-white;
      min-height: 470px;
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
    }
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
.my-resources-list {
  margin-top: 20px;
  li {
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    padding: 0 16px;
    i{
      font-size: 16px;
      margin-right: 6px;
    }
    border-left: 3px solid #FFFFFF;
  }
  li.active{
    background-color: #F3F7FB;
    color: #487FFF;
    border-left: 3px solid #487FFF;
  }
  li:hover {
    color: #487FFF;
  }
}
.papers-right-title{
  padding:0 20px ;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #999999;
  line-height: 49px;
  border-bottom: 1px solid  #EEEEEE;
}
</style>
