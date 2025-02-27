<template>
  <div class="synchro-for-reference-segment">
    <div class="box-item">
      <div class="title tabs-list">
        <span
          v-for="item in tabsList"
          :key="item.code"
          class="tabs-item"
          :class="tabsValue == item.code ? 'active' : ''"
          @click="tabsValue = item.code"
        >{{ item.name }}</span>
      </div>
      <div
        v-if="tabsValue == 1"
        class="content"
      >
        <StageEntranceTestItem
          v-for="(item, index) in stageTestList"
          :key="index"
          :sub-index="index"
          :node="item"
          @open-paper-center="openPaperCenter"
        />
      </div>
      <div
        v-else
        class="content"
      >
        <StageEntranceTestItem
          v-for="(item, index) in entranceTestList"
          :key="index"
          :sub-index="index"
          :node="item"
          :type="2"
          @open-paper-center="openPaperCenter"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
  import StageEntranceTestItem from './StageEntranceTestItem'
  import { getStageEntranceBySubject } from '@/common/js/util'
  import { mapState } from 'vuex'
  export default {
    components: { StageEntranceTestItem },
    data() {
      return {
        stageTestList: [],
        entranceTestList: [],
        tabsList: [
          {
            code: 1,
            name: '阶段测试题',
          },
          {
            code: 2,
            name: '升学备考题',
          },
        ],
        tabsValue: 1,
      }
    },
    computed: {
      ...mapState(['currSubject']),
    },
    mounted() {
      this.initStageEntranceTest()
    },
    methods: {
      showLogin() {
        this.$emit('showLogin')
      },
      initStageEntranceTest() {
        this.stageTestList = getStageEntranceBySubject(
          this.currSubject.subjectCode,
          1,
        )
        this.entranceTestList = getStageEntranceBySubject(
          this.currSubject.subjectCode,
          2,
        )
      },
      openPaperCenter(item) {
        this.openSystemPathLink(`paper/center?type=${item.code}`)
      },
    },
  }
</script>

<style scoped lang="scss">
  .synchro-for-reference-segment {
    .box-item {
      width: 390px;
      height: 360px;
      background: #ffffff;
      border-radius: 6px;
      .title {
        padding: 0 20px;
        border-bottom: 1px solid #eeeeee;
      }
      .content {
        position: relative;
      }
    }
  }
  .title.tabs-list {
    .tabs-item {
      display: inline-block;
      margin-right: 40px;
      line-height: 59px;
      font-size: 16px;
      font-weight: 400;
      color: #666666;
      vertical-align: bottom;
      cursor: pointer;
      user-select: none;
      // height: 59px;
      // box-sizing: border-box;
      &.active {
        font-size: 20px;
        font-weight: bold;
        color: #4b8ff5;
        line-height: 57px;
        border-bottom: 2px solid #4b8ff5;
      }
    }
  }
</style>
