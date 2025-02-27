<template>
  <div
    class="status-box"
    :class="statusClass"
  >
    <el-alert
      v-if="data.isPublished === 2"
      title="该教案已被管理员下架，仅自己可见！"
      type="warning"
      :closable="false"
      show-icon
      class="my-custom-alert"
    />
    <el-alert
      v-else-if="data.apprStatus === 3"
      title="投稿审核中，不可编辑！"
      type="info"
      :closable="false"
      show-icon
    />
    <!-- 可以根据更多的状态添加其他条件 -->
  </div>
</template>

<script>
export default {
  name: 'StatusNotice',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    statusClass() {
      if (this.data.isPublished === 2) {
        return 'status-warning'
      }
      if (this.data.apprStatus === 3) {
        return 'status-info'
      }
      return '' // 确保有默认返回值
    },
  },
}
</script>

<style lang="scss" scoped>
  @use "@/assets/css/variables" as *;
.status-box {
  color: #000000;
  padding: 8px;
  border-radius: 4px;
  height: 54px;
  border-radius: 3px 3px 3px 3px;
}

.status-info {
  .el-alert__icon {
    color: #0052D9 !important;
  }
  background-color: #D4E3FC;
  .el-alert--info.is-light {
    background-color: #D4E3FC;
    .el-alert__icon {
      color: #0052D9 !important;
    }
    .el-alert__icon:before {
      color: #0052D9;
    }
    .el-icon-info:before {
      color: #0052D9;
    }
  }
}

.status-warning {
  .el-alert__icon {
    color: #ED7B2F !important;
  }
  background-color: #F9E0C7;
  .el-alert--info.is-light {
    background-color: #F9E0C7;
  }
  .el-alert__icon {
    color: #ED7B2F !important;
  }
}

.el-alert__icon el-icon-info {

}
</style>
