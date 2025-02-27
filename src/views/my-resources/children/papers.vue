<template>
  <div class="content-container">
    <div class="user-content">
      <div class="user-content-left">
        <div class="user-content-left-route">
          <div class="papers-right-title">
            我的卷库
          </div>
          <ul class="my-resources-list">
            <li
              v-for="item in tabsData"
              :class="{ active: activeName == item.activeName }"
              @click=" goLinkRoute(item)"
            >
              <span :class="item.icon"> {{ item.name }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="user-content-right">
        <component :is="activeName" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import MyPaper from './my-paper/my-paper.vue'
import myUploadPaper from './my-paper/my-upload-paper.vue'
import myPaperCollect from './my-collect/paper-collect.vue'
import myDownloadPaper from './my-paper/my-download-paper.vue'
export default {
  components: {
    MyPaper,
    myUploadPaper,
    myDownloadPaper,
    myPaperCollect,
  },
  data() {
    return {
      activeName: 'MyPaper',
      tabsData: [
        { name: '我的组卷', activeName: 'MyPaper', icon: "icon iconfont icon-wodezujuan" },
        { name: '我的自用', activeName: 'myUploadPaper', icon: "icon iconfont icon-a-wodejuanku-shangchuansvg" },
        { name: '我的收藏', activeName: 'myPaperCollect', icon: "icon iconfont icon-a-wodejuanku-shoucangsvg" },
        { name: '我的下载', activeName: 'myDownloadPaper', icon: "icon iconfont icon-wodejuanku-xiazai" },
      ],
      checkStrictly: false, // 控制可选和不可选
      treeLoading: false,
      questionId: '',
      questionDome: '',
      questionVisible: false,
      nickName: 'Smile',
      visible: false,
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: (data, node) => {
          return !data.type
        },
      },
      treeDataList: [],
    }
  },
  computed: {
    tabActiveName() {
      return this.$route.query.tabActiveName
        ? this.$route.query.tabActiveName
        : 'MyPaper'
    },
  },
  created() {
    this.activeName = this.tabActiveName
  },
  methods: {
    goLinkRoute(row) {
      this.activeName = row.activeName
      const url = '/paper/resources/papers?tabActiveName=' + row.activeName
      this.$router.push(url)
    },
  },
}
</script>
<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.user-content {
  width: 1200px;
  min-height: 473px;
  margin-bottom: 70px;
  display: flex;

  .user-content-left {
    width: 270px;
    margin-right: 16px;

    .user-content-left-route {
      background-color: $color-white;
      min-height: 470px;

      .papers-right-title {
        height: 49px;
        padding: 20px 0 10px 20px;
        font-weight: bold;
        font-size: 14px;
        color: #333333;
        text-align: left;
        font-style: normal;
        text-transform: none;
        border-bottom: 1px solid #eeeeee;
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
    min-height: 550px;
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
</style>
