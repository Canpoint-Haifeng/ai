<template>
  <el-dialog
    v-model="collectDialog.visible"
    class="dialog-wrapper"
    :title="dialogTitle + '收藏'"
    :modal-append-to-body="false"
    :lock-scroll="false"
    :width="collectDialog.width"
  >
    <div class="dialog-content">
      <div class="dialog-tips">
        {{ dialogTitle }}已收藏，可在
        <span
          class="collect-message-text"
          @click="entryMyCollect"
        >我的资源-我的收藏</span>中查看
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          class="btn btn-shadow"
          @click="collectDialog.visible = false"
        >
          知道了
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

export default {
  name: 'CollectMessage',
  props: {
    collectInfo: {
      type: String,
      default: '我的资源-我的收藏',
    },
    collectPath: {
      type: String,
      default: '/paper/resources/collect',
    },
    dialogTitle: {
      type: String,
      default: '试卷',
    },
  },
  setup(props) {
    const router = useRouter()
    
    const collectDialog = ref({
      visible: false,
      title: '试卷收藏',
      showClose: true,
      width: '500px',
    })
    
    const entryMyCollect = () => {
      router.push(props.collectPath)
    }
    
    const showMessage = (isCollected) => {
      ElMessage({
        type: 'success',
        message: isCollected
          ? props.dialogTitle + '已收藏'
          : '已取消' + props.dialogTitle + '收藏',
      })
    }
    
    return {
      collectDialog,
      entryMyCollect,
      showMessage
    }
  }
}
</script>

<style lang="scss">
  .collect-message-text {
    font-weight: bold;
    color: #487FFF;
    cursor: pointer;
  }
  .message-box {
    min-width: 200px;
    height: 50px;
    line-height: 50px;
    border-radius: 6px;
    background: $color-background-d;
    box-shadow: 0px 4px 2px 0px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 1);
    padding: 0 65px;
    color: $color-white;
    font-size: $font-size-medium-x;
    border: none;
    .iconfinish {
      margin-right: 10px;
    }
  }
</style>
