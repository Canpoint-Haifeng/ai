<template>
  <el-dialog
    :visible="dialogData.visible"
    custom-class="dia-three-gift-success"
    :title="dialogData.title"
    :modal-append-to-body="false"
    :modal="false"
    :close-on-click-modal="false"
    :show-close="false"
    :width="dialogWidth"
    @update:visible="dialogData.visible = $event"
  >
    <div
      v-if="activityData"
      class="three-gift-success-body"
    >
      <CpModal :background-color="activityData.backgroundColor" />
      <img
        class="three-gift-background"
        :style="{ width: activityData.w + 'px', height: activityData.h + 'px' }"
        :src="activityData.imageUrl"
      >
      <div
        v-for="(item, index) in activityData.buttonList"
        :key="index"
        class="activiy-botton-item"
        :style="{ top: item.top + 'px', left: item.left + 'px' }"
        @click="onClickItem(item)"
      >
        <img
          :src="item.imageUrl"
          :style="{ width: item.w + 'px', height: item.h + 'px' }"
        >
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import CpModal from '@/components/CpFan/Category/CpModal'
  export default {
    components: { CpModal },
    props: {
      activityData: {
        type: Object,
      },
    },
    data() {
      return {
        dialogData: {
          title: '',
          visible: true,
          width: '651px',
        },
      }
    },
    computed: {
      dialogWidth() {
        if (this.activityData && this.activityData.w) {
          return this.activityData.w + 'px'
        } else {
          return '651px'
        }
      },
    },
    methods: {
      onClickItem(item) {
        this.hidden()
        if (item.activityUrl) {
          this.openWindowLink(item.activityUrl)
        }
      },
      participation() {
        // this.$router.push({ path: '/fullactive/midtermexam' })
        this.hidden()
        // this.openSystemPathLink('fullactive/midtermexam')
        this.openWindowLink(this.activityData.activityUrl)
      },
      hidden() {
        this.$emit('endProcess', this.activityData.code)
      },
    },
  }
</script>
<style scoped lang="scss">
@import "@/assets/css/variables.scss";
  .three-gift-success-body {
    position: relative;

    .activiy-botton-item {
      position: absolute;
      cursor: pointer;
      user-select: none;
      img {
        -webkit-user-drag: none;
      }
    }

    .three-gift-background {
      -webkit-user-drag: none;
    }
  }

  .three-gift-close {
    position: absolute;
    right: 0px;
    top: 0px;

    img {
      width: 47px;
      height: 47px;
      cursor: pointer;
      -webkit-user-drag: none;
    }
  }

  :deep(.el-dialog.dia-three-gift-success) {
    background: transparent;
    box-shadow: none;
    border-radius: 10px;

    .el-dialog__header {
      display: none;
    }
  }
</style>

