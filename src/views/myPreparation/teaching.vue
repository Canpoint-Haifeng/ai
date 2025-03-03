<template>
  <div class="content-container">
    <div class="user-content">
      <div class="user-content-top">
        <ul class="my-resources-list">
          <li
            v-for="sub of tabsData"
            :key="sub.name"
            :class="{ active: sub.order == currentIndex }"
            @click="goLinkRoute(sub)"
          >
            {{ sub.name }}
          </li>
        </ul>
      </div>
      <div class="user-content-bottom">
        <knowledgeSelection
          v-if="currentIndex !== '2'"
          :current-index="currentIndex"
        />
        <Contribute v-else />
      </div>
    </div>
  </div>
</template>

<script>
import knowledgeSelection from './children/knowledge-selection.vue'
import Contribute from './children/contribute.vue'
import { mapState } from 'vuex'
export default {
  components: {
    knowledgeSelection,
    Contribute,
  },
  data() {
    return {
      tabsData: [
        {
          name: '我的教案',
          order: '0',
        },
        {
          name: '我的收藏',
          order: '1',
        },
        {
          name: '我的投稿',
          order: '2',
        },
      ],
      currentIndex: '0',
      currentPath: '',
    }
  },
  computed: {
    ...mapState(['currSubject']),
  },
  watch: {
    $route: {
      handler(newUrl, oldUrl) {
        this.currentIndex = newUrl.query.type ? newUrl.query.type : '0'
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    goLinkRoute(row) {
      if (row.order === this.currentIndex) return
      const data = ['', '?type=1', '?type=2']
      const url = `/preparation/myTeaching${data[row.order]}`
      this.$router.push({ path: url })
    },
  },
}
</script>

<style lang="scss" scoped>
.user-content {
  width: 1200px;
  min-height: 473px;
  margin-bottom: 70px;

  .user-content-top {
    background-color: $color-white;

    .my-resources-list {
      margin: 12px 0;
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
</style>
