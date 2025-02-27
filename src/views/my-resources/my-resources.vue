<template>
  <div class="content-container">
    <div class="my-resources-tabs">
      <ul class="tabs-left">
        <li
          v-for="sub of tabsData"
          :key="sub.name"
          :class="{ active: sub.path == currentPath }"
          @click=" goLinkRoute(sub)"
        >
          {{ sub.name }}
        </li>
      </ul>
      <div class="tabs-right">
        <div
          class="top-upload"
          @click="entryUpload"
        >
          <span class="icon-box">
            <i class="el-icon-upload" />
          </span>
          <span class="text">上传试卷</span>
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import resourceTabs from '@/components/Resources/myResource-tabs.vue'
export default {
  components: { resourceTabs },
  data() {
    return {
      tabsData: [
        { name: '我的卷库', path: '/paper/resources/papers' },
        { name: '我的题库', path: '/paper/resources/ques' },
        { name: '我的图书', path: '/paper/resources/books' },
        // { name: '我的分享', path: '/paper/resources/share' },
      ],
      currentPath: '/paper/resources/papers',
    }
  },
  watch: {
    $route: function (newUrl, oldUrl) {
      this.currentPath = newUrl.meta.subActive
    },
  },
  created() {
    this.currentPath = this.$route.meta.subActive
  },
  methods: {
    // 进入资源上传
    goLinkRoute(row) {
      this.currentPath = row.path
      this.$router.push(this.currentPath)
    },
    entryUpload() {
      this.$router.push({
        name: 'PaperUpload',
      })
    },
  },
}
</script>
<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.my-resources-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $color-white;
  margin: 20px 0;

  .tabs-left {
    display: flex;

    li {
      width: 88px;
      text-align: center;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      margin: 10px;
    }

    li.active {
      color: white;
      background-color: $color-theme;
      border-radius: 15px;
    }

    // li:hover {
    //   color: black;
    // }
  }

  .tabs-right {
    margin-right: 10px;

    .top-upload {
      display: inline-block;

      margin-top: auto;
      width: 100px;
      height: 30px;
      line-height: 30px;
      border: 1px solid $color-theme;
      border-radius: 4px;
      text-align: center;
      cursor: pointer;
      box-sizing: border-box;

      .icon-box {
        display: inline-block;
        margin-right: 3px;
        line-height: 30px;

        .el-icon-upload {
          font-size: 14px;
          color: $color-theme;
        }
      }

      .text {
        font-size: 14px;
        color: $color-theme;
      }

      &:hover {
        border: 1px solid #3e73cd;

        .text,
        .iconupload {
          color: #3e73cd;
        }
      }
    }
  }
}
</style>
