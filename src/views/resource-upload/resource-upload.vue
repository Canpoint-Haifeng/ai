<template>
  <div class="content-container">
    <breadcrumb :crumbs-data="crumbsData" />
    <div class="resource-container clearfix">
      <div class="resource-main fl">
        <div class="step-wrapper">
          <div class="step-line" />
          <div class="step-content">
            <div
              class="step-item"
              :class="getActiveClass(1)"
            >
              <span
                v-if="activeStatus <= 1"
                class="step-title"
              >1</span>
              <span
                v-else
                class="step-title"
              >
                <i class="iconfont iconsuccess" />
              </span>
              <p class="step-text">
                选择文档
              </p>
            </div>
            <div
              class="step-item"
              :class="getActiveClass(2)"
            >
              <span
                v-if="activeStatus <= 2"
                class="step-title"
              >2</span>
              <span
                v-else
                class="step-title"
              >
                <i class="iconfont iconsuccess" />
              </span>
              <p class="step-text">
                完善信息
              </p>
            </div>
            <div
              class="step-item"
              :class="getActiveClass(3)"
            >
              <span
                v-if="activeStatus <= 3"
                class="step-title"
              >3</span>
              <span
                v-else
                class="step-title"
              >
                <i class="iconfont iconsuccess" />
              </span>
              <p class="step-text">
                完成上传
              </p>
            </div>
          </div>
        </div>
        <upload-box
          v-if="activeStatus === 1"
          @before-upload="onBeforeUpload"
        />
        <upload-doc
          v-if="activeStatus === 2"
          :doc-list="docList"
          @success-upload="onSuccessUpload"
        />
        <upload-success
          v-if="activeStatus === 3"
        />
      </div>
      <div class="resource-side fl">
        <resource-side />
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import UploadBox from './upload-box/upload-box'
import UploadDoc from './upload-doc/upload-doc'
import UploadSuccess from './upload-success/upload-success'
import ResourceSide from './resource-side/resource-side'
export default {
  components: {
    Breadcrumb,
    UploadBox,
    UploadDoc,
    UploadSuccess,
    ResourceSide
  },
  data() {
    return {
      crumbsData: [{
        path: '',
        isLink: false,
        text: '资源上传'
      }],
      docList: [],
      activeStatus: 1 // 当前状态
    }
  },
  methods: {
    // 监听文档上传前
    onBeforeUpload(docList) {
      this.docList = docList
      this.activeStatus = 2
    },
    // 监听文档上传成功
    onSuccessUpload() {
      this.activeStatus = 3
    },
    getActiveClass(stepIndex) {
      return this.activeStatus === stepIndex ? 'active' : (this.activeClass < stepIndex) ? '' : 'finish'
    }
  }
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
  .resource-container {
    min-height: 680px;
    margin-bottom: 70px;
  }
  .resource-main {
    position: relative;
    width: 914px;
    min-height: 680px;
    background: $color-white;
    margin-right: 286px;
    padding: 52px 58px;
    box-sizing: border-box;
  }
  .resource-content {
    padding: 0 22px 40px 72px;
  }
  .resource-side {
    position: relative;
    width: 270px;
    margin-left: -270px;
  }
  .step-wrapper {
    width: 100%;
    .step-line {
      border-top: 1px dashed $color-border;
    }
    .step-content {
      display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
      .step-item {
        width: 33.33%;
        text-align: center;
        .step-title {
          display: inline-block;
          width: 50px;
          height: 50px;
          line-height: 50px;
          margin-bottom: 12px;
          border-radius: 50%;
          border: 1px dashed $color-theme;
          background: $color-white;
          box-sizing: border-box;
          margin-top: -25px;
          text-align: center;
          color: $color-theme;
          font-size: 20px;
        }
        .step-text {
          color: $color-text-l;
        }
        &.active {
          .step-title {
            background: $color-theme;
            color: $color-white;
          }
          .step-text {
            color: $color-theme;
          }
        }
        &.finish {
          .step-title {
            background: $color-white;
            border: 1px solid #a2c8ff;
          }
          .iconsuccess {
            font-size: 50px;
            color: #a2c8ff;
          }
          .step-text {
            color: $color-text;
          }
        }
      }
    }
  }
</style>
