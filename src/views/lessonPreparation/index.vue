<template>
  <div class="content-container">
    <div class="user-content">
      <ul class="my-resources-list">
        <div
          v-for="sub of tabsData"
          :key="sub.name"
        >
          <li
            v-if="sub === tabsData[tabsData.length - 1]"
            :class="{ active: sub.order == isChapter }"
            @click=" handleTabsClick(sub.order)"
          >
            <i
              v-if="sub.order == isChapter"
              class="icon iconfont icon-calendar_time_add_line"
              style="margin-right: 4px;"
            />{{ sub.name }}
          </li>
          <li
            v-else
            :class="{ active: sub.order == isChapter }"
            @click=" handleTabsClick(sub.order)"
          >
            <i
              v-if="sub.order == isChapter"
              class="icon iconfont"
              :class="sub.order === 1 ? ' icon-notebook_2_line1' : 'icon-chart_bar_2_line'"
              style="margin-right: 4px;"
            />{{ sub.name
            }}<span />
          </li>
        </div>
      </ul>
      <knowledgeSelection :is-chapter="isChapter" />
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import knowledgeSelection from './children/knowledge-selection.vue'
import { mapState } from 'vuex'
export default {
  components: {
    knowledgeSelection,
  },
  data() {
    return {
      tabsData: [
        {
          name: '同步教案',
          order: 1
        },
        {
          name: '阶段复习',
          order: 2
        },
        {
          name: '专题备考',
          order: 3
        },
      ],
      isChapter: 1,
    }
  },
  computed: {
    ...mapState(['currSubject']),
  },
  watch: {
    $route: {
      handler(newUrl, oldUrl) {
      },
      immediate: true
    },
  },
  created() {
  },
  methods: {
    handleTabsClick(i) {
      this.isChapter = i
    },
  }
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.user-content {
  width: 1200px;
  min-height: 473px;
  margin-bottom: 20px;

  .my-resources-list {
    margin-top: 12px;
    display: flex;
    background-color: $color-white;

    li {
      width: 118px;
      text-align: center;
      height: 36px;
      line-height: 36px;
      cursor: pointer;
      margin: 12px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    span {
      position: absolute;
      height: 20px;
      width: 0;
      top: 8px;
      left: 129px;
      border-right: 1px solid rgb(226, 226, 226);
    }

    li.active {
      color: white;
      background: #487FFF;
      border-radius: 18px;
    }
  }
}
</style>