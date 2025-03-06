<template>
  <el-dialog
    :visible="dialogData.visible"
    custom-class="dia-three-gift-success"
    :title="dialogData.title"
    :modal-append-to-body="false"
    :modal="false"
    :close-on-click-modal="false"
    :show-close="false"
    :width="dialogData.width"
    @update:visible="dialogData.visible = $event"
  >
    <div class="three-gift-success-body">
      <CpModal />
      <img
        class="three-gift-background"
        src="http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/d1fab413-e47e-42c1-b686-449659d11134.png"
      >

      <div class="three-gift-btn">
        <img
          src="http://cp-cloud-files-tiku.oss-cn-hangzhou.aliyuncs.com/png/2c02457f-244a-46a0-8067-cec60c9e27f4.png"
          @click="participation"
        >
      </div>

      <div class="three-gift-close">
        <img
          src="@/assets/images/activity/goodgift/18.png"
          @click="hidden"
        >
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import CpModal from '@/components/CpFan/Category/CpModal'
  export default {
    components: { CpModal },
    data() {
      return {
        dialogData: {
          title: '',
          visible: true,
          width: '651px',
        },
      }
    },
    methods: {
      participation() {
        // this.$router.push({ path: '/fullactive/midtermexam' })
        this.hidden()
        this.openSystemPathLink('fullactive/midtermexam')
      },
      hidden() {
        this.$emit('endProcess', 'helpMidtermActivity')
      },
    },
  }
</script>
<style scoped lang="scss">
@import "@/assets/css/variables.scss";
  .three-gift-success-body {
    position: relative;
    .three-gift-background {
      width: 666px;
      height: 596px;
      -webkit-user-drag: none;
    }
    .three-gift-btn {
      position: absolute;
      left: 226px;
      top: 557px;
      img {
        width: 183px;
        height: 77px;
        cursor: pointer;
        -webkit-user-drag: none;
      }
    }
    .three-gift-footer {
      position: absolute;
      width: 100%;
      bottom: 40px;
      text-align: center;
      .no-participation {
        display: inline-block;
        width: 135px;
        height: 41px;
        background: #b5b7c7;
        border-radius: 20px;
        color: white;
        line-height: 41px;
        text-align: center;
        margin-right: 30px;
        cursor: pointer;
        user-select: none;
      }
      .go-participation {
        display: inline-block;
        width: 135px;
        height: 41px;
        background: #ff6800;
        border-radius: 20px;
        color: white;
        line-height: 41px;
        text-align: center;
        cursor: pointer;
        user-select: none;
        &:hover {
          background: #fa6a0b;
        }
      }
    }
  }

  .three-gift-close {
    position: absolute;
    right: 110px;
    top: 72px;
    font-size: 30px;
    img {
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

