<template>
  <div class="paper-upload">
    <breadcrumb :crumbs-data="crumbsData" />
    <!-- @tab-click="handleClick" -->
    <!-- <div class="tab-wrap">
      <el-tabs v-model="activeName">
        <el-tab-pane label="试卷上传-自用" name="first">
          <paper-upload-zy></paper-upload-zy>
        </el-tab-pane>
        <el-tab-pane label="试卷征集-平台" name="second">
          <paper-solicitation-pt></paper-solicitation-pt>
        </el-tab-pane>
        <el-tab-pane label="试卷上传-平台" name="three">
          <paper-upload-pt></paper-upload-pt>
        </el-tab-pane>
      </el-tabs>
    </div> -->
    <div class="tab-wrap">
      <paper-upload-zy />
    </div>

    <div class="resource-side fl">
      <ResourceSideCollect />
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, onActivated, onDeactivated } from 'vue'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import PaperUploadPt from './components/paper-upload-pt.vue'
import PaperUploadZy from './components/paper-upload-zy.vue'
import PaperSolicitationPt from './components/paper-solicitation-pt.vue'
import ResourceSideCollect from '@/views/resource-upload/resource-side/resource-side-collect.vue'
export default {
  components: {
    Breadcrumb,
    PaperUploadPt,
    PaperUploadZy,
    PaperSolicitationPt,
    ResourceSideCollect,
  },
  data() {
    return {
      activeName: 'first',
      crumbsData: [
        {
          path: '',
          isLink: false,
          text: '资源上传 ',
        },
      ],
    }
  },
  created() {
    let query = this.$route.query
    if (query.activeName) {
      this.activeName = query.activeName
    }
  },
}
</script>
<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
* {
  box-sizing: border-box;
}

.paper-upload {
  width: 1200px;
  min-width: 1200px;
  margin: 0 auto;
  padding-bottom: 70px;
  position: relative;

  .tab-wrap {
    background-color: $color-white;
    clear: both;
    width: calc(100% - 276px);
    padding: 20px 20px 80px 20px;
    border-radius: 10px 10px 10px 10px;
    border: 1px solid #ff9457;

    :deep(.el-tabs .el-tabs__header) {
      padding: 0 20px;
    }

    :deep(.el-tabs .el-tabs__header .el-tabs__nav .el-tabs__active-bar) {
      background-color: $color-theme;
    }

    :deep(.el-tabs .el-tabs__header .el-tabs__nav .is-active) {
      color: $color-theme;
    }

    :deep(.el-tabs__active-bar) {
      width: 45px !important;
      margin-left: 21px;
    }
  }

  .resource-side {
    position: absolute;
    width: 260px;
    top: 20px;
    right: 0px;
  }
}
</style>
